const db = require('../config/db');

const Role = {
  findByName: (name, callback) => {
    const query = 'SELECT * FROM roles WHERE name = ?';
    db.query(query, [name], (err, results) => {
      console.log('Zapytanie SQL do ról:', query, name); // Logowanie zapytania
      console.log('Wyniki:', results); // Logowanie wyników
      callback(err, results);
    });
  },


  findById: (id, callback) => {
    const query = 'SELECT * FROM Roles WHERE id = ?';
    db.query(query, [id], callback);
  },

  findAll: (callback) => {
    const query = 'SELECT * FROM Roles';
    db.query(query, callback);
  },
};

module.exports = Role;
