const oracledb = require('oracledb');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

let pool;

async function initPool() {
  if (pool) return pool;

  pool = await oracledb.createPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING,
    poolMin: Number(process.env.DB_POOL_MIN || 1),
    poolMax: Number(process.env.DB_POOL_MAX || 5),
    poolIncrement: 1
  });

  return pool;
}

async function withConnection(handler) {
  let connection;
  try {
    connection = await pool.getConnection();
    return await handler(connection);
  } finally {
    if (connection) await connection.close();
  }
}

async function closePool() {
  if (pool) {
    await pool.close(10);
    pool = null;
  }
}

module.exports = {
  initPool,
  withConnection,
  closePool
};
