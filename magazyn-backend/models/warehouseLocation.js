const db = require('../config/db');

const WarehouseLocation = {
  findById: (id, callback) => {
    const query = 'SELECT * FROM WarehouseLocations WHERE id = ?';
    console.log('Zapytanie SQL do pobrania lokalizacji magazynowej:', query);
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error('Błąd podczas pobierania lokalizacji magazynowej:', err);
      }
      console.log('Dane lokalizacji magazynowej:', results);
      callback(err, results);
    });
  },

  findAll: (callback) => {
    const query = 'SELECT * FROM WarehouseLocations';
    db.query(query, callback);
  },

  create: (data, callback) => {
    const query = 'INSERT INTO WarehouseLocations (code, description) VALUES (?, ?)';
    console.log('Zapytanie SQL do tworzenia lokalizacji magazynowej:', query);
    db.query(query, [data.code, data.description], callback);
  },

  delete: (id, callback) => {
    const query = 'DELETE FROM WarehouseLocations WHERE id = ?';
    db.query(query, [id], callback);
  },
};

module.exports = WarehouseLocation;
