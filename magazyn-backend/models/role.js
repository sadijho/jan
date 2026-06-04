const db = require('../config/db');

const Role = {
  findByName: (name, callback) => {
    const query = 'SELECT * FROM Roles WHERE name = ?';
    db.query(query, [name], callback);
  },

  findById: (id, callback) => {
    const query = 'SELECT * FROM Roles WHERE id = ?';
    db.query(query, [id], callback);
  },

  findAll: (callback) => {
    const query = 'SELECT * FROM Roles ORDER BY id ASC';
    db.query(query, callback);
  },
};

module.exports = Role;