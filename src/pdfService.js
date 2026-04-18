const fs = require('fs/promises');
const path = require('path');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');

const downloadsDir = path.join(__dirname, '..', 'public', 'downloads');

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

async function createDocumentPdf({ id, clientName, items, totalAmount, type, createdAt }) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  page.drawText(`SK Crown ${type === 'invoice' ? 'Invoice' : 'Quotation'}`, {
    x: 50,
    y: 790,
    size: 22,
    font: bold,
    color: rgb(0.1, 0.2, 0.5)
  });

  page.drawText(`Document ID: ${id}`, { x: 50, y: 760, size: 10, font });
  page.drawText(`Client: ${clientName}`, { x: 50, y: 742, size: 12, font });
  page.drawText(`Date: ${new Date(createdAt).toLocaleString()}`, { x: 50, y: 724, size: 10, font });

  page.drawText('Item', { x: 50, y: 690, size: 11, font: bold });
  page.drawText('Qty', { x: 290, y: 690, size: 11, font: bold });
  page.drawText('Price', { x: 350, y: 690, size: 11, font: bold });
  page.drawText('Total', { x: 450, y: 690, size: 11, font: bold });

  let y = 670;
  items.forEach((item) => {
    page.drawText(item.name, { x: 50, y, size: 10, font });
    page.drawText(String(item.qty), { x: 290, y, size: 10, font });
    page.drawText(formatCurrency(item.price), { x: 350, y, size: 10, font });
    page.drawText(formatCurrency(item.lineTotal), { x: 450, y, size: 10, font });
    y -= 18;
  });

  page.drawText(`Grand Total: ${formatCurrency(totalAmount)}`, {
    x: 350,
    y: y - 20,
    size: 14,
    font: bold
  });

  const bytes = await pdf.save();
  const fileName = `${type}-${id}-${Date.now()}.pdf`;
  const filePath = path.join(downloadsDir, fileName);

  await fs.writeFile(filePath, bytes);
  return `/downloads/${fileName}`;
}

async function cleanupOldPdfFiles(retentionHours) {
  const cutoff = Date.now() - (retentionHours * 60 * 60 * 1000);
  const files = await fs.readdir(downloadsDir);
  let removed = 0;

  for (const file of files) {
    if (!file.endsWith('.pdf')) continue;
    const fullPath = path.join(downloadsDir, file);
    const stat = await fs.stat(fullPath);
    if (stat.mtimeMs < cutoff) {
      await fs.unlink(fullPath);
      removed += 1;
    }
  }

  return removed;
}

module.exports = {
  createDocumentPdf,
  cleanupOldPdfFiles
};
