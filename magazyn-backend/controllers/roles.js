const Role = require('../models/role');

// Pobieranie wszystkich ról
exports.getRoles = (req, res) => {
  Role.findAll((err, results) => {
    if (err) {
      console.error('Błąd podczas pobierania ról:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }
    res.status(200).json(results);
  });
};

// Pobieranie roli po ID
exports.getRoleById = (req, res) => {
  const { id } = req.params;

  Role.findById(id, (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ message: 'Rola nie została znaleziona' });
    }
    res.status(200).json(results[0]);
  });
};
