import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { translate } from '../i18n/translations';

const Orders = ({ language, toggleLanguage }) => {
  const [orders, setOrders] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const t = (key) => translate(language, key);
  const links = [];

  useEffect(() => {
    fetchOrders(currentPage);
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

      setOrders([response.data]);
      setTotalPages(1);
    } catch (err) {
      console.error('Error searching order by ID:', err);
      setOrders([]);
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

      toast.success(t('common.orderStatusUpdated'));
      fetchOrders(currentPage);
    } catch (err) {
      console.error('Error updating order status:', err);
      toast.error(t('common.orderStatusUpdateError'));
    }
  };

  const handleViewHistory = (orderId) => {
    navigate(`/order-history/${orderId}`);
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-10 px-6">
      <Navbar
        userData={null}
        language={language}
        toggleLanguage={toggleLanguage}
        links={links}
      />

      <div className="flex justify-between items-center w-full mt-16 mb-4">
        <input
          type="text"
          placeholder={t('common.search')}
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="border px-4 py-2 rounded-lg flex-1"
        />

        <button
          onClick={handleSearchById}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 ml-4"
        >
          {t('common.search')}
        </button>
      </div>

      {orders.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-2 py-2 w-16">
                {t('common.orderId')}
              </th>

              <th className="border border-gray-300 px-4 py-2">
                {t('table.status')}
              </th>

              <th className="border border-gray-300 px-4 py-2">
                {t('common.dueDate')}
              </th>

              <th className="border border-gray-300 px-4 py-2">
                {t('common.orderedBy')}
              </th>

              <th className="border border-gray-300 px-4 py-2">
                {t('table.actions')}
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.order_id}
                className="hover:bg-gray-100"
              >
                <td className="border border-gray-300 px-2 py-2">
                  {order.order_id}
                </td>

                <td className="border border-gray-300 px-4 py-2">
                  {order.status}
                </td>

                <td className="border border-gray-300 px-4 py-2">
                  {new Date(order.due_date).toLocaleDateString()}
                </td>

                <td className="border border-gray-300 px-4 py-2">
                  {order.first_name} {order.last_name}
                </td>

                <td className="border border-gray-300 px-4 py-2">
                  {order.status !== 'zrealizowane' && (
                    <button
                      onClick={() => handleUpdateStatus(order.order_id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mr-2"
                    >
                      {t('common.markAsCompleted')}
                    </button>
                  )}

                  <button
                    onClick={() => handleViewHistory(order.order_id)}
                    className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    {t('common.viewHistory')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500 mt-4">
          {t('common.noData')}
        </p>
      )}

      <div className="flex justify-between mt-4 w-full">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
        >
          {t('common.previous')}
        </button>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
        >
          {t('common.next')}
        </button>
      </div>
    </div>
  );
};

export default Orders;