const WarehouseLocation = require('../models/warehouseLocation');

// Pobieranie wszystkich lokalizacji
exports.getWarehouseLocations = (req, res) => {
  WarehouseLocation.findAll((err, results) => {
    if (err) {
      console.error('Błąd podczas pobierania lokalizacji magazynowych:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }
    res.status(200).json(results);
  });
};

// Pobieranie lokalizacji po ID
exports.getWarehouseLocationById = (req, res) => {
  const { id } = req.params;

  WarehouseLocation.findById(id, (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ message: 'Lokalizacja magazynowa nie została znaleziona' });
    }
    res.status(200).json(results[0]);
  });
};

// Tworzenie nowej lokalizacji
exports.createWarehouseLocation = (req, res) => {
  const { code, description } = req.body;

  WarehouseLocation.create({ code, description }, (err) => {
    if (err) {
      console.error('Błąd podczas tworzenia lokalizacji magazynowej:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }
    res.status(201).json({ message: 'Lokalizacja magazynowa została utworzona' });
  });
};

// Usuwanie lokalizacji
exports.deleteWarehouseLocation = (req, res) => {
  const { id } = req.params;

  WarehouseLocation.delete(id, (err) => {
    if (err) {
      console.error('Błąd podczas usuwania lokalizacji magazynowej:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }
    res.status(200).json({ message: 'Lokalizacja magazynowa została usunięta' });
  });
};
