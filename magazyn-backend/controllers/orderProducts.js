const OrderProducts = require('../models/orderProducts');

exports.getAllOrderProducts = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  OrderProducts.findAll(limit, offset, (err, results, totalCount) => {
    if (err) {
      console.error('Błąd podczas pobierania produktów zamówień:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }

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
  const loggedUserId = req.user.id;
  const userRole = req.user.role;

  if (userRole === 'worker' && parseInt(userId, 10) !== loggedUserId) {
    return res.status(403).json({
      message: 'Nie masz uprawnień do przeglądania tych zamówień',
    });
  }

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