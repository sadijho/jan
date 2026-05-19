const OrderProducts = require('../models/orderProducts');

exports.getAllOrderProducts = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  console.log('Page:', page, 'Limit:', limit, 'Offset:', offset);

  OrderProducts.findAll(limit, offset, (err, results, totalCount) => {
    if (err) {
      console.error('Błąd podczas pobierania produktów zamówień:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }
    console.log('Results:', results);
    console.log('Total Count:', totalCount);
    const totalPages = Math.ceil(totalCount / limit);
    res.status(200).json({ results, totalPages, currentPage: page });
  });
};

exports.getOrderProductsByOrderId = (req, res) => {
  const { orderId } = req.params;

  OrderProducts.findByOrderId(orderId, (err, results) => {
    if (err) {
      console.error('Błąd podczas pobierania produktów zamówienia:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }
    res.status(200).json(results);
  });
};

exports.getOrderProductsByUserId = (req, res) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  OrderProducts.findByUserId(userId, limit, offset, (err, results, totalCount) => {
    if (err) {
      console.error('Błąd podczas pobierania zamówień użytkownika:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }

    const totalPages = Math.ceil(totalCount / limit);
    res.status(200).json({ results, totalPages, currentPage: page });
  });
};


exports.createOrderProduct = (req, res) => {
  const { orderId, productId, quantity } = req.body;

  OrderProducts.create({ orderId, productId, quantity }, (err) => {
    if (err) {
      console.error('Błąd podczas dodawania produktu do zamówienia:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }
    res.status(201).json({ message: 'Produkt został dodany do zamówienia' });
  });
};
