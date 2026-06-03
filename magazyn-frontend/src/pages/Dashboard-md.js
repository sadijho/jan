import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { translate } from '../i18n/translations';

const DashboardMD = ({
  language,
  toggleLanguage,
  theme,
  toggleTheme,
}) => {
  const [userData, setUserData] = useState(null);
  const [groupedData, setGroupedData] = useState([]);
  const [showAllOrders, setShowAllOrders] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState('all');
  const [employeeSort, setEmployeeSort] = useState('az');
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const t = (key) => translate(language, key);

  const labels = {
    pl: {
      allEmployees: 'Wszyscy pracownicy',
      employee: 'Pracownik',
      sortEmployees: 'Sortuj pracowników',
      az: 'A-Z',
      za: 'Z-A',
      unknownEmployee: 'Nieznany pracownik',
      manufacturers: 'Producenci',
      reports: 'Raporty',
    },
    en: {
      allEmployees: 'All employees',
      employee: 'Employee',
      sortEmployees: 'Sort employees',
      az: 'A-Z',
      za: 'Z-A',
      unknownEmployee: 'Unknown employee',
      manufacturers: 'Manufacturers',
      reports: 'Reports',
    },
  };

  const l = labels[language] || labels.pl;

  const links = [
    { label: t('common.locations'), path: '/locations', color: 'bg-blue-500' },
    { label: t('common.products'), path: '/products', color: 'bg-blue-500' },
    {
      label: l.manufacturers,
      path: '/manufacturers',
      color: 'bg-blue-500',
    },
    {
      label: l.reports,
      path: '/reports',
      color: 'bg-purple-500',
    },
    {
      label: pendingOrdersCount > 0
        ? `${t('common.statuses')} (${pendingOrdersCount})`
        : t('common.statuses'),
      path: '/orders',
      color: pendingOrdersCount > 0 ? 'bg-red-500' : 'bg-blue-500',
    },
    { label: t('common.placeOrder'), path: '/place-order', color: 'bg-green-500' },
  ];

  const fetchPendingOrdersCount = useCallback(async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get('/api/orders/pending-count', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPendingOrdersCount(response.data.count || 0);
    } catch (err) {
      setPendingOrdersCount(0);
    }
  }, []);

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

      const grouped = (results || []).reduce((acc, item) => {
        const {
          order_id,
          product_name,
          quantity,
          user_id,
          first_name,
          last_name,
        } = item;

        if (!acc[order_id]) {
          acc[order_id] = {
            order_id,
            user_id,
            first_name,
            last_name,
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
      setTotalPages(totalPages || 1);
    } catch (err) {
      console.error('Error fetching order products:', err);
      setGroupedData([]);
      setTotalPages(1);
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
    fetchPendingOrdersCount();
  }, [fetchPendingOrdersCount]);

  useEffect(() => {
    if (userData) {
      fetchOrderProducts();
    }
  }, [fetchOrderProducts, userData]);

  useEffect(() => {
    setSelectedUserId('all');
    setCurrentPage(1);
  }, [showAllOrders]);

  const employees = useMemo(() => {
    const employeeMap = new Map();

    groupedData.forEach((order) => {
      if (!order.user_id) return;

      const fullName = `${order.first_name || ''} ${order.last_name || ''}`.trim();

      employeeMap.set(order.user_id, {
        user_id: order.user_id,
        name: fullName || l.unknownEmployee,
      });
    });

    return Array.from(employeeMap.values()).sort((a, b) => {
      if (employeeSort === 'za') {
        return b.name.localeCompare(a.name);
      }

      return a.name.localeCompare(b.name);
    });
  }, [groupedData, employeeSort, l.unknownEmployee]);

  const visibleOrders = useMemo(() => {
    if (selectedUserId === 'all') {
      return groupedData;
    }

    return groupedData.filter(
      (order) => String(order.user_id) === String(selectedUserId)
    );
  }, [groupedData, selectedUserId]);

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

            <div className="flex flex-wrap gap-2">
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

          {pendingOrdersCount > 0 && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {language === 'pl'
                ? `Masz ${pendingOrdersCount} oczekujące wnioski zamówień do akceptacji.`
                : `You have ${pendingOrdersCount} pending order requests to approve.`}
            </div>
          )}

          {showAllOrders && (
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="form-label">
                  {l.employee}
                </label>

                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="form-input"
                >
                  <option value="all">{l.allEmployees}</option>
                  {employees.map((employee) => (
                    <option key={employee.user_id} value={employee.user_id}>
                      {employee.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">
                  {l.sortEmployees}
                </label>

                <select
                  value={employeeSort}
                  onChange={(e) => setEmployeeSort(e.target.value)}
                  className="form-input"
                >
                  <option value="az">{l.az}</option>
                  <option value="za">{l.za}</option>
                </select>
              </div>
            </div>
          )}

          <div className="mt-6">
            {visibleOrders.length > 0 ? (
              <>
                <div className="data-table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>{t('table.orderId')}</th>
                        <th>{l.employee}</th>
                        <th>{t('table.products')}</th>
                      </tr>
                    </thead>

                    <tbody>
                      {visibleOrders.map((order) => (
                        <tr key={order.order_id}>
                          <td className="font-semibold text-slate-900">
                            #{order.order_id}
                          </td>

                          <td>
                            {`${order.first_name || ''} ${order.last_name || ''}`.trim() || '-'}
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

                {selectedUserId === 'all' && (
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
                )}
              </>
            ) : (
              <div className="empty-state">
                {t('common.noData')}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardMD;