const express = require('express');
const helmet = require('helmet');
const path = require('path');
const { validateClientName, validateItems } = require('./validators');
const {
  createTempDocument,
  getTempDocumentById,
  archiveAndDeleteById,
  convertQuotationToInvoice,
  getDashboardData,
  archiveAndDeleteExpiredDocuments
} = require('./documentService');
const { createDocumentPdf, cleanupOldPdfFiles } = require('./pdfService');
const { getConfig } = require('./config');

function createApp() {
  const app = express();

  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(express.json({ limit: '1mb' }));
  app.use(express.static(path.join(__dirname, '..', 'public')));

  async function createDocumentHandler(req, res, forcedType) {
    try {
      const clientValidation = validateClientName(req.body.clientName);
      if (!clientValidation.ok) {
        return res.status(400).json({ message: clientValidation.message });
      }

      const type = forcedType || (req.body.type === 'invoice' ? 'invoice' : 'quotation');

      const itemsValidation = validateItems(req.body.items);
      if (!itemsValidation.ok) {
        return res.status(400).json({ message: itemsValidation.message });
      }

      const totalAmount = Number(itemsValidation.items.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2));

      const doc = await createTempDocument({
        clientName: clientValidation.clientName,
        items: itemsValidation.items,
        totalAmount,
        type
      });

      return res.status(201).json({ message: 'Document created.', document: doc });
    } catch (error) {
      console.error('create document error:', error);
      return res.status(500).json({ message: 'Failed to create document.' });
    }
  }

  app.post('/api/create-quotation', (req, res) => createDocumentHandler(req, res, null));
  app.post('/api/create-invoice', (req, res) => createDocumentHandler(req, res, 'invoice'));

  app.post('/api/convert-to-invoice/:id', async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: 'Invalid document id.' });
      }

      const updated = await convertQuotationToInvoice(id);
      if (!updated) {
        return res.status(404).json({ message: 'Quotation not found.' });
      }

      return res.json({ message: 'Quotation converted to invoice.' });
    } catch (error) {
      console.error('convert-to-invoice error:', error);
      return res.status(500).json({ message: 'Failed to convert quotation.' });
    }
  });

  app.post('/api/generate-pdf', async (req, res) => {
    try {
      const id = Number(req.body.documentId);
      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: 'Valid documentId is required.' });
      }

      const doc = await getTempDocumentById(id);
      if (!doc) {
        return res.status(404).json({ message: 'Document not found.' });
      }

      const downloadPath = await createDocumentPdf(doc);
      const archived = await archiveAndDeleteById(id);

      if (!archived) {
        return res.status(409).json({ message: 'Document was already archived. Please refresh and retry.' });
      }

      return res.json({ message: 'PDF generated successfully.', downloadPath });
    } catch (error) {
      console.error('generate-pdf error:', error);
      return res.status(500).json({ message: 'Failed to generate PDF.' });
    }
  });

  app.get('/api/dashboard', async (_req, res) => {
    try {
      const dashboard = await getDashboardData();
      return res.json(dashboard);
    } catch (error) {
      console.error('dashboard error:', error);
      return res.status(500).json({ message: 'Failed to load dashboard.' });
    }
  });


  app.post('/api/run-cleanup', async (req, res) => {
    try {
      const token = process.env.CLEANUP_TOKEN;
      if (token && req.headers['x-cleanup-token'] !== token) {
        return res.status(401).json({ message: 'Unauthorized cleanup request.' });
      }

      const config = getConfig();
      const archived = await archiveAndDeleteExpiredDocuments(config.retention.documentHours);
      const removedPdfs = await cleanupOldPdfFiles(config.retention.pdfHours);

      return res.json({ message: 'Cleanup completed.', archived, removedPdfs });
    } catch (error) {
      console.error('manual cleanup error:', error);
      return res.status(500).json({ message: 'Cleanup failed.' });
    }
  });

  app.get('/', (_req, res) => {
    res.redirect('/dashboard.html');
  });

  return app;
}

module.exports = { createApp };
