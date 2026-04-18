const oracledb = require('oracledb');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.fetchAsString = [oracledb.CLOB];

let pool;

async function initPool(dbConfig) {
  if (pool) return pool;

  pool = await oracledb.createPool({
    user: dbConfig.user,
    password: dbConfig.password,
    connectString: dbConfig.connectString,
    poolMin: dbConfig.poolMin,
    poolMax: dbConfig.poolMax,
    poolIncrement: 1
  });

  return pool;
}

async function withConnection(handler) {
  if (!pool) {
    throw new Error('Oracle pool is not initialized.');
  }

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
