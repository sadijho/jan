import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { translate } from '../i18n/translations';
const WarehouseLocations = ({
  language,
  toggleLanguage,
  theme,
  toggleTheme,
}) => {
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

        setLocations(response.data || []);
      } catch (err) {
        setLocations([]);
      }
    };

    fetchLocations();
  }, []);

  return (
    <div className="app-shell">
<Navbar
  userData={null}
  language={language}
  toggleLanguage={toggleLanguage}
  theme={theme}
  toggleTheme={toggleTheme}
  links={links}
/>

      <main className="page-content">
        <section className="page-card">
          <div className="toolbar">
            <h2 className="page-title">
              {t('common.warehouseLocations')}
            </h2>
          </div>

          {locations && locations.length > 0 ? (
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t('table.id')}</th>
                    <th>{t('common.code')}</th>
                    <th>{t('table.description')}</th>
                  </tr>
                </thead>

                <tbody>
                  {locations.map((location) => (
                    <tr key={location.id}>
                      <td>#{location.id}</td>
                      <td>{location.code}</td>
                      <td>{location.description || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              {t('common.noData')}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default WarehouseLocations;