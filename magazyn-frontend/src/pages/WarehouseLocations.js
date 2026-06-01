import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { translate } from '../i18n/translations';

const WarehouseLocations = ({ language, toggleLanguage }) => {
  const [locations, setLocations] = useState([]);
  const t = (key) => translate(language, key);
  const links = [];

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await axios.get('/api/warehouse-locations', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setLocations(response.data);
      } catch (err) {
        console.error('Error fetching warehouse locations:', err);
      }
    };

    fetchLocations();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Navbar
        userData={null}
        language={language}
        toggleLanguage={toggleLanguage}
        links={links}
      />

      <main className="flex-1 p-6 bg-white shadow-md mt-20">
        <h2 className="text-xl font-bold mb-4">
          {t('common.warehouseLocations')}
        </h2>

        {locations && locations.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">
                  {t('table.id')}
                </th>

                <th className="border border-gray-300 px-4 py-2">
                  {t('common.code')}
                </th>

                <th className="border border-gray-300 px-4 py-2">
                  {t('table.description')}
                </th>
              </tr>
            </thead>

            <tbody>
              {locations.map((location, index) => (
                <tr
                  key={location.id}
                  className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}
                >
                  <td className="border border-gray-300 px-4 py-2">
                    {location.id}
                  </td>

                  <td className="border border-gray-300 px-4 py-2">
                    {location.code}
                  </td>

                  <td className="border border-gray-300 px-4 py-2">
                    {location.description}
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
      </main>
    </div>
  );
};

export default WarehouseLocations;