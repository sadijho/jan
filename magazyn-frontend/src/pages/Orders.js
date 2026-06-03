import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';

const Orders = ({
  language,
  toggleLanguage,
  theme,
  toggleTheme,
}) => {
  const [orders, setOrders] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userRole, setUserRole] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const translations = {
    pl: {
      orders: 'Zamówienia',
      orderId: 'ID zamówienia',
      status: 'Status',
      dueDate: 'Termin realizacji',
      orderedBy: 'Złożone przez',
      actions: 'Akcje',
      search: 'Szukaj',
      searchPlaceholder: 'Wpisz ID zamówienia...',
      clear: 'Wyczyść',
      update: 'Zrealizuj',
      viewHistory: 'Historia',
      noData: 'Brak danych do wyświetlenia.',
      next: 'Dalej',
      previous: 'Wstecz',
      page: 'Strona',
      of: 'z',
      completed: 'Zrealizowane',
      inProgress: 'W trakcie',
      unknownStatus: 'Nieznany status',
      statusUpdated: 'Status zamówienia został zaktualizowany!',
      statusUpdateError: 'Nie udało się zaktualizować statusu zamówienia.',
    },
    en: {
      orders: 'Orders',
      orderId: 'Order ID',
      status: 'Status',
      dueDate: 'Due date',
      orderedBy: 'Ordered by',
      actions: 'Actions',
      search: 'Search',
      searchPlaceholder: 'Enter order ID...',
      clear: 'Clear',
      update: 'Complete',
      viewHistory: 'History',
      noData: 'No data to display.',
      next: 'Next',
      previous: 'Previous',
      page: 'Page',
      of: 'of',
      completed: 'Completed',
      inProgress: 'In progress',
      unknownStatus: 'Unknown status',
      statusUpdated: 'Order status updated!',
      statusUpdateError: 'Failed to update order status.',
    },
  };

  const t = translations[language] || translations.pl;

  const links = [];

  const fetchOrders = useCallback(async (page = 1) => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(`/api/orders?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(response.data.results || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      setOrders([]);
    }
  }, []);

  const fetchUserRole = useCallback(async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserRole(response.data.user.role);
    } catch (err) {
      setUserRole('');
    }
  }, []);

  useEffect(() => {
    fetchUserRole();
  }, [fetchUserRole]);

  useEffect(() => {
    if (!isSearching) {
      fetchOrders(currentPage);
    }
  }, [currentPage, fetchOrders, isSearching]);

  const handleSearchById = async () => {
    const trimmedSearchId = searchId.trim();

    if (!trimmedSearchId) {
      setIsSearching(false);
      setCurrentPage(1);
      fetchOrders(1);
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(`/api/orders/${trimmedSearchId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders([response.data]);
      setTotalPages(1);
      setCurrentPage(1);
      setIsSearching(true);
    } catch (err) {
      setOrders([]);
      setTotalPages(1);
      setCurrentPage(1);
      setIsSearching(true);
    }
  };

  const handleClearSearch = () => {
    setSearchId('');
    setIsSearching(false);
    setCurrentPage(1);
    fetchOrders(1);
  };

  const handleUpdateStatus = async (orderId) => {
    const token = localStorage.getItem('token');

    try {
      await axios.put(
        `/api/orders/${orderId}`,
        { status: 'zrealizowane' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(t.statusUpdated);

      if (isSearching && searchId.trim()) {
        handleSearchById();
      } else {
        fetchOrders(currentPage);
      }
    } catch (err) {
toast.error(t.statusUpdateError);
    }
  };

  const handleViewHistory = (orderId) => {
    window.location.href = `/order-history/${orderId}`;
  };

  const getStatusLabel = (status) => {
    if (status === 'zrealizowane') return t.completed;
    if (status === 'w trakcie') return t.inProgress;
    return status || t.unknownStatus;
  };

  const getStatusClassName = (status) => {
    if (status === 'zrealizowane') {
      return 'inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700';
    }

    if (status === 'w trakcie') {
      return 'inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700';
    }

    return 'inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700';
  };

  return (
    <div className="app-shell">
      <Navbar
        userData={userRole ? { role: userRole } : null}
        language={language}
        toggleLanguage={toggleLanguage}
        theme={theme}
        toggleTheme={toggleTheme}
        links={links}
      />

      <main className="page-content">
        <section className="page-card">
          <div className="toolbar">
            <h2 className="page-title">{t.orders}</h2>

            <div className="flex flex-wrap gap-3">
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearchById();
                }}
                placeholder={t.searchPlaceholder}
                className="form-input min-w-[240px]"
              />

              <button onClick={handleSearchById} className="btn-primary">
                {t.search}
              </button>

              {isSearching && (
                <button onClick={handleClearSearch} className="btn-muted">
                  {t.clear}
                </button>
              )}
            </div>
          </div>

          {orders.length > 0 ? (
            <>
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{t.orderId}</th>
                      <th>{t.status}</th>
                      <th>{t.dueDate}</th>
                      <th>{t.orderedBy}</th>
                      <th>{t.actions}</th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.order_id}>
                        <td>#{order.order_id}</td>
                        <td>
                          <span className={getStatusClassName(order.status)}>
                            {getStatusLabel(order.status)}
                          </span>
                        </td>
                        <td>
                          {order.due_date
                            ? new Date(order.due_date).toLocaleDateString()
                            : '-'}
                        </td>
                        <td>
                          {order.first_name || order.last_name
                            ? `${order.first_name || ''} ${order.last_name || ''}`.trim()
                            : '-'}
                        </td>
                        <td>
                          <div className="flex flex-wrap gap-2">
                            {order.status !== 'zrealizowane' && (
                              <button
                                onClick={() => handleUpdateStatus(order.order_id)}
                                className="btn-primary"
                              >
                                {t.update}
                              </button>
                            )}

                            <button
                              onClick={() => handleViewHistory(order.order_id)}
                              className="btn-success"
                            >
                              {t.viewHistory}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {!isSearching && (
                <div className="toolbar mt-6">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className="btn-muted disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t.previous}
                  </button>

                  <span className="text-sm font-medium text-gray-600">
                    {t.page} {currentPage} {t.of} {totalPages}
                  </span>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className="btn-muted disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t.next}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">{t.noData}</div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Orders;