const express = require('express');
const path = require('path');
const { initPool, closePool } = require('./db');
const { sanitizeText, validateItems } = require('./validators');
const {
  createTempDocument,
  getTempDocumentById,
  moveToHistoryAndDelete,
  convertQuotationToInvoice,
  getDashboardData,
  archiveAndDeleteExpiredDocuments
} = require('./documentService');
const { createDocumentPdf } = require('./pdfService');

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.post('/api/create-quotation', async (req, res) => {
  try {
    const clientName = sanitizeText(req.body.clientName);
    const type = req.body.type === 'invoice' ? 'invoice' : 'quotation';

    if (!clientName) {
      return res.status(400).json({ message: 'Client name is required.' });
    }

    const itemsValidation = validateItems(req.body.items);
    if (!itemsValidation.ok) {
      return res.status(400).json({ message: itemsValidation.message });
    }

    const totalAmount = Number(itemsValidation.items.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2));

    const doc = await createTempDocument({
      clientName,
      items: itemsValidation.items,
      totalAmount,
      type
    });

    return res.status(201).json({ message: 'Document created.', document: doc });
  } catch (error) {
    console.error('create-quotation error:', error);
    return res.status(500).json({ message: 'Failed to create quotation.' });
  }
});

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
    await moveToHistoryAndDelete(doc);

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

app.get('/', (_req, res) => {
  res.redirect('/dashboard.html');
});

const hourlyMs = 60 * 60 * 1000;
setInterval(async () => {
  try {
    const removed = await archiveAndDeleteExpiredDocuments();
    if (removed > 0) {
      console.log(`Cron cleanup: archived and removed ${removed} expired temp documents.`);
    }
  } catch (error) {
    console.error('Cron cleanup error:', error);
  }
}, hourlyMs);

async function start() {
  try {
    await initPool();

    app.listen(port, () => {
      console.log(`SK Crown app running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  await closePool();
  process.exit(0);
});

start();
