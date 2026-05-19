import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const WarehouseLocations = ({ language, toggleLanguage }) => {
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();

  const translations = {
    pl: {
      logout: 'Wyloguj się',
      warehouseLocations: 'Lokalizacje Magazynowe',
      id: 'ID',
      code: 'Kod',
      description: 'Opis',
      noData: 'Brak danych do wyświetlenia.',
    },
    en: {
      logout: 'Log out',
      warehouseLocations: 'Warehouse Locations',
      id: 'ID',
      code: 'Code',
      description: 'Description',
      noData: 'No data to display.',
    },
  };

  const t = translations[language];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    const fetchLocations = async () => {
      try {
        const response = await axios.get('/api/warehouse-locations', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setLocations(response.data); // Zakładamy, że backend zwraca listę lokalizacji.
      } catch (err) {
        console.error('Error fetching warehouse locations:', err);
      }
    };

    fetchLocations();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-beige-200 shadow px-6 py-4 flex justify-between items-center fixed top-0 left-0 w-full z-10">
        <div className="flex items-center gap-4">
          <img
            src="/assets/logo.png"
            alt="Magazyn Logo"
            className="w-10 h-10 cursor-pointer"
            onClick={() => navigate('/dashboard-md')}
          />
          <h1 className="text-lg font-bold text-gray-800">{t.warehouseLocations}</h1>
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

      {/* Content */}
      <main className="flex-1 p-6 bg-white shadow-md mt-20">
        <h2 className="text-xl font-bold mb-4">{t.warehouseLocations}</h2>
        {locations && locations.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">{t.id}</th>
                <th className="border border-gray-300 px-4 py-2">{t.code}</th>
                <th className="border border-gray-300 px-4 py-2">{t.description}</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((location, index) => (
                <tr
                  key={location.id}
                  className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}
                >
                  <td className="border border-gray-300 px-4 py-2">{location.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{location.code}</td>
                  <td className="border border-gray-300 px-4 py-2">{location.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">{t.noData}</p>
        )}
      </main>
    </div>
  );
};

export default WarehouseLocations;
