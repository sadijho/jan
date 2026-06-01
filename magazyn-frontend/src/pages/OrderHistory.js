import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { translate } from '../i18n/translations';

const OrderHistory = ({ language, toggleLanguage }) => {
  const [history, setHistory] = useState([]);
  const { orderId } = useParams();
  const navigate = useNavigate();

  const t = (key) => translate(language, key);
  const links = [];

  const fetchOrderHistory = useCallback(async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(`/api/order-history/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setHistory(response.data);
    } catch (err) {
      console.error('Error fetching order history:', err);
      setHistory([]);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrderHistory();
  }, [fetchOrderHistory]);

  return (
    <div className="flex flex-col items-center gap-4 mt-10 px-6">
      <Navbar
        userData={null}
        language={language}
        toggleLanguage={toggleLanguage}
        links={links}
      />

      <main className="flex-1 p-6 bg-white shadow-md mt-20">
        <h1 className="text-xl font-bold mb-4">
          {t('common.history')}
        </h1>

        {history.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">
                  {t('common.changeDate')}
                </th>

                <th className="border border-gray-300 px-4 py-2">
                  {t('common.changedBy')}
                </th>
              </tr>
            </thead>

            <tbody>
              {history.map((entry) => (
                <tr
                  key={entry.id}
                  className="hover:bg-gray-100"
                >
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(entry.status_change_date).toLocaleString()}
                  </td>

                  <td className="border border-gray-300 px-4 py-2">
                    {entry.changed_by_username}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">
            {t('common.noData')}
          </p>
        )}

        <button
          onClick={() => navigate('/orders')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {t('common.back')}
        </button>
      </main>
    </div>
  );
};

export default OrderHistory;