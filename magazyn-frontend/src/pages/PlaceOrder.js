import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = ({ language, toggleLanguage }) => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [dueDate, setDueDate] = useState('');
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  const translations = {
    pl: {
      placeOrder: 'Złóż zamówienie',
      selectProduct: 'Wybierz produkt',
      quantity: 'Ilość',
      dueDate: 'Termin realizacji',
      addProduct: 'Dodaj produkt',
      submitOrder: 'Złóż zamówienie',
      cancel: 'Anuluj',
      logout: 'Wyloguj się',
    },
    en: {
      placeOrder: 'Place Order',
      selectProduct: 'Select Product',
      quantity: 'Quantity',
      dueDate: 'Due Date',
      addProduct: 'Add Product',
      submitOrder: 'Submit Order',
      cancel: 'Cancel',
      logout: 'Log out',
    },
  };

  const t = translations[language];

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('/api/products', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(Array.isArray(response.data.results) ? response.data.results : []);
      } catch (err) {
        console.error('Błąd podczas pobierania produktów:', err);
        setProducts([]);
      }
    };

    const fetchUserRole = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserRole(response.data.user.role);
      } catch (err) {
        console.error('Błąd podczas pobierania danych użytkownika:', err);
      }
    };

    fetchProducts();
    fetchUserRole();
  }, []);

  const handleAddProduct = () => {
    setSelectedProducts([...selectedProducts, { productId: '', quantity: 1 }]);
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index][field] = value;
    setSelectedProducts(updatedProducts);
  };

  const handleRemoveProduct = (index) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts.splice(index, 1);
    setSelectedProducts(updatedProducts);
  };

  const handleSubmitOrder = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        '/api/orders',
        { products: selectedProducts, dueDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(language === 'pl' ? 'Zamówienie zostało złożone!' : 'Order placed successfully!');
      navigate(userRole === 'managing director' ? '/dashboard-md' : '/dashboard-worker');
    } catch (err) {
      console.error('Błąd podczas składania zamówienia:', err);
      alert(language === 'pl' ? 'Nie udało się złożyć zamówienia.' : 'Failed to place order.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-10 px-6">
      {/* Navbar */}
      <nav className="bg-beige-200 shadow px-6 py-4 flex justify-between items-center fixed top-0 left-0 w-full z-10">
        <div className="flex items-center gap-4">
          <img
            src="/assets/logo.png"
            alt="Magazyn Logo"
            className="w-10 h-10 cursor-pointer"
            onClick={() => navigate(userRole === 'managing director' ? '/dashboard-md' : '/dashboard-worker')}
          />
          <h1 className="text-lg font-bold">{t.placeOrder}</h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            onClick={toggleLanguage}
          >
            {language === 'pl' ? 'EN' : 'PL'}
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            {t.logout}
          </button>
        </div>
      </nav>

      {/* Form */}
      <div className="w-full max-w-xl mt-20">
        <h2 className="text-xl font-bold mb-4">{t.placeOrder}</h2>
        {selectedProducts.map((product, index) => (
          <div key={index} className="flex items-center gap-4 mb-4">
            <select
              value={product.productId}
              onChange={(e) => handleProductChange(index, 'productId', e.target.value)}
              className="border px-4 py-2 rounded-lg flex-1"
            >
              <option value="">{t.selectProduct}</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Ilość: {p.quantity})
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              value={product.quantity}
              onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
              className="border px-4 py-2 rounded-lg w-24"
            />
            <button
              onClick={() => handleRemoveProduct(index)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              X
            </button>
          </div>
        ))}
        <button
          onClick={handleAddProduct}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {t.addProduct}
        </button>
        <div className="mt-4">
          <label className="block mb-2">{t.dueDate}</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="border px-4 py-2 rounded-lg w-full"
          />
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={() => navigate(userRole === 'managing director' ? '/dashboard-md' : '/dashboard-worker')}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleSubmitOrder}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            {t.submitOrder}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
