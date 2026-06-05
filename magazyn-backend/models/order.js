const db = require('../config/db');

const Order = {
  create: (data, callback) => {
    const query = `
      INSERT INTO Orders
        (user_id, status, due_date, start_date, end_date, assigned_technical_user_id, note)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [
        data.userId,
        data.status,
        data.dueDate || data.endDate,
        data.startDate,
        data.endDate,
        data.assignedTechnicalUserId || null,
        data.note || null,
      ],
      callback
    );
  },

  findAll: (callback) => {
    const query = 'SELECT * FROM Orders';
    db.query(query, callback);
  },

  findById: (id, callback) => {
    const query = `
      SELECT
        id,
        user_id,
        status,
        due_date,
        start_date,
        end_date,
        assigned_technical_user_id,
        note
      FROM Orders
      WHERE id = ?
    `;

    db.query(query, [id], callback);
  },

  updateStatus: (id, status, callback) => {
    const query = 'UPDATE Orders SET status = ? WHERE id = ?';
    db.query(query, [status, id], callback);
  },

  findCustom: (query, params, callback) => {
    db.query(query, params, callback);
  },
};

module.exports = Order;