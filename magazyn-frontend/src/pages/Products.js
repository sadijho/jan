import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { translate } from '../i18n/translations';

const Products = ({ language, toggleLanguage }) => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const t = (key) => translate(language, key);

  const links = [
    {
      label: t('common.addProduct'),
      path: '/products/add',
      color: 'bg-green-500',
    },
  ];

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const fetchProducts = async (page) => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(
        `/api/products?page=${page}&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts(response.data.results);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      t('common.confirmDeleteProduct')
    );

    if (!confirmDelete) return;

    const token = localStorage.getItem('token');

    try {
      await axios.delete(`/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(
        t('common.productDeleted')
      );

      fetchProducts(currentPage);
    } catch (err) {
      console.error('Error deleting product:', err);

      toast.error(
        t('common.productDeleteError')
      );
    }
  };

  const handleUpdate = (id) => {
    navigate(`/products/update/${id}`);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Navbar
        userData={null}
        language={language}
        toggleLanguage={toggleLanguage}
        links={links}
      />

      <main className="flex-1 p-6 bg-white shadow-md mt-20">
        {products.length > 0 ? (
          <>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">
                    {t('table.id')}
                  </th>

                  <th className="border border-gray-300 px-4 py-2">
                    {t('table.name')}
                  </th>

                  <th className="border border-gray-300 px-4 py-2">
                    {t('table.description')}
                  </th>

                  <th className="border border-gray-300 px-4 py-2">
                    {t('table.quantity')}
                  </th>

                  <th className="border border-gray-300 px-4 py-2">
                    {t('table.status')}
                  </th>

                  <th className="border border-gray-300 px-4 py-2">
                    {t('table.actions')}
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-100"
                  >
                    <td className="border border-gray-300 px-4 py-2">
                      {product.id}
                    </td>

                    <td className="border border-gray-300 px-4 py-2">
                      {product.name}
                    </td>

                    <td className="border border-gray-300 px-4 py-2">
                      {product.description}
                    </td>

                    <td className="border border-gray-300 px-4 py-2">
                      {product.quantity}
                    </td>

                    <td className="border border-gray-300 px-4 py-2">
                      {product.status}
                    </td>

                    <td className="border border-gray-300 px-4 py-2 flex gap-2">
                      <button
                        onClick={() => handleUpdate(product.id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        {t('common.update')}
                      </button>

                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        {t('common.delete')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between mt-4">
              <button
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((prev) => prev - 1)
                }
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
                onClick={() =>
                  setCurrentPage((prev) => prev + 1)
                }
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

export default Products;