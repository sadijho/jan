const Product = require('../models/product');
const Order = require('../models/order');
const OrderProducts = require('../models/orderProducts');
const OrderHistory = require('../models/orderHistory');

// Tworzenie zamówienia z wieloma produktami


exports.createOrder = async (req, res) => {
  const { products, dueDate } = req.body; // Lista produktów [{ productId, quantity }]
  const userId = req.user.id;

  console.log('Żądanie do tworzenia zamówienia:', { products, dueDate, userId });

  try {
    // Tworzenie zamówienia
    const orderResult = await new Promise((resolve, reject) => {
      Order.create({ userId, dueDate }, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    const orderId = orderResult.insertId;

    // Przetwarzanie produktów zamówienia
    await Promise.all(
      products.map(async (product) => {
        const productResult = await new Promise((resolve, reject) => {
          Product.findById(product.productId, (err, results) => {
            if (err || results.length === 0) reject(new Error(`Produkt ID ${product.productId} nie został znaleziony`));
            else resolve(results[0]);
          });
        });

        if (productResult.quantity < product.quantity) {
          throw new Error(`Brak wystarczającej ilości produktu: ${productResult.name}`);
        }

        // Aktualizacja stanu magazynowego produktu
        await new Promise((resolve, reject) => {
          const updatedProduct = {
            name: productResult.name,
            description: productResult.description,
            quantity: productResult.quantity - product.quantity,
            status: productResult.status,
            locationId: productResult.location_id, 
          };
        
          Product.update(product.productId, updatedProduct, (err) => {
            if (err) {
              console.error('Błąd podczas aktualizacji produktu:', err);
              reject(err);
            } else {
              resolve();
            }
          });
        });
        

        // Dodawanie produktu do zamówienia
        await new Promise((resolve, reject) => {
          OrderProducts.create(
            { orderId, productId: product.productId, quantity: product.quantity },
            (err) => {
              if (err) reject(err);
              else resolve();
            }
          );
        });
      })
    );

    res.status(201).json({ message: 'Zamówienie zostało złożone i produkty zostały dodane' });
  } catch (err) {
    console.error('Błąd podczas tworzenia zamówienia:', err.message);
    res.status(500).json({ message: err.message || 'Błąd serwera podczas tworzenia zamówienia' });
  }
};

// Pobieranie zamówień
exports.getOrders = (req, res) => {
  const userRole = req.user.role;
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  let query = `
    SELECT o.id AS order_id, o.status, o.due_date, 
           u.first_name, u.last_name, u.id AS user_id 
    FROM Orders o 
    JOIN Users u ON o.user_id = u.id
  `;
  let queryParams = [];

  if (userRole === 'worker') {
    query += ' WHERE o.user_id = ?';
    queryParams.push(userId);
  }

  query += ' LIMIT ? OFFSET ?';
  queryParams.push(limit, offset);

  Order.findCustom(query, queryParams, (err, results) => {
    if (err) {
      console.error('Błąd podczas pobierania zamówień:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }

    // Pobranie całkowitej liczby zamówień
    const countQuery = `
      SELECT COUNT(*) AS totalCount 
      FROM Orders o 
      JOIN Users u ON o.user_id = u.id
      ${userRole === 'worker' ? 'WHERE o.user_id = ?' : ''}
    `;

    Order.findCustom(countQuery, userRole === 'worker' ? [userId] : [], (err, countResults) => {
      if (err) {
        console.error('Błąd podczas liczenia zamówień:', err);
        return res.status(500).json({ message: 'Błąd serwera' });
      }

      const totalCount = countResults[0].totalCount;
      const totalPages = Math.ceil(totalCount / limit);

      res.status(200).json({ results, totalPages, currentPage: page });
    });
  });
};

exports.getOrderById = (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT o.id AS order_id, o.status, o.due_date, 
           u.first_name, u.last_name, u.id AS user_id
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

    // Pobranie powiązanych produktów zamówienia
    OrderProducts.findByOrderId(id, (err, products) => {
      if (err) {
        console.error('Błąd podczas pobierania produktów zamówienia:', err);
        return res.status(500).json({ message: 'Błąd serwera' });
      }

      res.status(200).json({ ...order, products });
    });
  });
};



// Aktualizacja statusu zamówienia i zapis do historii
exports.updateOrderStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const userRole = req.user.role;
  const userId = req.user.id;

  if (!status || !['w trakcie', 'zrealizowane'].includes(status)) {
    return res.status(400).json({ message: 'Nieprawidłowy status zamówienia' });
  }

  Order.findById(id, (err, orderResults) => {
    if (err || orderResults.length === 0) {
      return res.status(404).json({ message: 'Zamówienie nie zostało znalezione' });
    }

    const order = orderResults[0];

    // Sprawdź, czy `worker` aktualizuje swoje zamówienie
    if (userRole === 'worker' && order.user_id !== userId) {
      return res.status(403).json({ message: 'Nie masz uprawnień do aktualizacji tego zamówienia' });
    }

    if (status === 'zrealizowane') {
      OrderProducts.findByOrderId(id, (err, products) => {
        if (err) {
          console.error('Błąd podczas pobierania produktów zamówienia:', err);
          return res.status(500).json({ message: 'Błąd podczas pobierania produktów zamówienia' });
        }

        let successCount = 0;

        products.forEach((op) => {
          Product.findById(op.product_id, (err, productResults) => {
            if (err || productResults.length === 0) {
              return res.status(404).json({ message: 'Produkt nie został znaleziony' });
            }

            const product = productResults[0];

            const updatedProduct = {
              name: product.name,
              description: product.description,
              quantity: product.quantity + op.quantity, // Dodajemy ilość produktu z zamówienia
              status: product.status,
              locationId: product.location_id, // Przekazujemy poprawne location_id
            };
        
            console.log('Dane do aktualizacji produktu:', updatedProduct);
            Product.update(op.product_id, updatedProduct, (err) => {
              if (err) {
                return res.status(500).json({ message: 'Błąd podczas aktualizacji produktu przy zwrocie' });
              }

              successCount++;
              if (successCount === products.length) {
                Order.updateStatus(id, status, (err) => {
                  if (err) {
                    return res.status(500).json({ message: 'Błąd podczas aktualizacji statusu zamówienia' });
                  }

                  // Dodanie do historii zamówienia
                  OrderHistory.create(
                    { orderId: id, changedByUserId: userId },
                    (err) => {
                      if (err) {
                        console.error('Błąd podczas rejestrowania zmiany w historii zamówień:', err);
                      }
                      res.status(200).json({ message: 'Status zamówienia został zaktualizowany i zmiana została zarejestrowana' });
                    }
                  );
                });
              }
            });
          });
        });
      });
    } else {
      Order.updateStatus(id, status, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Błąd podczas aktualizacji statusu zamówienia' });
        }

        // Dodanie do historii zamówienia
        OrderHistory.create(
          { orderId: id, changedByUserId: userId },
          (err) => {
            if (err) {
              console.error('Błąd podczas rejestrowania zmiany w historii zamówień:', err);
            }
            res.status(200).json({ message: 'Status zamówienia został zaktualizowany i zmiana została zarejestrowana' });
          }
        );
      });
    }
  });
};

// Pobieranie historii zamówienia
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
