const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/db');
const i18n = require('./config/i18n');
const i18nMiddleware = require('./middleware/i18nMiddleware');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(i18n.init); // Inicjalizacja i18n
app.use(i18nMiddleware); // Middleware do obsługi języków

// Logowanie żądań
app.use((req, res, next) => {
  console.log(`Przychodzące żądanie: ${req.method} ${req.path}`);
  next();
});



// Trasy użytkowników
console.log('Rejestrowanie tras użytkowników...');
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

// Trasy produktów
const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);

// Trasy zamówień
const orderRoutes = require('./routes/orders');
app.use('/api/orders', orderRoutes);

const roleRoutes = require('./routes/roles');
app.use('/api/roles', roleRoutes);

const warehouseLocationRoutes = require('./routes/warehouseLocations');
app.use('/api/warehouse-locations', warehouseLocationRoutes);

const orderProductsRoutes = require('./routes/orderProducts');
app.use('/api/order-products', orderProductsRoutes);


const orderHistoryRoutes = require('./routes/orderHistory');
app.use('/api/order-history', orderHistoryRoutes);

// Test połączenia
app.get('/', (req, res) => {
  res.send(req.__('Backend działa!'));
});

// Start serwera
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serwer działa na porcie ${PORT}`));
