const db = require('../config/db');

const Manufacturer = {
  create: (data, callback) => {
    const query = `
      INSERT INTO Manufacturers (name, country, contact_email, phone)
      VALUES (?, ?, ?, ?)
    `;

    db.query(
      query,
      [
        data.name,
        data.country || null,
        data.contactEmail || null,
        data.phone || null,
      ],
      callback
    );
  },

  findAll: (callback) => {
    const query = `
      SELECT id, name, country, contact_email, phone
      FROM Manufacturers
      ORDER BY name ASC
    `;

    db.query(query, callback);
  },

  findById: (id, callback) => {
    const query = `
      SELECT id, name, country, contact_email, phone
      FROM Manufacturers
      WHERE id = ?
    `;

    db.query(query, [id], callback);
  },

  update: (id, data, callback) => {
    const query = `
      UPDATE Manufacturers
      SET name = ?, country = ?, contact_email = ?, phone = ?
      WHERE id = ?
    `;

    db.query(
      query,
      [
        data.name,
        data.country || null,
        data.contactEmail || null,
        data.phone || null,
        id,
      ],
      callback
    );
  },

  delete: (id, callback) => {
    const query = 'DELETE FROM Manufacturers WHERE id = ?';
    db.query(query, [id], callback);
  },
};

module.exports = Manufacturer;