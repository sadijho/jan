const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');

require('./config/db');

const i18n = require('./config/i18n');
const i18nMiddleware = require('./middleware/i18nMiddleware');

const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.disable('x-powered-by');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Zbyt wiele żądań z tego adresu IP. Spróbuj ponownie później.',
  },
});

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(xss());
app.use(morgan('dev'));
app.use(helmet());
app.use(limiter);
app.use(i18n.init);
app.use(i18nMiddleware);

// Trasy użytkowników
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

// Trasy produktów
const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);

// Trasy zamówień
const orderRoutes = require('./routes/orders');
app.use('/api/orders', orderRoutes);

// Trasy ról
const roleRoutes = require('./routes/roles');
app.use('/api/roles', roleRoutes);

// Trasy lokalizacji magazynowych
const warehouseLocationRoutes = require('./routes/warehouseLocations');
app.use('/api/warehouse-locations', warehouseLocationRoutes);

// Trasy produktów zamówień
const orderProductsRoutes = require('./routes/orderProducts');
app.use('/api/order-products', orderProductsRoutes);

// Trasy historii zamówień
const orderHistoryRoutes = require('./routes/orderHistory');
app.use('/api/order-history', orderHistoryRoutes);

// Test połączenia
app.get('/', (req, res) => {
  res.send(req.__('Backend działa!'));
});

// Obsługa nieistniejących tras i błędów
app.use(notFound);
app.use(errorHandler);

// Start serwera
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serwer działa na porcie ${PORT}`));