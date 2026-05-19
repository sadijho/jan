import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = ({ language, toggleLanguage }) => {
  const [userData, setUserData] = useState(null);
  const [groupedData, setGroupedData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const translations = {
    pl: {
      logout: 'Wyloguj się',
      orders: 'Zamówienia',
      users: 'Użytkownicy',
      noData: 'Brak danych do wyświetlenia.',
      next: 'Dalej',
      previous: 'Wstecz',
    },
    en: {
      logout: 'Log out',
      orders: 'Orders',
      users: 'Users',
      noData: 'No data to display.',
      next: 'Next',
      previous: 'Previous',
    },
  };

  const t = translations[language];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

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
    fetchOrderProducts(currentPage);
  }, [navigate, currentPage]);

  const fetchOrderProducts = async (page) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/order-products?page=${page}&limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { results, totalPages } = response.data;

      // Grupowanie po `order_id`
      const grouped = results.reduce((acc, item) => {
        const { order_id, product_name, quantity } = item;
        if (!acc[order_id]) {
          acc[order_id] = { order_id, products: [] };
        }
        acc[order_id].products.push({ product_name, quantity });
        return acc;
      }, {});

      setGroupedData(grouped);
      setTotalPages(totalPages);
    } catch (err) {
      console.error('Error fetching order products:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-beige-200 shadow px-6 py-4 flex justify-between items-center fixed top-0 left-0 w-full z-10">
        <div className="flex items-center gap-4">
          <img src="/assets/logo.png" alt="Magazyn Logo" className="w-10 h-10" />
          {userData && (
            <div>
              <h1 className="text-lg font-bold text-gray-800">
                {userData.firstName} {userData.lastName}
              </h1>
              <p className="text-sm text-gray-600">{userData.role}</p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          {userData?.role === 'admin' && (
            <button
              onClick={() => navigate('/user-management')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {t.users}
            </button>
          )}
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

      <main className="flex-1 p-6 bg-white shadow-md mt-20">
        <h2 className="text-xl font-bold mb-4">{t.orders}</h2>
        {Object.keys(groupedData).length > 0 ? (
          <>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">Order ID</th>
                  <th className="border border-gray-300 px-4 py-2">Products</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(groupedData).map((order, index) => (
                  <tr
                    key={order.order_id}
                    className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}
                  >
                    <td className="border border-gray-300 px-4 py-2">{order.order_id}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <ul>
                        {order.products.map((product, idx) => (
                          <li key={idx} className="mb-2">
                            <span className="font-bold">{product.product_name}</span>: {product.quantity}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between mt-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === 1
                    ? 'bg-gray-200 text-gray-400'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {t.previous}
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === totalPages
                    ? 'bg-gray-200 text-gray-400'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {t.next}
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500">{t.noData}</p>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
