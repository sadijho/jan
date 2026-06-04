const Product = require('../models/product');
const Order = require('../models/order');
const OrderProducts = require('../models/orderProducts');
const OrderHistory = require('../models/orderHistory');
const db = require('../config/db');

const ORDER_STATUS = {
  PENDING: 'oczekuje',
  IN_PROGRESS: 'w trakcie',
  REJECTED: 'odrzucone',
  COMPLETED: 'zrealizowane',
};

const getInitialOrderStatus = (role) => {
  if (role === 'worker') {
    return ORDER_STATUS.PENDING;
  }

  return ORDER_STATUS.IN_PROGRESS;
};

const validateOrderPayload = (products, dueDate) => {
  if (!dueDate) {
    return 'Termin realizacji jest wymagany';
  }

  if (!Array.isArray(products) || products.length === 0) {
    return 'Lista produktów jest wymagana';
  }

  const hasInvalidProduct = products.some((product) => {
    const productId = Number(product.productId);
    const quantity = Number(product.quantity);

    return (
      !Number.isInteger(productId) ||
      productId <= 0 ||
      !Number.isInteger(quantity) ||
      quantity <= 0
    );
  });

  if (hasInvalidProduct) {
    return 'Każdy produkt musi mieć poprawne ID i ilość większą od zera';
  }

  return null;
};

const updateProductsStock = (connection, products, operation, callback) => {
  let index = 0;

  const processNextProduct = () => {
    if (index >= products.length) {
      callback(null);
      return;
    }

    const product = products[index];
    const productId = Number(product.product_id || product.productId);
    const quantity = Number(product.quantity);

    connection.query(
      'SELECT * FROM Products WHERE id = ? FOR UPDATE',
      [productId],
      (err, productResults) => {
        if (err) return callback(err);

        if (productResults.length === 0) {
          return callback(new Error(`Produkt ID ${productId} nie został znaleziony`));
        }

        const productFromDb = productResults[0];
        let newQuantity = productFromDb.quantity;

        if (operation === 'decrease') {
          if (productFromDb.quantity < quantity) {
            return callback(new Error(`Brak wystarczającej ilości produktu: ${productFromDb.name}`));
          }

          newQuantity = productFromDb.quantity - quantity;
        }

        if (operation === 'increase') {
          newQuantity = productFromDb.quantity + quantity;
        }

        connection.query(
          'UPDATE Products SET quantity = ? WHERE id = ?',
          [newQuantity, productId],
          (updateErr) => {
            if (updateErr) return callback(updateErr);

            index += 1;
            processNextProduct();
          }
        );
      }
    );
  };

  processNextProduct();
};

