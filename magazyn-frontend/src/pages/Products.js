import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

const Products = ({ language, toggleLanguage }) => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const translations = {
    pl: {
      logout: 'Wyloguj się',
      products: 'Produkty',
      addProduct: 'Dodaj produkt',
      update: 'Aktualizuj',
      delete: 'Usuń',
      noData: 'Brak danych do wyświetlenia.',
      prev: 'Wstecz',
      next: 'Dalej',
    },
    en: {
      logout: 'Log out',
      products: 'Products',
      addProduct: 'Add Product',
      update: 'Update',
      delete: 'Delete',
      noData: 'No data to display.',
      prev: 'Previous',
      next: 'Next',
    },
  };

  const t = translations[language];
  const links = [
  {
    label: t.addProduct,
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
    const confirmDelete = window.confirm(
      language === 'pl'
        ? 'Czy na pewno chcesz usunąć ten produkt?'
        : 'Are you sure you want to delete this product?'
    );
    if (!confirmDelete) return;

    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(language === 'pl' ? 'Produkt został usunięty.' : 'Product deleted successfully.');
      fetchProducts(currentPage);
    } catch (err) {
      console.error('Error deleting product:', err);
      toast.error(language === 'pl' ? 'Nie udało się usunąć produktu.' : 'Failed to delete product.');
    }
  };

  const handleUpdate = (id) => {
    navigate(`/products/update/${id}`);
  };

  const handleAddProduct = () => {
    navigate('/products/add');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar
  userData={null}
  language={language}
  toggleLanguage={toggleLanguage}
  links={links}
/>

      {/* Content */}
      <main className="flex-1 p-6 bg-white shadow-md mt-20">
        {products.length > 0 ? (
          <>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">ID</th>
                  <th className="border border-gray-300 px-4 py-2">Name</th>
                  <th className="border border-gray-300 px-4 py-2">Description</th>
                  <th className="border border-gray-300 px-4 py-2">Quantity</th>
                  <th className="border border-gray-300 px-4 py-2">Status</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">{product.id}</td>
                    <td className="border border-gray-300 px-4 py-2">{product.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{product.description}</td>
                    <td className="border border-gray-300 px-4 py-2">{product.quantity}</td>
                    <td className="border border-gray-300 px-4 py-2">{product.status}</td>
                    <td className="border border-gray-300 px-4 py-2 flex gap-2">
                      <button
                        onClick={() => handleUpdate(product.id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        {t.update}
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        {t.delete}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
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
                {t.prev}
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

export default Products;
