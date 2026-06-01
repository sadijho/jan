import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { translate } from '../i18n/translations';

const PlaceOrder = ({ language, toggleLanguage }) => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [dueDate, setDueDate] = useState('');
  const [userRole, setUserRole] = useState('');

  const navigate = useNavigate();
  const t = (key) => translate(language, key);
  const links = [];

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get('/api/products', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProducts(Array.isArray(response.data.results) ? response.data.results : []);
      } catch (err) {
        console.error('Error fetching products:', err);
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
        console.error('Error fetching user data:', err);
      }
    };

    fetchProducts();
    fetchUserRole();
  }, []);

  const handleAddProduct = () => {
    setSelectedProducts([
      ...selectedProducts,
      {
        productId: '',
        quantity: 1,
      },
    ]);
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
        {
          products: selectedProducts,
          dueDate,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(t('common.orderPlaced'));
      navigate(userRole === 'managing director' ? '/dashboard-md' : '/dashboard-worker');
    } catch (err) {
      console.error('Error placing order:', err);
      toast.error(t('common.orderPlaceError'));
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-10 px-6">
      <Navbar
        userData={null}
        language={language}
        toggleLanguage={toggleLanguage}
        links={links}
      />

      <div className="w-full max-w-xl mt-20">
        <h2 className="text-xl font-bold mb-4">
          {t('common.placeOrder')}
        </h2>

        {selectedProducts.map((product, index) => (
          <div
            key={index}
            className="flex items-center gap-4 mb-4"
          >
            <select
              value={product.productId}
              onChange={(e) =>
                handleProductChange(index, 'productId', e.target.value)
              }
              className="border px-4 py-2 rounded-lg flex-1"
            >
              <option value="">
                {t('common.selectProduct')}
              </option>

              {products.map((p) => (
                <option
                  key={p.id}
                  value={p.id}
                >
                  {p.name} ({t('common.stockQuantity')}: {p.quantity})
                </option>
              ))}
            </select>

            <input
              type="number"
              min="1"
              value={product.quantity}
              onChange={(e) =>
                handleProductChange(index, 'quantity', e.target.value)
              }
              className="border px-4 py-2 rounded-lg w-24"
            />

            <button
              onClick={() => handleRemoveProduct(index)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              aria-label={t('common.remove')}
            >
              X
            </button>
          </div>
        ))}

        <button
          onClick={handleAddProduct}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {t('common.addProduct')}
        </button>

        <div className="mt-4">
          <label className="block mb-2">
            {t('common.dueDate')}
          </label>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="border px-4 py-2 rounded-lg w-full"
          />
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={() =>
              navigate(userRole === 'managing director' ? '/dashboard-md' : '/dashboard-worker')
            }
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
          >
            {t('common.cancel')}
          </button>

          <button
            onClick={handleSubmitOrder}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            {t('common.submitOrder')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;