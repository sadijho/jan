const db = require('../config/db');

const Product = {
  create: (data, callback) => {
    const query = 'INSERT INTO Products (name, description, quantity, status, location_id) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [data.name, data.description, data.quantity, data.status, data.locationId], callback);
  },

  findAllPaginated: (limit, offset, callback) => {
    const query = `
      SELECT SQL_CALC_FOUND_ROWS * FROM Products
      LIMIT ? OFFSET ?
    `;
    db.query(query, [limit, offset], (err, results) => {
      if (err) return callback(err);

      db.query('SELECT FOUND_ROWS() AS totalCount', (err, countResults) => {
        if (err) return callback(err);

        const totalCount = countResults[0].totalCount;
        callback(null, results, totalCount);
      });
    });
  },

  findById: (id, callback) => {
    const query = 'SELECT * FROM Products WHERE id = ?';
    console.log('Zapytanie SQL do pobrania produktu:', query);
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error('Błąd podczas pobierania produktu:', err);
      }
      console.log('Dane produktu z bazy:', results);
      callback(err, results);
    });
  },

  update: (id, data, callback) => {
    const query = `
      UPDATE Products
      SET name = ?, description = ?, quantity = ?, status = ?, location_id = ?
      WHERE id = ?
    `;
    db.query(
      query,
      [data.name, data.description, data.quantity, data.status, data.locationId, id],
      callback
    );
  },

  delete: (id, callback) => {
    const query = 'DELETE FROM Products WHERE id = ?';
    db.query(query, [id], callback);
  },
};

module.exports = Product;
