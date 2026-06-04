const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Role = require('../models/role');
const db = require('../config/db');

// Rejestracja użytkownika
exports.register = (req, res) => {
  const { username, password, roleName, firstName, lastName, email } = req.body;

  if (!username || !password || !roleName) {
    return res.status(400).json({ message: 'Nazwa użytkownika, hasło i rola są wymagane' });
  }

  if (email && !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: 'Nieprawidłowy format adresu email' });
  }

  Role.findByName(roleName, (roleErr, roleResults) => {
    if (roleErr) {
      console.error('Błąd podczas pobierania roli:', roleErr);
      return res.status(500).json({
        message: roleErr.sqlMessage || 'Błąd podczas pobierania roli użytkownika',
      });
    }

    if (!roleResults || roleResults.length === 0) {
      return res.status(404).json({ message: 'Rola nie została znaleziona' });
    }

    const roleId = roleResults[0].id;

    bcrypt.hash(password, 10, (hashErr, hash) => {
      if (hashErr) {
        console.error('Błąd podczas hashowania hasła:', hashErr);
        return res.status(500).json({ message: 'Błąd podczas hashowania hasła' });
      }

      User.create(
        {
          username: username.trim(),
          passwordHash: hash,
          roleId,
          firstName: firstName?.trim() || null,
          lastName: lastName?.trim() || null,
          email: email?.trim() || null,
        },
        (createErr) => {
          if (createErr) {
            console.error('Błąd SQL podczas tworzenia użytkownika:', createErr);

            if (createErr.code === 'ER_DUP_ENTRY') {
              return res.status(409).json({
                message: 'Nazwa użytkownika lub email już istnieje',
              });
            }

            return res.status(500).json({
              message: createErr.sqlMessage || 'Błąd podczas tworzenia użytkownika',
            });
          }

          return res.status(201).json({ message: 'Użytkownik został zarejestrowany' });
        }
      );
    });
  });
};

// Logowanie użytkownika
exports.login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Nazwa użytkownika i hasło są wymagane' });
  }

  User.findByUsername(username, (err, userResults) => {
    if (err) {
      console.error('Błąd podczas pobierania użytkownika:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }

    if (!userResults || userResults.length === 0) {
      return res.status(404).json({ message: 'Nieprawidłowy login lub hasło' });
    }

    const user = userResults[0];

    bcrypt.compare(password, user.password_hash, (compareErr, isMatch) => {
      if (compareErr) {
        console.error('Błąd podczas porównywania hasła:', compareErr);
        return res.status(500).json({ message: 'Błąd serwera' });
      }

      if (!isMatch) {
        return res.status(401).json({ message: 'Nieprawidłowe hasło' });
      }

      Role.findById(user.role_id, (roleErr, roleResults) => {
        if (roleErr) {
          console.error('Błąd podczas pobierania roli użytkownika:', roleErr);
          return res.status(500).json({ message: 'Błąd podczas pobierania roli użytkownika' });
        }

        if (!roleResults || roleResults.length === 0) {
          return res.status(500).json({ message: 'Rola użytkownika nie została znaleziona' });
        }

        const role = roleResults[0].name;

        const token = jwt.sign(
          {
            id: user.id,
            username: user.username,
            role,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
          },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );

        return res.status(200).json({ message: 'Zalogowano pomyślnie', token });
      });
    });
  });
};

// Profil użytkownika z tokenu
exports.getProfile = (req, res) => {
  res.status(200).json({ user: req.user });
};

// Lista użytkowników z paginacją
exports.getUsersWithPagination = (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  User.findAllPaginated(limit, offset, (err, results, totalCount) => {
    if (err) {
      console.error('Błąd podczas pobierania użytkowników:', err);
      return res.status(500).json({
        message: err.sqlMessage || 'Błąd serwera',
      });
    }

    const totalPages = Math.ceil(totalCount / limit);
    return res.status(200).json({ results, totalPages, currentPage: page });
  });
};

// Lista pracowników technicznych
exports.getTechnicalWorkers = (req, res) => {
  const query = `
    SELECT u.id, u.username, u.first_name, u.last_name, u.email
    FROM Users u
    JOIN Roles r ON u.role_id = r.id
    WHERE r.name = ?
    ORDER BY u.last_name, u.first_name, u.username
  `;

  db.query(query, ['technical worker'], (err, results) => {
    if (err) {
      console.error('Błąd podczas pobierania pracowników technicznych:', err);
      return res.status(500).json({
        message: err.sqlMessage || 'Błąd serwera',
      });
    }

    return res.status(200).json(results);
  });
};

// Szczegóły użytkownika
exports.getUserById = (req, res) => {
  const { id } = req.params;

  User.findById(id, (err, results) => {
    if (err) {
      console.error('Błąd podczas pobierania użytkownika:', err);
      return res.status(500).json({
        message: err.sqlMessage || 'Błąd serwera',
      });
    }

    if (!results || results.length === 0) {
      return res.status(404).json({ message: 'Użytkownik nie został znaleziony' });
    }

    return res.status(200).json(results[0]);
  });
};

// Aktualizacja użytkownika
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, roleId } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'Brak ID użytkownika w żądaniu' });
  }

  const parsedRoleId = Number(roleId);

  if (!Number.isInteger(parsedRoleId) || parsedRoleId <= 0) {
    return res.status(400).json({
      message: 'Nieprawidłowe roleId: musi być liczbą i istnieć w tabeli Roles',
    });
  }

  Role.findById(parsedRoleId, (err, roleResults) => {
    if (err) {
      console.error('Błąd podczas sprawdzania roli:', err);
      return res.status(500).json({
        message: err.sqlMessage || 'Błąd serwera',
      });
    }

    if (!roleResults || roleResults.length === 0) {
      return res.status(400).json({
        message: 'Nieprawidłowy roleId: brak takiej roli w systemie.',
      });
    }

    User.updateById(
      id,
      {
        firstName: firstName?.trim() || null,
        lastName: lastName?.trim() || null,
        email: email?.trim() || null,
        roleId: parsedRoleId,
      },
      (updateErr) => {
        if (updateErr) {
          console.error('Błąd podczas aktualizacji użytkownika:', updateErr);
          return res.status(500).json({
            message: updateErr.sqlMessage || 'Błąd serwera podczas aktualizacji użytkownika',
          });
        }

        return res.status(200).json({ message: 'Użytkownik został zaktualizowany pomyślnie' });
      }
    );
  });
};

// Usuwanie użytkownika
exports.deleteUser = (req, res) => {
  const { id } = req.params;

  User.deleteById(id, (err) => {
    if (err) {
      console.error('Błąd podczas usuwania użytkownika:', err);
      return res.status(500).json({
        message: err.sqlMessage || 'Błąd serwera',
      });
    }

    return res.status(200).json({ message: 'Użytkownik został usunięty' });
  });
};