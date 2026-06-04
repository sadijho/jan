const db = require('../config/db');

const User = {
  create: (data, callback) => {
    const query = `
      INSERT INTO Users
        (username, password_hash, role_id, first_name, last_name, email)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [
        data.username,
        data.passwordHash,
        data.roleId,
        data.firstName,
        data.lastName,
        data.email,
      ],
      callback
    );
  },

  findAllPaginated: (limit, offset, callback) => {
    const query = `
      SELECT SQL_CALC_FOUND_ROWS
        id,
        username,
        role_id,
        first_name,
        last_name,
        email
      FROM Users
      LIMIT ? OFFSET ?
    `;

    db.query(query, [limit, offset], (err, results) => {
      if (err) return callback(err);

      db.query('SELECT FOUND_ROWS() AS totalCount', (countErr, countResults) => {
        if (countErr) return callback(countErr);

        callback(null, results, countResults[0].totalCount);
      });
    });
  },

  findByUsername: (username, callback) => {
    const query = 'SELECT * FROM Users WHERE username = ?';
    db.query(query, [username], callback);
  },

  findById: (id, callback) => {
    const query = `
      SELECT
        id,
        username,
        role_id,
        first_name,
        last_name,
        email
      FROM Users
      WHERE id = ?
    `;

    db.query(query, [id], callback);
  },

  updateById: (id, data, callback) => {
    const query = `
      UPDATE Users
      SET first_name = ?, last_name = ?, email = ?, role_id = ?
      WHERE id = ?
    `;

    db.query(
      query,
      [
        data.firstName,
        data.lastName,
        data.email,
        data.roleId,
        id,
      ],
      callback
    );
  },

  deleteById: (id, callback) => {
    const query = 'DELETE FROM Users WHERE id = ?';
    db.query(query, [id], callback);
  },
};

module.exports = User;