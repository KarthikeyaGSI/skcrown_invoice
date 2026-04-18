const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

function requireEnv(name) {
  const value = process.env[name];
  if (!value || !String(value).trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getConfig() {
  return {
    port: Number(process.env.PORT || 3000),
    db: {
      user: requireEnv('DB_USER'),
      password: requireEnv('DB_PASSWORD'),
      connectString: requireEnv('DB_CONNECT_STRING'),
      poolMin: Number(process.env.DB_POOL_MIN || 1),
      poolMax: Number(process.env.DB_POOL_MAX || 5)
    },
    retention: {
      documentHours: Number(process.env.DOCUMENT_RETENTION_HOURS || 24),
      pdfHours: Number(process.env.PDF_RETENTION_HOURS || 48)
    }
  };
}

module.exports = { getConfig };
