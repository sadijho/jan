import React, { useState } from 'react';
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

import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  const [language, setLanguage] = useState('pl');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'pl' ? 'en' : 'pl'));
  };

  return (
    <Router>
      <>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                language={language}
                toggleLanguage={toggleLanguage}
              />
            }
          />

          <Route
            path="/about"
            element={
              <About
                language={language}
                toggleLanguage={toggleLanguage}
              />
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Dashboard
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user-management"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserManagement
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user-management/register"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <RegisterUser
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard-md"
            element={
              <ProtectedRoute allowedRoles={['managing director']}>
                <DashboardMD
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard-worker"
            element={
              <ProtectedRoute allowedRoles={['worker']}>
                <DashboardWorker
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/locations"
            element={
              <ProtectedRoute allowedRoles={['admin', 'managing director', 'worker']}>
                <WarehouseLocations
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/products"
            element={
              <ProtectedRoute allowedRoles={['admin', 'managing director', 'worker']}>
                <Products
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/products/add"
            element={
              <ProtectedRoute allowedRoles={['admin', 'managing director']}>
                <AddProduct
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/products/update/:id"
            element={
              <ProtectedRoute allowedRoles={['admin', 'managing director']}>
                <UpdateProduct
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute allowedRoles={['admin', 'managing director', 'worker']}>
                <Orders
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/order-history/:orderId"
            element={
              <ProtectedRoute allowedRoles={['admin', 'managing director', 'worker']}>
                <OrderHistory
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/place-order"
            element={
              <ProtectedRoute allowedRoles={['admin', 'managing director', 'worker']}>
                <PlaceOrder
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
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
          theme="colored"
        />
      </>
    </Router>
  );
};

export default App;
