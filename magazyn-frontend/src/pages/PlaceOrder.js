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
  const [technicalWorkers, setTechnicalWorkers] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [assignedTechnicalUserId, setAssignedTechnicalUserId] = useState('');
  const [note, setNote] = useState('');
  const [userRole, setUserRole] = useState('');

  const navigate = useNavigate();
  const t = (key) => translate(language, key);
  const links = [];

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchProducts = async () => {
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

    const fetchTechnicalWorkers = async () => {
      try {
        const response = await axios.get('/api/users/technical-workers', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTechnicalWorkers(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Error fetching technical workers:', err);
        setTechnicalWorkers([]);
      }
    };

    const fetchUserRole = async () => {
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
    fetchTechnicalWorkers();
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
    if (!startDate) {
      toast.error(t('common.selectStartDate'));
      return;
    }

    if (!endDate) {
      toast.error(t('common.selectEndDate'));
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      toast.error(t('common.invalidDateRange'));
      return;
    }

    if (!assignedTechnicalUserId) {
      toast.error(t('common.selectTechnicalWorker'));
      return;
    }

    if (selectedProducts.length === 0) {
      toast.error(t('common.addAtLeastOneProduct'));
      return;
    }

    const hasInvalidProduct = selectedProducts.some(
      (product) =>
        !product.productId ||
        !product.quantity ||
        Number(product.quantity) <= 0
    );

    if (hasInvalidProduct) {
      toast.error(t('common.completeProductData'));
      return;
    }

    if (note.length > 1000) {
      toast.error(t('common.noteTooLong'));
      return;
    }

    const token = localStorage.getItem('token');

    try {
      await axios.post(
        '/api/orders',
        {
          products: selectedProducts,
          startDate,
          endDate,
          assignedTechnicalUserId,
          note,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(t('common.orderPlaced'));
      navigate(userRole === 'managing director' ? '/dashboard-md' : '/dashboard-worker');
    } catch (err) {
      console.error('Error placing order:', err);
      toast.error(err.response?.data?.message || t('common.orderPlaceError'));
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
              type="button"
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
                      type="button"
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

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <label className="form-label">
                {t('common.startDate')}
              </label>

              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <label className="form-label">
                {t('common.endDate')}
              </label>

              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
            <label className="form-label">
              {t('common.technicalWorker')}
            </label>

            <select
              value={assignedTechnicalUserId}
              onChange={(e) => setAssignedTechnicalUserId(e.target.value)}
              className="form-input"
            >
              <option value="">
                {t('common.selectTechnicalWorker')}
              </option>

              {technicalWorkers.map((worker) => (
                <option
                  key={worker.id}
                  value={worker.id}
                >
                  {worker.first_name || ''} {worker.last_name || ''} ({worker.username})
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
            <label className="form-label">
              {t('common.orderNote')}
            </label>

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="form-input min-h-[120px]"
              maxLength={1000}
              placeholder={t('common.orderNotePlaceholder')}
            />

            <p className="mt-2 text-xs text-slate-500">
              {note.length}/1000
            </p>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() =>
                navigate(userRole === 'managing director' ? '/dashboard-md' : '/dashboard-worker')
              }
              className="btn-muted"
            >
              {t('common.cancel')}
            </button>

            <button
              type="button"
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