const OrderHistory = require('../models/orderHistory');

// Pobieranie wszystkich wpisów z historii zamówień
exports.getAllOrderHistory = (req, res) => {
  OrderHistory.findAll((err, results) => {
    if (err) {
      console.error('Błąd podczas pobierania wszystkich wpisów z historii zamówień:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }
    res.status(200).json(results);
  });
};

// Pobieranie historii zamówienia po ID zamówienia
exports.getOrderHistoryByOrderId = (req, res) => {
  const { orderId } = req.params;

  OrderHistory.findByOrderId(orderId, (err, results) => {
    if (err) {
      console.error('Błąd podczas pobierania historii zamówienia:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }
    res.status(200).json(results);
  });
};

// Tworzenie wpisu w historii zamówienia
exports.createOrderHistory = (req, res) => {
  const { orderId, changedByUserId } = req.body;

  OrderHistory.create({ orderId, changedByUserId }, (err) => {
    if (err) {
      console.error('Błąd podczas tworzenia wpisu w historii zamówienia:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }
    res.status(201).json({ message: 'Historia zamówienia została zaktualizowana' });
  });
};
