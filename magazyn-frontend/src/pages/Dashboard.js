import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { translate } from '../i18n/translations';

const Dashboard = ({ language, toggleLanguage }) => {
  const [userData, setUserData] = useState(null);
  const [groupedData, setGroupedData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const t = (key) => translate(language, key);

  const links = userData?.role === 'admin'
    ? [
        {
          label: t('common.users'),
          path: '/user-management',
          color: 'bg-blue-500',
        },
      ]
    : [];

  const fetchOrderProducts = async (page) => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.get(`/api/order-products?page=${page}&limit=5`, {
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

      setGroupedData(grouped);
      setTotalPages(totalPages);
    } catch (err) {
      console.error('Error fetching order products:', err);
    }
  };

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
    fetchOrderProducts(currentPage);
  }, [currentPage]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Navbar
        userData={userData}
        language={language}
        toggleLanguage={toggleLanguage}
        links={links}
      />

      <main className="flex-1 p-6 bg-white shadow-md mt-20">
        <h2 className="text-xl font-bold mb-4">
          {t('common.orders')}
        </h2>

        {Object.keys(groupedData).length > 0 ? (
          <>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">
                    {t('table.orderId')}
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    {t('table.products')}
                  </th>
                </tr>
              </thead>

              <tbody>
                {Object.values(groupedData).map((order, index) => (
                  <tr
                    key={order.order_id}
                    className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}
                  >
                    <td className="border border-gray-300 px-4 py-2">
                      {order.order_id}
                    </td>

                    <td className="border border-gray-300 px-4 py-2">
                      <ul>
                        {order.products.map((product, idx) => (
                          <li key={idx} className="mb-2">
                            <span className="font-bold">
                              {product.product_name}
                            </span>
                            : {product.quantity}
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
                {t('common.previous')}
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
                {t('common.next')}
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500">
            {t('common.noData')}
          </p>
        )}
      </main>
    </div>
  );
};

export default Dashboard;