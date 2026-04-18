const oracledb = require('oracledb');
const { withConnection } = require('./db');

function parseItems(itemsJson) {
  if (!itemsJson) return [];
  return JSON.parse(itemsJson);
}

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
      items: parseItems(row.ITEMS_JSON),
      totalAmount: Number(row.TOTAL_AMOUNT),
      type: row.TYPE,
      createdAt: row.CREATED_AT
    };
  });
}

async function archiveAndDeleteById(id) {
  return withConnection(async (connection) => {
    const lockResult = await connection.execute(
      `SELECT id, client_name, total_amount, created_at
       FROM TEMP_DOCUMENTS
       WHERE id = :id
       FOR UPDATE`,
      { id }
    );

    if (lockResult.rows.length === 0) {
      return false;
    }

    const row = lockResult.rows[0];

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
    await connection.commit();

    return true;
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

function getLastSevenDaysKeys() {
  const keys = [];
  for (let i = 6; i >= 0; i -= 1) {
    const day = new Date();
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - i);
    keys.push(day.toISOString().slice(0, 10));
  }
  return keys;
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

    const byDay = new Map(activity.rows.map((row) => [row.DAY, Number(row.AMOUNT)]));
    const mergedActivity = getLastSevenDaysKeys().map((day) => ({
      day,
      amount: byDay.get(day) || 0
    }));

    return {
      totalRevenue: Number(revenue.rows[0].TOTAL_REVENUE),
      clientCount: Number(clientCount.rows[0].CLIENT_COUNT),
      activity: mergedActivity,
      recentClients: recent.rows.map((row) => ({
        clientName: row.CLIENT_NAME,
        totalAmount: Number(row.TOTAL_AMOUNT),
        createdAt: row.CREATED_AT
      }))
    };
  });
}

async function archiveAndDeleteExpiredDocuments(retentionHours) {
  return withConnection(async (connection) => {
    const result = await connection.execute(
      `SELECT id, client_name, total_amount, created_at
       FROM TEMP_DOCUMENTS
       WHERE created_at < SYSTIMESTAMP - NUMTODSINTERVAL(:retentionHours, 'HOUR')
       FOR UPDATE SKIP LOCKED`,
      { retentionHours }
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
  archiveAndDeleteById,
  convertQuotationToInvoice,
  getDashboardData,
  archiveAndDeleteExpiredDocuments
};