exports.createOrder = (req, res) => {
  const { products, dueDate } = req.body;
  const userId = req.user.id;
  const userRole = req.user.role;
  const initialStatus = getInitialOrderStatus(userRole);

  const validationError = validateOrderPayload(products, dueDate);

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const normalizedProducts = products.map((product) => ({
    productId: Number(product.productId),
    quantity: Number(product.quantity),
  }));

  db.getConnection((err, connection) => {
    if (err) {
      console.error('Błąd pobierania połączenia z bazy:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }

    connection.beginTransaction((transactionErr) => {
      if (transactionErr) {
        connection.release();
        console.error('Błąd rozpoczęcia transakcji:', transactionErr);
        return res.status(500).json({ message: 'Błąd serwera' });
      }

      connection.query(
        'INSERT INTO Orders (user_id, status, due_date) VALUES (?, ?, ?)',
        [userId, initialStatus, dueDate],
        (orderErr, orderResult) => {
          if (orderErr) {
            return connection.rollback(() => {
              connection.release();
              console.error('Błąd tworzenia zamówienia:', orderErr);
              res.status(500).json({ message: 'Błąd podczas tworzenia zamówienia' });
            });
          }

          const orderId = orderResult.insertId;
          let index = 0;

          const processNextProduct = () => {
            if (index >= normalizedProducts.length) {
              if (initialStatus === ORDER_STATUS.PENDING) {
                return connection.commit((commitErr) => {
                  if (commitErr) {
                    return connection.rollback(() => {
                      connection.release();
                      console.error('Błąd zatwierdzania transakcji:', commitErr);
                      res.status(500).json({ message: 'Błąd podczas zatwierdzania zamówienia' });
                    });
                  }

                  connection.release();
                  return res.status(201).json({
                    message: 'Prośba o zamówienie została wysłana do akceptacji',
                    orderId,
                    status: initialStatus,
                  });
                });
              }

              return updateProductsStock(connection, normalizedProducts, 'decrease', (stockErr) => {
                if (stockErr) {
                  return connection.rollback(() => {
                    connection.release();
                    console.error('Błąd aktualizacji stanu magazynowego:', stockErr);
                    res.status(400).json({ message: stockErr.message });
                  });
                }

                return connection.commit((commitErr) => {
                  if (commitErr) {
                    return connection.rollback(() => {
                      connection.release();
                      console.error('Błąd zatwierdzania transakcji:', commitErr);
                      res.status(500).json({ message: 'Błąd podczas zatwierdzania zamówienia' });
                    });
                  }

                  connection.release();
                  return res.status(201).json({
                    message: 'Zamówienie zostało złożone i produkty zostały dodane',
                    orderId,
                    status: initialStatus,
                  });
                });
              });
            }

            const product = normalizedProducts[index];

            connection.query(
              'SELECT id FROM Products WHERE id = ?',
              [product.productId],
              (productErr, productResults) => {
                if (productErr) {
                  return connection.rollback(() => {
                    connection.release();
                    console.error('Błąd pobierania produktu:', productErr);
                    res.status(500).json({ message: 'Błąd podczas pobierania produktu' });
                  });
                }

                if (productResults.length === 0) {
                  return connection.rollback(() => {
                    connection.release();
                    res.status(404).json({
                      message: `Produkt ID ${product.productId} nie został znaleziony`,
                    });
                  });
                }

                connection.query(
                  'INSERT INTO OrderProducts (order_id, product_id, quantity) VALUES (?, ?, ?)',
                  [orderId, product.productId, product.quantity],
                  (orderProductErr) => {
                    if (orderProductErr) {
                      return connection.rollback(() => {
                        connection.release();
                        console.error('Błąd dodawania produktu do zamówienia:', orderProductErr);
                        res.status(500).json({
                          message: 'Błąd podczas dodawania produktu do zamówienia',
                        });
                      });
                    }

                    index += 1;
                    processNextProduct();
                  }
                );
              }
            );
          };

          processNextProduct();
        }
      );
    });
  });
};

exports.getOrders = (req, res) => {
  const userRole = req.user.role;
  const userId = req.user.id;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  let query = `
    SELECT o.id AS order_id,
           o.status,
           o.due_date,
           u.first_name,
           u.last_name,
           u.id AS user_id
    FROM Orders o
    JOIN Users u ON o.user_id = u.id
  `;

  const queryParams = [];

  if (userRole === 'worker') {
    query += ' WHERE o.user_id = ?';
    queryParams.push(userId);
  }

  query += ' ORDER BY o.id DESC LIMIT ? OFFSET ?';
  queryParams.push(limit, offset);

  Order.findCustom(query, queryParams, (err, results) => {
    if (err) {
      console.error('Błąd podczas pobierania zamówień:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }

    const countQuery = `
      SELECT COUNT(*) AS totalCount
      FROM Orders o
      JOIN Users u ON o.user_id = u.id
      ${userRole === 'worker' ? 'WHERE o.user_id = ?' : ''}
    `;

    Order.findCustom(
      countQuery,
      userRole === 'worker' ? [userId] : [],
      (countErr, countResults) => {
        if (countErr) {
          console.error('Błąd podczas liczenia zamówień:', countErr);
          return res.status(500).json({ message: 'Błąd serwera' });
        }

        const totalCount = countResults[0].totalCount;
        const totalPages = Math.ceil(totalCount / limit);

        res.status(200).json({ results, totalPages, currentPage: page });
      }
    );
  });
};

exports.getOrderById = (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT o.id AS order_id,
           o.status,
           o.due_date,
           u.first_name,
           u.last_name,
           u.id AS user_id
    FROM Orders o
    JOIN Users u ON o.user_id = u.id
    WHERE o.id = ?
  `;

  Order.findCustom(query, [id], (err, orderResults) => {
    if (err) {
      console.error('Błąd podczas pobierania zamówienia:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }

    if (orderResults.length === 0) {
      return res.status(404).json({ message: 'Zamówienie nie zostało znalezione' });
    }

    const order = orderResults[0];

    if (req.user.role === 'worker' && order.user_id !== req.user.id) {
  return res.status(403).json({ message: 'Nie masz dostępu do tego zamówienia' });
}

    OrderProducts.findByOrderId(id, (productsErr, products) => {
      if (productsErr) {
        console.error('Błąd podczas pobierania produktów zamówienia:', productsErr);
        return res.status(500).json({ message: 'Błąd serwera' });
      }

      res.status(200).json({ ...order, products });
    });
  });
};

exports.getPendingOrdersCount = (req, res) => {
  const query = `
    SELECT COUNT(*) AS count
    FROM Orders
    WHERE status = ?
  `;

  Order.findCustom(query, [ORDER_STATUS.PENDING], (err, results) => {
    if (err) {
      console.error('Błąd podczas pobierania liczby oczekujących zamówień:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }

    res.status(200).json({ count: results[0].count || 0 });
  });
};

exports.updateOrderStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const userRole = req.user.role;
  const userId = req.user.id;

  const allowedStatuses = [
    ORDER_STATUS.PENDING,
    ORDER_STATUS.IN_PROGRESS,
    ORDER_STATUS.REJECTED,
    ORDER_STATUS.COMPLETED,
  ];

  if (!status || !allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Nieprawidłowy status zamówienia' });
  }

  Order.findById(id, (err, orderResults) => {
    if (err || orderResults.length === 0) {
      return res.status(404).json({ message: 'Zamówienie nie zostało znalezione' });
    }

    const order = orderResults[0];

    if (userRole === 'worker') {
      return res.status(403).json({ message: 'Pracownik nie może zmieniać statusu zamówienia' });
    }

    if (order.status === ORDER_STATUS.REJECTED || order.status === ORDER_STATUS.COMPLETED) {
      return res.status(400).json({ message: 'Nie można zmienić zakończonego zamówienia' });
    }

    db.getConnection((connectionErr, connection) => {
      if (connectionErr) {
        console.error('Błąd pobierania połączenia z bazy:', connectionErr);
        return res.status(500).json({ message: 'Błąd serwera' });
      }

      connection.beginTransaction((transactionErr) => {
        if (transactionErr) {
          connection.release();
          console.error('Błąd rozpoczęcia transakcji:', transactionErr);
          return res.status(500).json({ message: 'Błąd serwera' });
        }

        const finishStatusUpdate = () => {
          connection.query(
            'UPDATE Orders SET status = ? WHERE id = ?',
            [status, id],
            (updateErr) => {
              if (updateErr) {
                return connection.rollback(() => {
                  connection.release();
                  console.error('Błąd aktualizacji statusu zamówienia:', updateErr);
                  res.status(500).json({ message: 'Błąd podczas aktualizacji statusu zamówienia' });
                });
              }

              connection.query(
                'INSERT INTO OrderHistory (order_id, changed_by_user_id, status_change_date) VALUES (?, ?, NOW())',
                [id, userId],
                (historyErr) => {
                  if (historyErr) {
                    return connection.rollback(() => {
                      connection.release();
                      console.error('Błąd podczas rejestrowania historii zamówień:', historyErr);
                      res.status(500).json({ message: 'Błąd podczas zapisywania historii zamówienia' });
                    });
                  }

                  connection.commit((commitErr) => {
                    if (commitErr) {
                      return connection.rollback(() => {
                        connection.release();
                        console.error('Błąd zatwierdzania transakcji:', commitErr);
                        res.status(500).json({ message: 'Błąd podczas zatwierdzania zmiany statusu' });
                      });
                    }

                    connection.release();
                    res.status(200).json({
                      message: 'Status zamówienia został zaktualizowany i zmiana została zarejestrowana',
                    });
                  });
                }
              );
            }
          );
        };

        OrderProducts.findByOrderId(id, (productsErr, products) => {
          if (productsErr) {
            return connection.rollback(() => {
              connection.release();
              console.error('Błąd podczas pobierania produktów zamówienia:', productsErr);
              res.status(500).json({ message: 'Błąd podczas pobierania produktów zamówienia' });
            });
          }

          if (status === ORDER_STATUS.IN_PROGRESS && order.status === ORDER_STATUS.PENDING) {
            return updateProductsStock(connection, products, 'decrease', (stockErr) => {
              if (stockErr) {
                return connection.rollback(() => {
                  connection.release();
                  console.error('Błąd aktualizacji magazynu przy akceptacji:', stockErr);
                  res.status(400).json({ message: stockErr.message });
                });
              }

              finishStatusUpdate();
            });
          }

          if (status === ORDER_STATUS.COMPLETED && order.status === ORDER_STATUS.IN_PROGRESS) {
            return updateProductsStock(connection, products, 'increase', (stockErr) => {
              if (stockErr) {
                return connection.rollback(() => {
                  connection.release();
                  console.error('Błąd aktualizacji magazynu przy realizacji:', stockErr);
                  res.status(400).json({ message: stockErr.message });
                });
              }

              finishStatusUpdate();
            });
          }

          if (status === ORDER_STATUS.REJECTED && order.status === ORDER_STATUS.PENDING) {
            return finishStatusUpdate();
          }

          if (status === ORDER_STATUS.COMPLETED && order.status === ORDER_STATUS.PENDING) {
            return connection.rollback(() => {
              connection.release();
              res.status(400).json({
                message: 'Najpierw zaakceptuj zamówienie, dopiero potem możesz je zrealizować',
              });
            });
          }

          finishStatusUpdate();
        });
      });
    });
  });
};

exports.getOrderHistory = (req, res) => {
  const { id } = req.params;

  OrderHistory.findByOrderId(id, (err, results) => {
    if (err) {
      console.error('Błąd podczas pobierania historii zamówienia:', err);
      return res.status(500).json({ message: 'Błąd serwera podczas pobierania historii zamówienia' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Historia zamówienia nie została znaleziona' });
    }

    res.status(200).json(results);
  });
};