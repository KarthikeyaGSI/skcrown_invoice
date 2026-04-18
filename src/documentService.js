const oracledb = require('oracledb');
const { withConnection } = require('./db');

async function createTempDocument({ clientName, items, totalAmount, type }) {
  return withConnection(async (connection) => {
    const result = await connection.execute(
      `INSERT INTO TEMP_DOCUMENTS (client_name, items_json, total_amount, type)
       VALUES (:client_name, :items_json, :total_amount, :type)
       RETURNING id, created_at INTO :id, :created_at`,
      {
        client_name: clientName,
        items_json: JSON.stringify(items),
        total_amount: totalAmount,
        type,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        created_at: { dir: oracledb.BIND_OUT, type: oracledb.DATE }
      },
      { autoCommit: true }
    );

    return {
      id: result.outBinds.id[0],
      createdAt: result.outBinds.created_at[0],
      clientName,
      items,
      totalAmount,
      type
    };
  });
}

async function getTempDocumentById(id) {
  return withConnection(async (connection) => {
    const result = await connection.execute(
      `SELECT id, client_name, items_json, total_amount, type, created_at
       FROM TEMP_DOCUMENTS
       WHERE id = :id`,
      { id }
    );

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      id: row.ID,
      clientName: row.CLIENT_NAME,
      items: JSON.parse(row.ITEMS_JSON),
      totalAmount: Number(row.TOTAL_AMOUNT),
      type: row.TYPE,
      createdAt: row.CREATED_AT
    };
  });
}

async function moveToHistoryAndDelete(doc) {
  return withConnection(async (connection) => {
    await connection.execute(
      `INSERT INTO CLIENT_HISTORY (client_name, total_amount, created_at)
       VALUES (:client_name, :total_amount, :created_at)`,
      {
        client_name: doc.clientName,
        total_amount: doc.totalAmount,
        created_at: doc.createdAt
      }
    );

    await connection.execute('DELETE FROM TEMP_DOCUMENTS WHERE id = :id', { id: doc.id });

    await connection.commit();
  });
}

async function convertQuotationToInvoice(id) {
  return withConnection(async (connection) => {
    const result = await connection.execute(
      `UPDATE TEMP_DOCUMENTS
       SET type = 'invoice'
       WHERE id = :id AND type = 'quotation'`,
      { id },
      { autoCommit: true }
    );

    return result.rowsAffected || 0;
  });
}

async function getDashboardData() {
  return withConnection(async (connection) => {
    const revenue = await connection.execute(
      'SELECT NVL(SUM(total_amount), 0) AS TOTAL_REVENUE FROM CLIENT_HISTORY'
    );

    const clientCount = await connection.execute(
      'SELECT COUNT(DISTINCT client_name) AS CLIENT_COUNT FROM CLIENT_HISTORY'
    );

    const activity = await connection.execute(
      `SELECT TO_CHAR(TRUNC(created_at), 'YYYY-MM-DD') AS DAY, NVL(SUM(total_amount), 0) AS AMOUNT
       FROM CLIENT_HISTORY
       WHERE created_at >= TRUNC(SYSDATE) - 6
       GROUP BY TRUNC(created_at)
       ORDER BY DAY`
    );

    const recent = await connection.execute(
      `SELECT client_name, total_amount, created_at
       FROM CLIENT_HISTORY
       ORDER BY created_at DESC
       FETCH FIRST 10 ROWS ONLY`
    );

    return {
      totalRevenue: Number(revenue.rows[0].TOTAL_REVENUE),
      clientCount: Number(clientCount.rows[0].CLIENT_COUNT),
      activity: activity.rows.map((row) => ({ day: row.DAY, amount: Number(row.AMOUNT) })),
      recentClients: recent.rows.map((row) => ({
        clientName: row.CLIENT_NAME,
        totalAmount: Number(row.TOTAL_AMOUNT),
        createdAt: row.CREATED_AT
      }))
    };
  });
}

async function archiveAndDeleteExpiredDocuments() {
  return withConnection(async (connection) => {
    const result = await connection.execute(
      `SELECT id, client_name, total_amount, created_at
       FROM TEMP_DOCUMENTS
       WHERE created_at < SYSTIMESTAMP - INTERVAL '24' HOUR`
    );

    for (const row of result.rows) {
      await connection.execute(
        `INSERT INTO CLIENT_HISTORY (client_name, total_amount, created_at)
         VALUES (:client_name, :total_amount, :created_at)`,
        {
          client_name: row.CLIENT_NAME,
          total_amount: row.TOTAL_AMOUNT,
          created_at: row.CREATED_AT
        }
      );

      await connection.execute('DELETE FROM TEMP_DOCUMENTS WHERE id = :id', { id: row.ID });
    }

    await connection.commit();

    return result.rows.length;
  });
}

module.exports = {
  createTempDocument,
  getTempDocumentById,
  moveToHistoryAndDelete,
  convertQuotationToInvoice,
  getDashboardData,
  archiveAndDeleteExpiredDocuments
};
