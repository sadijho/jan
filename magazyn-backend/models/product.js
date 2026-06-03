const db = require('../config/db');

const Product = {
  create: (data, callback) => {
    const query = `
      INSERT INTO Products
        (name, description, quantity, status, location_id, manufacturer_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [
        data.name,
        data.description,
        data.quantity,
        data.status,
        data.locationId,
        data.manufacturerId || null,
      ],
      callback
    );
  },

  findAllPaginated: (limit, offset, callback) => {
    const query = `
      SELECT SQL_CALC_FOUND_ROWS
             p.*,
             wl.code AS location_code,
             m.name AS manufacturer_name,
             m.country AS manufacturer_country
      FROM Products p
      LEFT JOIN WarehouseLocations wl ON p.location_id = wl.id
      LEFT JOIN Manufacturers m ON p.manufacturer_id = m.id
      ORDER BY p.id DESC
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
    const query = `
      SELECT p.*,
             wl.code AS location_code,
             m.name AS manufacturer_name,
             m.country AS manufacturer_country
      FROM Products p
      LEFT JOIN WarehouseLocations wl ON p.location_id = wl.id
      LEFT JOIN Manufacturers m ON p.manufacturer_id = m.id
      WHERE p.id = ?
    `;

    db.query(query, [id], callback);
  },

  update: (id, data, callback) => {
    const query = `
      UPDATE Products
      SET name = ?,
          description = ?,
          quantity = ?,
          status = ?,
          location_id = ?,
          manufacturer_id = ?
      WHERE id = ?
    `;

    db.query(
      query,
      [
        data.name,
        data.description,
        data.quantity,
        data.status,
        data.locationId,
        data.manufacturerId || null,
        id,
      ],
      callback
    );
  },

  delete: (id, callback) => {
    const query = 'DELETE FROM Products WHERE id = ?';
    db.query(query, [id], callback);
  },

  findCustom: (query, params, callback) => {
    db.query(query, params, callback);
  },
};

module.exports = Product;