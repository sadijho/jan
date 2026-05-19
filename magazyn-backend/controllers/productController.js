const Product = require('../models/product');

// Tworzenie produktu
exports.createProduct = (req, res) => {
  const { name, description, quantity, status, locationId } = req.body;

  Product.create({ name, description, quantity, status, locationId }, (err) => {
    if (err) {
      console.error('Błąd podczas dodawania produktu:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }
    res.status(201).json({ message: 'Produkt został dodany' });
  });
};

// Pobieranie wszystkich produktów
exports.getAllProducts = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  Product.findAllPaginated(limit, offset, (err, results, totalCount) => {
    if (err) {
      console.error('Błąd podczas pobierania produktów:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }

    const totalPages = Math.ceil(totalCount / limit);
    res.status(200).json({ results, totalPages, currentPage: page });
  });
};
// Pobieranie szczegółów produktu
exports.getProductById = (req, res) => {
  const { id } = req.params;

  Product.findById(id, (err, results) => {
    if (err) {
      console.error('Błąd podczas pobierania produktu:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Produkt nie został znaleziony' });
    }
    res.status(200).json(results[0]);
  });
};

// Aktualizacja produktu
exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, description, quantity, status, locationId } = req.body;

  console.log('Dane do aktualizacji w kontrolerze:', { id, name, description, quantity, status, locationId });

  if (!locationId) {
    return res
      .status(400)
      .json({ message: 'location_id jest wymagane i musi być poprawną wartością.' });
  }

  Product.update(id, { name, description, quantity, status, locationId }, (err) => {
    if (err) {
      console.error('Błąd podczas aktualizacji produktu:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }
    res.status(200).json({ message: 'Produkt został zaktualizowany' });
  });
};


// Usuwanie produktu
exports.deleteProduct = (req, res) => {
  const { id } = req.params;

  Product.delete(id, (err) => {
    if (err) {
      console.error('Błąd podczas usuwania produktu:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }
    res.status(200).json({ message: 'Produkt został usunięty' });
  });
};

// Wyszukiwanie i autouzupełnianie produktów
exports.searchAndAutocompleteProducts = (req, res) => {
  const { query, limit = 10 } = req.query;

  if (!query) {
    return res.status(400).json({ message: 'Musisz podać frazę do wyszukiwania.' });
  }

  const sqlQuery = `
    SELECT id, name 
    FROM Products 
    WHERE name LIKE ? 
    LIMIT ?
  `;

  const params = [`%${query}%`, parseInt(limit)];

  Product.findCustom(sqlQuery, params, (err, results) => {
    if (err) {
      console.error('Błąd podczas wyszukiwania produktów:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }

    res.status(200).json(results);
  });
};
