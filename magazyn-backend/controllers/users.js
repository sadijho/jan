const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Role = require('../models/role');

// Rejestracja użytkownika
exports.register = (req, res) => {
  const { username, password, roleName, firstName, lastName, email } = req.body;

  console.log('Otrzymane dane podczas rejestracji:', { username, password, roleName, firstName, lastName, email });

  if (!username || !password || !roleName) {
    return res.status(400).json({ message: 'Nazwa użytkownika, hasło i rola są wymagane' });
  }

  if (email && !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: 'Nieprawidłowy format adresu email' });
  }

  Role.findByName(roleName, (err, roleResults) => {
    if (err || roleResults.length === 0) {
      return res.status(404).json({ message: 'Rola nie została znaleziona' });
    }

    const roleId = roleResults[0].id;

    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({ message: 'Błąd podczas hashowania hasła' });
      }

      console.log('Otrzymane dane w backendzie:', req.body);


      User.create(
        {
          username,
          passwordHash: hash,
          roleId,
          firstName: firstName?.trim() || null,
          lastName: lastName?.trim() || null,
          email: email?.trim() || null,
        },
        (err) => {
          if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
              return res.status(409).json({ message: 'Nazwa użytkownika lub email już istnieje' });
            }
            return res.status(500).json({ message: 'Błąd podczas tworzenia użytkownika' });
          }
          res.status(201).json({ message: 'Użytkownik został zarejestrowany' });
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
    if (err || userResults.length === 0) {
      return res.status(404).json({ message: 'Nieprawidłowy login lub hasło' });
    }

    const user = userResults[0];

    bcrypt.compare(password, user.password_hash, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(401).json({ message: 'Nieprawidłowe hasło' });
      }

      Role.findById(user.role_id, (err, roleResults) => {
        if (err || roleResults.length === 0) {
          return res.status(500).json({ message: 'Błąd podczas pobierania roli użytkownika' });
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

        res.status(200).json({ message: 'Zalogowano pomyślnie', token });
      });
    });
  });
};

// Profil użytkownika (z tokenu)
exports.getProfile = (req, res) => {
  console.log('Token użytkownika w /profile:', req.user);
  res.status(200).json({ user: req.user });
};

// Lista użytkowników z paginacją
exports.getUsersWithPagination = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  User.findAllPaginated(limit, offset, (err, results, totalCount) => {
    if (err) {
      console.error('Błąd podczas pobierania użytkowników:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }

    const totalPages = Math.ceil(totalCount / limit);
    res.status(200).json({ results, totalPages, currentPage: page });
  });
};

// Szczegóły użytkownika
exports.getUserById = (req, res) => {
  const { id } = req.params;

  User.findById(id, (err, results) => {
    if (err) {
      console.error('Błąd podczas pobierania użytkownika:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Użytkownik nie został znaleziony' });
    }
    res.status(200).json(results[0]);
  });
};

// Aktualizacja użytkownika
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, roleId } = req.body;

  console.log('Dane wejściowe do aktualizacji:', { id, firstName, lastName, email, roleId });

  // Walidacja danych wejściowych
  if (!id) {
    return res.status(400).json({ message: 'Brak ID użytkownika w żądaniu' });
  }

  if (!roleId || typeof roleId !== 'number') {
    return res.status(400).json({ message: 'Nieprawidłowe roleId: musi być liczbą i istnieć w tabeli roles' });
  }

  // Sprawdzenie istnienia roli w tabeli `roles`
  Role.findById(roleId, (err, roleResults) => {
    if (err || roleResults.length === 0) {
      return res.status(400).json({ message: 'Nieprawidłowy roleId: brak takiej roli w systemie.' });
    }

    // Przygotowanie zapytania SQL do aktualizacji użytkownika
    User.updateById(
      id,
      { 
        firstName: firstName?.trim() || null, 
        lastName: lastName?.trim() || null, 
        email: email?.trim() || null, 
        roleId 
      },
      (err) => {
        if (err) {
          console.error('Błąd podczas aktualizacji użytkownika:', err);
          return res.status(500).json({ message: 'Błąd serwera podczas aktualizacji użytkownika' });
        }

        res.status(200).json({ message: 'Użytkownik został zaktualizowany pomyślnie' });
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
      return res.status(500).json({ message: 'Błąd serwera' });
    }
    res.status(200).json({ message: 'Użytkownik został usunięty' });
  });
};
