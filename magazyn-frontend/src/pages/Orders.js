import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

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
      products: 'Produkty',
      actions: 'Akcje',
      search: 'Szukaj',
      searchPlaceholder: 'Wpisz ID zamówienia...',
      clear: 'Wyczyść',
      approve: 'Akceptuj',
      reject: 'Odrzuć',
      complete: 'Zrealizuj',
      viewHistory: 'Historia',
      noData: 'Brak danych do wyświetlenia.',
      next: 'Dalej',
      previous: 'Wstecz',
      page: 'Strona',
      of: 'z',
      completed: 'Zrealizowane',
      inProgress: 'W trakcie',
      pending: 'Oczekuje',
      rejected: 'Odrzucone',
      unknownStatus: 'Nieznany status',
      approvedSuccess: 'Zamówienie zostało zaakceptowane.',
      rejectedSuccess: 'Zamówienie zostało odrzucone.',
      completedSuccess: 'Zamówienie zostało zrealizowane.',
      statusUpdateError: 'Nie udało się zaktualizować statusu zamówienia.',
    },
    en: {
      orders: 'Orders',
      orderId: 'Order ID',
      status: 'Status',
      dueDate: 'Due date',
      orderedBy: 'Ordered by',
      products: 'Products',
      actions: 'Actions',
      search: 'Search',
      searchPlaceholder: 'Enter order ID...',
      clear: 'Clear',
      approve: 'Approve',
      reject: 'Reject',
      complete: 'Complete',
      viewHistory: 'History',
      noData: 'No data to display.',
      next: 'Next',
      previous: 'Previous',
      page: 'Page',
      of: 'of',
      completed: 'Completed',
      inProgress: 'In progress',
      pending: 'Pending',
      rejected: 'Rejected',
      unknownStatus: 'Unknown status',
      approvedSuccess: 'Order has been approved.',
      rejectedSuccess: 'Order has been rejected.',
      completedSuccess: 'Order has been completed.',
      statusUpdateError: 'Failed to update order status.',
    },
  };

  const t = translations[language] || translations.pl;

  const fetchOrders = useCallback(async (page = 1) => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(`/api/orders?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const basicOrders = response.data.results || [];

      const ordersWithProducts = await Promise.all(
        basicOrders.map(async (order) => {
          try {
            const detailsResponse = await axios.get(`/api/orders/${order.order_id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            return {
              ...order,
              products: detailsResponse.data.products || [],
            };
          } catch (err) {
            return {
              ...order,
              products: [],
            };
          }
        })
      );

      setOrders(ordersWithProducts);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      setOrders([]);
      setTotalPages(1);
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

      setOrders([
        {
          ...response.data,
          products: response.data.products || [],
        },
      ]);
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

  const refreshOrdersAfterStatusChange = () => {
    if (isSearching && searchId.trim()) {
      handleSearchById();
    } else {
      fetchOrders(currentPage);
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    const token = localStorage.getItem('token');

    try {
      await axios.put(
        `/api/orders/${orderId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (status === 'w trakcie') {
        toast.success(t.approvedSuccess);
      } else if (status === 'odrzucone') {
        toast.success(t.rejectedSuccess);
      } else if (status === 'zrealizowane') {
        toast.success(t.completedSuccess);
      }

      refreshOrdersAfterStatusChange();
    } catch (err) {
      toast.error(err.response?.data?.message || t.statusUpdateError);
    }
  };

  const handleViewHistory = (orderId) => {
    window.location.href = `/order-history/${orderId}`;
  };

  const normalizeStatus = (status) => {
    return String(status || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };

  const isPendingStatus = (status) => {
    return ['oczekuje', 'oczekujace', 'pending'].includes(normalizeStatus(status));
  };

  const isInProgressStatus = (status) => {
    return normalizeStatus(status) === 'w trakcie';
  };

  const getStatusLabel = (status) => {
    const normalizedStatus = normalizeStatus(status);

    if (normalizedStatus === 'zrealizowane') return t.completed;
    if (normalizedStatus === 'w trakcie') return t.inProgress;
    if (['oczekuje', 'oczekujace', 'pending'].includes(normalizedStatus)) return t.pending;
    if (['odrzucone', 'rejected'].includes(normalizedStatus)) return t.rejected;

    return status || t.unknownStatus;
  };

  const getStatusClassName = (status) => {
    const normalizedStatus = normalizeStatus(status);

    if (normalizedStatus === 'zrealizowane') {
      return 'inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700';
    }

    if (normalizedStatus === 'w trakcie') {
      return 'inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700';
    }

    if (['oczekuje', 'oczekujace', 'pending'].includes(normalizedStatus)) {
      return 'inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700';
    }

    if (['odrzucone', 'rejected'].includes(normalizedStatus)) {
      return 'inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700';
    }

    return 'inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700';
  };

  const canManageOrders = userRole === 'admin' || userRole === 'managing director';

  return (
    <div className="app-shell">
      <Navbar
        userData={userRole ? { role: userRole } : null}
        language={language}
        toggleLanguage={toggleLanguage}
        theme={theme}
        toggleTheme={toggleTheme}
        links={[]}
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

              <button
                type="button"
                onClick={handleSearchById}
                className="btn-primary"
              >
                {t.search}
              </button>

              {isSearching && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="btn-muted"
                >
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
                      <th>{t.products}</th>
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
                          {order.products && order.products.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {order.products.map((product) => (
                                <span
                                  key={`${order.order_id}-${product.product_id}`}
                                  className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                                >
                                  {product.product_name}: {product.quantity}
                                </span>
                              ))}
                            </div>
                          ) : (
                            '-'
                          )}
                        </td>

                        <td>
                          <div className="flex flex-wrap gap-2">
                            {canManageOrders && isPendingStatus(order.status) && (
                              <>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdateStatus(order.order_id, 'w trakcie')
                                  }
                                  className="btn-success"
                                >
                                  {t.approve}
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdateStatus(order.order_id, 'odrzucone')
                                  }
                                  className="btn-danger"
                                >
                                  {t.reject}
                                </button>
                              </>
                            )}

                            {canManageOrders && isInProgressStatus(order.status) && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateStatus(order.order_id, 'zrealizowane')
                                }
                                className="btn-primary"
                              >
                                {t.complete}
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleViewHistory(order.order_id)}
                              className="btn-muted"
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
                    type="button"
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
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
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