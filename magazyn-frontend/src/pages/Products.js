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
      const response = await axios.get(`/api/products?page=${page}&limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(response.data.results);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(t('common.confirmDeleteProduct'));

    if (!confirmDelete) return;

    const token = localStorage.getItem('token');

    try {
      await axios.delete(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(t('common.productDeleted'));
      fetchProducts(currentPage);
    } catch (err) {
      console.error('Error deleting product:', err);
      toast.error(t('common.productDeleteError'));
    }
  };

  const handleUpdate = (id) => {
    navigate(`/products/update/${id}`);
  };

  return (
    <div className="app-shell">
      <Navbar
        userData={null}
        language={language}
        toggleLanguage={toggleLanguage}
        links={links}
      />

      <main className="page-content">
        <div className="page-card">
          <div className="toolbar">
            <div>
              <h1 className="page-title mb-1">
                {t('common.products')}
              </h1>
              <p className="text-sm text-slate-500">
                {t('common.products')}
              </p>
            </div>
          </div>

          {products.length > 0 ? (
            <>
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{t('table.id')}</th>
                      <th>{t('table.name')}</th>
                      <th>{t('table.description')}</th>
                      <th>{t('table.quantity')}</th>
                      <th>{t('table.status')}</th>
                      <th>{t('table.actions')}</th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="font-semibold text-slate-900">
                          #{product.id}
                        </td>

                        <td>{product.name}</td>
                        <td>{product.description}</td>

                        <td>
                          <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                            {product.quantity}
                          </span>
                        </td>

                        <td>
                          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                            {product.status}
                          </span>
                        </td>

                        <td>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handleUpdate(product.id)}
                              className="btn-primary"
                            >
                              {t('common.update')}
                            </button>

                            <button
                              onClick={() => handleDelete(product.id)}
                              className="btn-danger"
                            >
                              {t('common.delete')}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

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
            </>
          ) : (
            <div className="empty-state">
              {t('common.noData')}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Products;