import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { translate } from '../i18n/translations';

const PlaceOrder = ({
  language,
  toggleLanguage,
  theme,
  toggleTheme,
}) => {
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
    <div className="app-shell">
     <Navbar
  userData={null}
  language={language}
  toggleLanguage={toggleLanguage}
  theme={theme}
  toggleTheme={toggleTheme}
  links={links}
/>

      <main className="page-content max-w-4xl">
        <div className="page-card">
          <div className="toolbar">
            <div>
              <h1 className="page-title mb-1">
                {t('common.placeOrder')}
              </h1>

              <p className="text-sm text-slate-500">
                {t('common.selectProduct')}
              </p>
            </div>

            <button
              onClick={handleAddProduct}
              className="btn-primary"
            >
              + {t('common.addProduct')}
            </button>
          </div>

          <div className="space-y-4">
            {selectedProducts.length > 0 ? (
              selectedProducts.map((product, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm"
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_140px_auto] md:items-end">
                    <div>
                      <label className="form-label">
                        {t('common.selectProduct')}
                      </label>

                      <select
                        value={product.productId}
                        onChange={(e) =>
                          handleProductChange(index, 'productId', e.target.value)
                        }
                        className="form-input"
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
                    </div>

                    <div>
                      <label className="form-label">
                        {t('table.quantity')}
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={product.quantity}
                        onChange={(e) =>
                          handleProductChange(index, 'quantity', e.target.value)
                        }
                        className="form-input"
                      />
                    </div>

                    <button
                      onClick={() => handleRemoveProduct(index)}
                      className="btn-danger"
                      aria-label={t('common.remove')}
                    >
                      {t('common.remove')}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                {t('common.noData')}
              </div>
            )}
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
            <label className="form-label">
              {t('common.dueDate')}
            </label>

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() =>
                navigate(userRole === 'managing director' ? '/dashboard-md' : '/dashboard-worker')
              }
              className="btn-muted"
            >
              {t('common.cancel')}
            </button>

            <button
              onClick={handleSubmitOrder}
              className="btn-success"
            >
              {t('common.submitOrder')}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlaceOrder;