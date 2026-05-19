import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Orders = ({ language, toggleLanguage }) => {
  const [orders, setOrders] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  const translations = {
    pl: {
      orders: 'Zamówienia',
      orderId: 'ID Zamówienia',
      status: 'Status',
      dueDate: 'Termin realizacji',
      orderedBy: 'Złożone przez',
      search: 'Szukaj',
      update: 'Zmień status na zrealizowane',
      viewHistory: 'Pokaż historię',
      logout: 'Wyloguj się',
      noData: 'Brak danych do wyświetlenia.',
      next: 'Dalej',
      previous: 'Wstecz',
    },
    en: {
      orders: 'Orders',
      orderId: 'Order ID',
      status: 'Status',
      dueDate: 'Due Date',
      orderedBy: 'Ordered By',
      search: 'Search',
      update: 'Mark as Completed',
      viewHistory: 'View History',
      logout: 'Log out',
      noData: 'No data to display.',
      next: 'Next',
      previous: 'Previous',
    },
  };

  const t = translations[language];

  useEffect(() => {
    fetchOrders(currentPage);
    fetchUserRole();
  }, [currentPage]);

  const fetchOrders = async (page) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`/api/orders?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data.results);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error('Error fetching orders:', err);
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
      console.error('Error fetching user role:', err);
    }
  };

  const handleSearchById = async () => {
    if (!searchId.trim()) {
      fetchOrders(currentPage);
      return;
    }
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`/api/orders/${searchId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders([response.data]); // Wyświetl jedno zamówienie
      setTotalPages(1); // Ukryj paginację
    } catch (err) {
      console.error('Error searching order by ID:', err);
      setOrders([]); // Resetuj listę w przypadku błędu
    }
  };

  const handleUpdateStatus = async (orderId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `/api/orders/${orderId}`,
        { status: 'zrealizowane' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(language === 'pl' ? 'Status zamówienia został zaktualizowany!' : 'Order status updated!');
      fetchOrders(currentPage); // Odśwież dane po aktualizacji statusu
    } catch (err) {
      console.error('Error updating order status:', err);
      alert(language === 'pl' ? 'Nie udało się zaktualizować statusu zamówienia.' : 'Failed to update order status.');
    }
  };

  const handleViewHistory = (orderId) => {
    navigate(`/order-history/${orderId}`);
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
          <h1 className="text-lg font-bold">{t.orders}</h1>
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

      {/* Search */}
      <div className="flex justify-between items-center w-full mt-16 mb-4">
        <input
          type="text"
          placeholder={t.search}
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="border px-4 py-2 rounded-lg flex-1"
        />
        <button
          onClick={handleSearchById}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 ml-4"
        >
          {t.search}
        </button>
      </div>

      {/* Orders Table */}
      {orders.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-2 py-2 w-16">{t.orderId}</th>
              <th className="border border-gray-300 px-4 py-2">{t.status}</th>
              <th className="border border-gray-300 px-4 py-2">{t.dueDate}</th>
              <th className="border border-gray-300 px-4 py-2">{t.orderedBy}</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-2 py-2">{order.order_id}</td>
                <td className="border border-gray-300 px-4 py-2">{order.status}</td>
                <td className="border border-gray-300 px-4 py-2">{new Date(order.due_date).toLocaleDateString()}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {order.first_name} {order.last_name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {order.status !== 'zrealizowane' && (
                    <button
                      onClick={() => handleUpdateStatus(order.order_id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mr-2"
                    >
                      {t.update}
                    </button>
                  )}
                  <button
                    onClick={() => handleViewHistory(order.order_id)}
                    className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    {t.viewHistory}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500 mt-4">{t.noData}</p>
      )}

      {/* Pagination */}
      <div className="flex justify-between mt-4 w-full">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
        >
          {t.previous}
        </button>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
        >
          {t.next}
        </button>
      </div>
    </div>
  );
};

export default Orders;
