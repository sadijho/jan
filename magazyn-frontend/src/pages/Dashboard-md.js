import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { translate } from '../i18n/translations';

const DashboardMD = ({ language, toggleLanguage }) => {
  const [userData, setUserData] = useState(null);
  const [groupedData, setGroupedData] = useState([]);
  const [showAllOrders, setShowAllOrders] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const t = (key) => translate(language, key);

  const links = [
    { label: t('common.locations'), path: '/locations', color: 'bg-blue-500' },
    { label: t('common.products'), path: '/products', color: 'bg-blue-500' },
    { label: t('common.statuses'), path: '/orders', color: 'bg-blue-500' },
    { label: t('common.placeOrder'), path: '/place-order', color: 'bg-green-500' },
  ];

  const fetchOrderProducts = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = showAllOrders
        ? `/api/order-products?page=${currentPage}&limit=7`
        : `/api/order-products/user/${userData?.id}?page=${currentPage}&limit=7`;

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { results, totalPages } = response.data;

      const grouped = results.reduce((acc, item) => {
        const { order_id, product_name, quantity } = item;

        if (!acc[order_id]) {
          acc[order_id] = {
            order_id,
            products: [],
          };
        }

        acc[order_id].products.push({
          product_name,
          quantity,
        });

        return acc;
      }, {});

      setGroupedData(Object.values(grouped));
      setTotalPages(totalPages);
    } catch (err) {
      console.error('Error fetching order products:', err);
    }
  }, [currentPage, showAllOrders, userData?.id]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserData(response.data.user);
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      fetchOrderProducts();
    }
  }, [fetchOrderProducts, userData]);

  return (
    <div className="app-shell">
      <Navbar
        userData={userData}
        language={language}
        toggleLanguage={toggleLanguage}
        links={links}
      />

      <main className="page-content">
        <div className="page-card">
          <div className="toolbar">
            <div>
              <h1 className="page-title mb-1">
                {t('common.orders')}
              </h1>

              <p className="text-sm text-slate-500">
                {userData
                  ? `${userData.firstName} ${userData.lastName}`
                  : t('common.loading')}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowAllOrders(true);
                  setCurrentPage(1);
                }}
                className={showAllOrders ? 'btn-primary' : 'btn-muted'}
              >
                {t('common.allOrders')}
              </button>

              <button
                onClick={() => {
                  setShowAllOrders(false);
                  setCurrentPage(1);
                }}
                className={!showAllOrders ? 'btn-primary' : 'btn-muted'}
              >
                {t('common.myOrders')}
              </button>
            </div>
          </div>

          {groupedData.length > 0 ? (
            <>
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{t('table.orderId')}</th>
                      <th>{t('table.products')}</th>
                    </tr>
                  </thead>

                  <tbody>
                    {groupedData.map((order) => (
                      <tr key={order.order_id}>
                        <td className="font-semibold text-slate-900">
                          #{order.order_id}
                        </td>

                        <td>
                          <div className="flex flex-wrap gap-2">
                            {order.products.map((product, idx) => (
                              <span
                                key={idx}
                                className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                              >
                                {product.product_name}: {product.quantity}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="btn-muted"
                >
                  {t('common.previous')}
                </button>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="btn-muted"
                >
                  {t('common.next')}
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">
              {t('common.noData')}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardMD;