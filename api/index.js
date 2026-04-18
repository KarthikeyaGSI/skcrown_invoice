const { getConfig } = require('../src/config');
const { initPool } = require('../src/db');
const { createApp } = require('../src/app');

const app = createApp();
let poolInit;

module.exports = async (req, res) => {
  try {
    if (!poolInit) {
      const config = getConfig();
      poolInit = initPool(config.db);
    }

    await poolInit;
    return app(req, res);
  } catch (error) {
    console.error('Serverless startup error:', error);
    return res.status(500).json({ message: 'Serverless initialization failed.' });
  }
};
