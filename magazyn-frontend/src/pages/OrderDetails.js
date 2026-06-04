import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { translate } from '../i18n/translations';

const OrderDetails = ({
  language,
  toggleLanguage,
  theme,
  toggleTheme,
}) => {
  const [order, setOrder] = useState(null);
  const [userData, setUserData] = useState(null);
  const { orderId } = useParams();
  const navigate = useNavigate();
  const t = (key) => translate(language, key);
  const links = [];

  const fetchUserData = useCallback(async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserData(response.data.user);
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  }, []);

  const fetchOrderDetails = useCallback(async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(`/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrder(response.data);
    } catch (err) {
      console.error('Error fetching order details:', err);
      setOrder(null);
    }
  }, [orderId]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  const getBackPath = () => {
    if (userData?.role === 'technical worker') {
      return '/dashboard-technical';
    }

    return '/orders';
  };

  return (
    <div className="app-shell">
      <Navbar
        userData={userData}
        language={language}
        toggleLanguage={toggleLanguage}
        theme={theme}
        toggleTheme={toggleTheme}
        links={links}
      />

      <main className="page-content">
        <section className="page-card">
          <div className="toolbar">
            <div>
              <h1 className="page-title">
                {t('common.orderDetails')}
              </h1>

              <p className="text-sm text-slate-500">
                {t('common.orderDetailsDescription')}
              </p>
            </div>

            <button
              type="button"
              className="btn-muted"
              onClick={() => navigate(getBackPath())}
            >
              {t('common.back')}
            </button>
          </div>

          {order ? (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                  <p className="text-sm text-slate-500">
                    {t('table.orderId')}
                  </p>
                  <p className="font-semibold">
                    {order.order_id}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                  <p className="text-sm text-slate-500">
                    {t('table.status')}
                  </p>
                  <p className="font-semibold">
                    {order.status}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                  <p className="text-sm text-slate-500">
                    {t('table.dueDate')}
                  </p>
                  <p className="font-semibold">
                    {order.due_date
                      ? new Date(order.due_date).toLocaleDateString()
                      : '-'}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                  <p className="text-sm text-slate-500">
                    {t('table.orderedBy')}
                  </p>
                  <p className="font-semibold">
                    {order.first_name} {order.last_name}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                  <p className="text-sm text-slate-500">
                    {t('common.technicalWorker')}
                  </p>
                  <p className="font-semibold">
                    {order.technical_first_name || order.technical_last_name
                      ? `${order.technical_first_name || ''} ${order.technical_last_name || ''}`
                      : order.technical_username || '-'}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                  <p className="text-sm text-slate-500">
                    {t('common.orderNote')}
                  </p>
                  <p className="font-semibold whitespace-pre-wrap">
                    {order.note || '-'}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="mb-3 text-lg font-bold">
                  {t('common.products')}
                </h2>

                {order.products && order.products.length > 0 ? (
                  <div className="table-wrap">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>{t('table.name')}</th>
                          <th>{t('table.quantity')}</th>
                          <th>{t('common.location')}</th>
                          <th>{t('common.manufacturer')}</th>
                        </tr>
                      </thead>

                      <tbody>
                        {order.products.map((product, index) => (
                          <tr key={`${product.product_id}-${index}`}>
                            <td>{product.product_name}</td>
                            <td>{product.quantity}</td>
                            <td>
                              {product.location_code
                                ? `${product.location_code} - ${product.location_description || ''}`
                                : '-'}
                            </td>
                            <td>
                              {product.manufacturer_name || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-state">
                    {t('common.noData')}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="empty-state">
              {t('common.noData')}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default OrderDetails;