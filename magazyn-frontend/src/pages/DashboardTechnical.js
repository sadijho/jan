import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { translate } from '../i18n/translations';

const DashboardTechnical = ({
  language,
  toggleLanguage,
  theme,
  toggleTheme,
}) => {
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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

  const fetchAssignedOrders = useCallback(async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(
        `/api/orders/assigned-to-me?page=${currentPage}&limit=10`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOrders(response.data.results || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      console.error('Error fetching assigned orders:', err);
      setOrders([]);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    fetchAssignedOrders();
  }, [fetchAssignedOrders]);

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
                {t('common.assignedOrders')}
              </h1>

              <p className="text-sm text-slate-500">
                {t('common.technicalDashboardDescription')}
              </p>
            </div>
          </div>

          {orders.length > 0 ? (
            <>
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{t('table.orderId')}</th>
                      <th>{t('table.status')}</th>
                      <th>{t('table.dueDate')}</th>
                      <th>{t('table.orderedBy')}</th>
                      <th>{t('common.orderNote')}</th>
                      <th>{t('table.actions')}</th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.order_id}>
                        <td>{order.order_id}</td>
                        <td>{order.status}</td>
                        <td>
                          {order.due_date
                            ? new Date(order.due_date).toLocaleDateString()
                            : '-'}
                        </td>
                        <td>
                          {order.first_name} {order.last_name}
                        </td>
                        <td>{order.note || '-'}</td>
                        <td>
                          <button
                            className="btn-primary"
                            onClick={() => navigate(`/orders/${order.order_id}`)}
                          >
                            {t('common.details')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex justify-between">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="btn-muted disabled:opacity-50"
                >
                  {t('common.previous')}
                </button>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className="btn-muted disabled:opacity-50"
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
        </section>
      </main>
    </div>
  );
};

export default DashboardTechnical;