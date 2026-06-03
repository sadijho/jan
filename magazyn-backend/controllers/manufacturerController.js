const Manufacturer = require('../models/manufacturer');

exports.createManufacturer = (req, res) => {
  const { name, country, contactEmail, phone } = req.body;

  Manufacturer.create({ name, country, contactEmail, phone }, (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Producent o tej nazwie już istnieje' });
      }

      console.error('Błąd podczas dodawania producenta:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }

    res.status(201).json({ message: 'Producent został dodany' });
  });
};

exports.getAllManufacturers = (req, res) => {
  Manufacturer.findAll((err, results) => {
    if (err) {
      console.error('Błąd podczas pobierania producentów:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }

    res.status(200).json(results);
  });
};

exports.getManufacturerById = (req, res) => {
  const { id } = req.params;

  Manufacturer.findById(id, (err, results) => {
    if (err) {
      console.error('Błąd podczas pobierania producenta:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Producent nie został znaleziony' });
    }

    res.status(200).json(results[0]);
  });
};

exports.updateManufacturer = (req, res) => {
  const { id } = req.params;
  const { name, country, contactEmail, phone } = req.body;

  Manufacturer.update(id, { name, country, contactEmail, phone }, (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Producent o tej nazwie już istnieje' });
      }

      console.error('Błąd podczas aktualizacji producenta:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }

    res.status(200).json({ message: 'Producent został zaktualizowany' });
  });
};

exports.deleteManufacturer = (req, res) => {
  const { id } = req.params;

  Manufacturer.delete(id, (err) => {
    if (err) {
      console.error('Błąd podczas usuwania producenta:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }

    res.status(200).json({ message: 'Producent został usunięty' });
  });
};