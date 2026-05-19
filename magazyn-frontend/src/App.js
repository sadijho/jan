import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import RegisterUser from './pages/RegisterUser';
import DashboardMD from './pages/Dashboard-md';
import WarehouseLocations from './pages/WarehouseLocations';
import Products from './pages/Products'; // Import Products component
import UpdateProduct from './pages/UpdateProduct';
import AddProduct from './pages/AddProduct'; // Importujemy formularz dodawania produktu
import Orders from './pages/Orders';
import OrderHistory from './pages/OrderHistory';
import PlaceOrder from './pages/PlaceOrder';
import DashboardWorker from './pages/DashboardWorker';


const App = () => {
  const [language, setLanguage] = useState('pl');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'pl' ? 'en' : 'pl'));
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home language={language} toggleLanguage={toggleLanguage} />} />
        <Route path="/about" element={<About language={language} toggleLanguage={toggleLanguage} />} />
        <Route path="/dashboard" element={<Dashboard language={language} toggleLanguage={toggleLanguage}/>} />
        <Route path="/user-management" element={<UserManagement language={language} toggleLanguage={toggleLanguage} />} />
        <Route path="/user-management/register" element={<RegisterUser language={language} toggleLanguage={toggleLanguage} />} />
        <Route path="/dashboard-md" element={<DashboardMD language={language} toggleLanguage={toggleLanguage} />} />
        <Route path="/locations" element={<WarehouseLocations language={language} toggleLanguage={toggleLanguage} />}/>
        <Route path="/products" element={<Products language={language} toggleLanguage={toggleLanguage} />}/>
        <Route path="/products/update/:id" element={<UpdateProduct language={language} toggleLanguage={toggleLanguage} />}/>
        <Route path="/products/add" element={<AddProduct language={language} toggleLanguage={toggleLanguage} />}/>
        <Route path="/orders" element={<Orders language={language} toggleLanguage={toggleLanguage} />}/>
        <Route path="/order-history/:orderId" element={<OrderHistory language={language} toggleLanguage={toggleLanguage} />}/>
        <Route path="/place-order" element={<PlaceOrder language={language} toggleLanguage={toggleLanguage} />}/>
        <Route path="/dashboard-worker" element={<DashboardWorker language={language} toggleLanguage={toggleLanguage} />} 




/>



      </Routes>
    </Router>
  );
};

export default App;
