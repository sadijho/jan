const db = require('../config/db');

const OrderProducts = {
  findAll: (limit, offset, callback) => {
    const query = `
      SELECT SQL_CALC_FOUND_ROWS
             op.order_id,
             op.product_id,
             op.quantity,
             p.name AS product_name,
             p.description AS product_description,
             o.user_id,
             u.first_name,
             u.last_name
      FROM OrderProducts op
      JOIN Products p ON op.product_id = p.id
      JOIN Orders o ON op.order_id = o.id
      JOIN Users u ON o.user_id = u.id
      ORDER BY o.id DESC
      LIMIT ? OFFSET ?
    `;

    db.query(query, [limit, offset], (err, results) => {
      if (err) return callback(err);

      db.query('SELECT FOUND_ROWS() AS totalCount;', (err, countResults) => {
        if (err) return callback(err);

        const totalCount = countResults[0].totalCount;
        callback(null, results, totalCount);
      });
    });
  },

  findByOrderId: (orderId, callback) => {
    const query = `
      SELECT op.order_id,
             op.product_id,
             op.quantity,
             p.name AS product_name,
             p.description AS product_description,
             o.user_id,
             u.first_name,
             u.last_name
      FROM OrderProducts op
      JOIN Products p ON op.product_id = p.id
      JOIN Orders o ON op.order_id = o.id
      JOIN Users u ON o.user_id = u.id
      WHERE op.order_id = ?
    `;

    db.query(query, [orderId], callback);
  },

  findByUserId: (userId, limit, offset, callback) => {
    const query = `
      SELECT SQL_CALC_FOUND_ROWS
             op.order_id,
             op.product_id,
             op.quantity,
             p.name AS product_name,
             p.description AS product_description,
             o.user_id,
             u.first_name,
             u.last_name
      FROM OrderProducts op
      JOIN Products p ON op.product_id = p.id
      JOIN Orders o ON op.order_id = o.id
      JOIN Users u ON o.user_id = u.id
      WHERE o.user_id = ?
      ORDER BY o.id DESC
      LIMIT ? OFFSET ?
    `;

    db.query(query, [userId, limit, offset], (err, results) => {
      if (err) return callback(err);

      db.query('SELECT FOUND_ROWS() AS totalCount;', (err, countResults) => {
        if (err) return callback(err);

        const totalCount = countResults[0].totalCount;
        callback(null, results, totalCount);
      });
    });
  },

  create: (data, callback) => {
    const query = 'INSERT INTO OrderProducts (order_id, product_id, quantity) VALUES (?, ?, ?)';
    db.query(query, [data.orderId, data.productId, data.quantity], callback);
  },
};

module.exports = OrderProducts;