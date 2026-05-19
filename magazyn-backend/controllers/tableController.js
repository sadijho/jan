const Role = require('../models/role');
const WarehouseLocation = require('../models/warehouseLocation');
const OrderProducts = require('../models/orderProducts');

// Obsługa paginacji
const paginate = (query, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  return `${query} LIMIT ${limit} OFFSET ${offset}`;
};

// Lista ról
exports.getRoles = (req, res) => {
  const query = 'SELECT * FROM Roles';
  const paginatedQuery = paginate(query, req.query.page, req.query.limit);

  Role.findCustom(paginatedQuery, [], (err, results) => {
    if (err) return res.status(500).json({ message: 'Błąd serwera', error: err });
    res.status(200).json(results);
  });
};

// Lista lokalizacji magazynowych
exports.getWarehouseLocations = (req, res) => {
  const query = 'SELECT * FROM WarehouseLocations';
  const paginatedQuery = paginate(query, req.query.page, req.query.limit);

  WarehouseLocation.findCustom(paginatedQuery, [], (err, results) => {
    if (err) return res.status(500).json({ message: 'Błąd serwera', error: err });
    res.status(200).json(results);
  });
};

// Lista produktów w zamówieniach
exports.getOrderProducts = (req, res) => {
  const query = `
    SELECT op.*, p.name AS product_name, p.description AS product_description
    FROM OrderProducts op
    JOIN Products p ON op.product_id = p.id
  `;
  const paginatedQuery = paginate(query, req.query.page, req.query.limit);

  OrderProducts.findCustom(paginatedQuery, [], (err, results) => {
    if (err) return res.status(500).json({ message: 'Błąd serwera', error: err });
    res.status(200).json(results);
  });
};
