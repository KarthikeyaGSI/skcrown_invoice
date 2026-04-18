const { getConfig } = require('./config');
const { initPool, closePool } = require('./db');
const { archiveAndDeleteExpiredDocuments } = require('./documentService');
const { cleanupOldPdfFiles } = require('./pdfService');
const { createApp } = require('./app');

const config = getConfig();
const app = createApp();

async function runCleanupCycle() {
  try {
    const archived = await archiveAndDeleteExpiredDocuments(config.retention.documentHours);
    const deletedPdfs = await cleanupOldPdfFiles(config.retention.pdfHours);

    if (archived > 0 || deletedPdfs > 0) {
      console.log(`Cleanup: archived=${archived}, removed_pdfs=${deletedPdfs}`);
    }
  } catch (error) {
    console.error('Cleanup cycle error:', error);
  }
}

const hourlyMs = 60 * 60 * 1000;
setInterval(runCleanupCycle, hourlyMs);

async function start() {
  try {
    await initPool(config.db);
    await runCleanupCycle();

    app.listen(config.port, () => {
      console.log(`SK Crown app running at http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
}

async function shutdown() {
  await closePool();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

start();
