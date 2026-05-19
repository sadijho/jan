const db = require('../config/db');

const OrderHistory = {
  // Pobieranie wszystkich wpisów z historii zamówień
  findAll: (callback) => {
    const query = `
      SELECT oh.id, oh.order_id, oh.status_change_date, oh.changed_by_user_id, u.username AS changed_by_username
      FROM OrderHistory oh
      JOIN Users u ON oh.changed_by_user_id = u.id
    `;
    db.query(query, callback);
  },

  // Pobieranie historii zamówienia po ID zamówienia
  findByOrderId: (orderId, callback) => {
    const query = `
      SELECT oh.id, oh.status_change_date, oh.changed_by_user_id, u.username AS changed_by_username
      FROM OrderHistory oh
      JOIN Users u ON oh.changed_by_user_id = u.id
      WHERE oh.order_id = ?
    `;
    db.query(query, [orderId], callback);
  },

  // Tworzenie wpisu w historii zamówienia
  create: (data, callback) => {
    const query = `
      INSERT INTO OrderHistory (order_id, status_change_date, changed_by_user_id)
      VALUES (?, NOW(), ?)
    `;
    db.query(query, [data.orderId, data.changedByUserId], callback);
  },
};

module.exports = OrderHistory;
