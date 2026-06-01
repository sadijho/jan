import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

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
  const links = [];

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


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Navbar */}
<Navbar
  userData={null}
  language={language}
  toggleLanguage={toggleLanguage}
  links={links}
  dashboardPath="/dashboard-md"
/>

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
