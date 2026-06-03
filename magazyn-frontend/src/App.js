import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import RegisterUser from './pages/RegisterUser';
import DashboardMD from './pages/Dashboard-md';
import WarehouseLocations from './pages/WarehouseLocations';
import Products from './pages/Products';
import UpdateProduct from './pages/UpdateProduct';
import AddProduct from './pages/AddProduct';
import Orders from './pages/Orders';
import OrderHistory from './pages/OrderHistory';
import PlaceOrder from './pages/PlaceOrder';
import DashboardWorker from './pages/DashboardWorker';
import Manufacturers from './pages/Manufacturers';

import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  const [language, setLanguage] = useState('pl');

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'pl' ? 'en' : 'pl'));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const sharedProps = {
    language,
    toggleLanguage,
    theme,
    toggleTheme,
  };

  return (
    <Router>
      <>
        <Routes>
          <Route path="/" element={<Home {...sharedProps} />} />
          <Route path="/about" element={<About {...sharedProps} />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Dashboard {...sharedProps} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user-management"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserManagement {...sharedProps} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user-management/register"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <RegisterUser {...sharedProps} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard-md"
            element={
              <ProtectedRoute allowedRoles={['managing director']}>
                <DashboardMD {...sharedProps} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard-worker"
            element={
              <ProtectedRoute allowedRoles={['worker']}>
                <DashboardWorker {...sharedProps} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/locations"
            element={
              <ProtectedRoute allowedRoles={['managing director', 'worker']}>
                <WarehouseLocations {...sharedProps} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/products"
            element={
              <ProtectedRoute allowedRoles={['managing director', 'worker']}>
                <Products {...sharedProps} />
              </ProtectedRoute>
            }
          />

          <Route
  path="/manufacturers"
  element={
    <ProtectedRoute allowedRoles={['managing director']}>
      <Manufacturers {...sharedProps} />
    </ProtectedRoute>
  }
/>

          <Route
            path="/products/add"
            element={
              <ProtectedRoute allowedRoles={['managing director']}>
                <AddProduct {...sharedProps} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/products/update/:id"
            element={
              <ProtectedRoute allowedRoles={['managing director']}>
                <UpdateProduct {...sharedProps} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute allowedRoles={['managing director', 'worker']}>
                <Orders {...sharedProps} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/order-history/:orderId"
            element={
              <ProtectedRoute allowedRoles={['managing director', 'worker']}>
                <OrderHistory {...sharedProps} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/place-order"
            element={
              <ProtectedRoute allowedRoles={['managing director', 'worker']}>
                <PlaceOrder {...sharedProps} />
              </ProtectedRoute>
            }
          />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme={theme === 'dark' ? 'dark' : 'colored'}
        />
      </>
    </Router>
  );
};

export default App;