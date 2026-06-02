import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const OrderHistory = ({ language, toggleLanguage }) => {
  const [history, setHistory] = useState([]);
  const [userRole, setUserRole] = useState('');
  const { orderId } = useParams();
  const navigate = useNavigate();

  const translations = {
    pl: {
      history: 'Historia zamówienia',
      orderNumber: 'Zamówienie',
      changeDate: 'Data zmiany statusu',
      changedBy: 'Zmienione przez',
      back: 'Wróć',
      logout: 'Wyloguj się',
      noData: 'Brak danych do wyświetlenia.',
      unknownUser: 'Nieznany użytkownik',
    },
    en: {
      history: 'Order history',
      orderNumber: 'Order',
      changeDate: 'Status change date',
      changedBy: 'Changed by',
      back: 'Back',
      logout: 'Log out',
      noData: 'No data to display.',
      unknownUser: 'Unknown user',
    },
  };

  const t = translations[language] || translations.pl;

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

  const fetchOrderHistory = useCallback(async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(`/api/order-history/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setHistory(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setHistory([]);
    }
  }, [orderId]);

  useEffect(() => {
    fetchUserRole();
    fetchOrderHistory();
  }, [fetchUserRole, fetchOrderHistory]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const getDashboardPath = () => {
    if (userRole === 'managing director') return '/dashboard-md';
    if (userRole === 'worker') return '/dashboard-worker';
    return '/dashboard';
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleString();
  };

  return (
    <div className="app-shell">
      <nav className="bg-beige-200 shadow px-6 py-4 flex justify-between items-center fixed top-0 left-0 w-full z-10">
        <div className="flex items-center gap-4">
          <img
            src="/assets/logo.png"
            alt="Magazyn Logo"
            className="w-10 h-10 cursor-pointer"
            onClick={() => navigate(getDashboardPath())}
          />
          <h1 className="text-lg font-bold text-gray-800">{t.history}</h1>
        </div>

        <div className="flex items-center gap-4">
          <button className="btn-muted" onClick={toggleLanguage}>
            {language === 'pl' ? 'EN' : 'PL'}
          </button>
          <button onClick={handleLogout} className="btn-danger">
            {t.logout}
          </button>
        </div>
      </nav>

      <main className="page-content">
        <section className="page-card">
          <div className="toolbar">
            <div>
              <h2 className="page-title">{t.history}</h2>
              <p className="text-sm text-gray-500">
                {t.orderNumber} #{orderId}
              </p>
            </div>

            <button onClick={() => navigate('/orders')} className="btn-muted">
              {t.back}
            </button>
          </div>

          {history.length > 0 ? (
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t.changeDate}</th>
                    <th>{t.changedBy}</th>
                  </tr>
                </thead>

                <tbody>
                  {history.map((entry) => (
                    <tr key={entry.id}>
                      <td>{formatDate(entry.status_change_date)}</td>
                      <td>{entry.changed_by_username || t.unknownUser}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">{t.noData}</div>
          )}
        </section>
      </main>
    </div>
  );
};

export default OrderHistory;