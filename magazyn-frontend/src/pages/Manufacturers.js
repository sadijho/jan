import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

const Manufacturers = ({
  language,
  toggleLanguage,
  theme,
  toggleTheme,
}) => {
  const [manufacturers, setManufacturers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    contactEmail: '',
    phone: '',
  });

  const translations = {
    pl: {
      title: 'Producenci',
      subtitle: 'Zarządzanie producentami produktów',
      name: 'Nazwa',
      country: 'Kraj',
      contactEmail: 'E-mail kontaktowy',
      phone: 'Telefon',
      add: 'Dodaj producenta',
      clear: 'Wyczyść',
      delete: 'Usuń',
      noData: 'Brak producentów do wyświetlenia.',
      actions: 'Akcje',
      confirmDelete: 'Czy na pewno chcesz usunąć tego producenta?',
      created: 'Producent został dodany.',
      createError: 'Nie udało się dodać producenta.',
      deleted: 'Producent został usunięty.',
      deleteError: 'Nie udało się usunąć producenta.',
      duplicate: 'Producent o tej nazwie już istnieje.',
    },
    en: {
      title: 'Manufacturers',
      subtitle: 'Product manufacturer management',
      name: 'Name',
      country: 'Country',
      contactEmail: 'Contact email',
      phone: 'Phone',
      add: 'Add manufacturer',
      clear: 'Clear',
      delete: 'Delete',
      noData: 'No manufacturers to display.',
      actions: 'Actions',
      confirmDelete: 'Are you sure you want to delete this manufacturer?',
      created: 'Manufacturer has been added.',
      createError: 'Failed to add manufacturer.',
      deleted: 'Manufacturer has been deleted.',
      deleteError: 'Failed to delete manufacturer.',
      duplicate: 'Manufacturer with this name already exists.',
    },
  };

  const t = translations[language] || translations.pl;

  const fetchManufacturers = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get('/api/manufacturers', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setManufacturers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setManufacturers([]);
    }
  };

  useEffect(() => {
    fetchManufacturers();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClearForm = () => {
    setFormData({
      name: '',
      country: '',
      contactEmail: '',
      phone: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    try {
      await axios.post('/api/manufacturers', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(t.created);
      handleClearForm();
      fetchManufacturers();
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error(t.duplicate);
        return;
      }

      toast.error(t.createError);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(t.confirmDelete);
    if (!confirmDelete) return;

    const token = localStorage.getItem('token');

    try {
      await axios.delete(`/api/manufacturers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(t.deleted);
      fetchManufacturers();
    } catch (err) {
      toast.error(t.deleteError);
    }
  };

  return (
    <div className="app-shell">
      <Navbar
        userData={null}
        language={language}
        toggleLanguage={toggleLanguage}
        theme={theme}
        toggleTheme={toggleTheme}
        links={[]}
      />

      <main className="page-content">
        <section className="page-card">
          <div className="toolbar">
            <div>
              <h1 className="page-title mb-1">{t.title}</h1>
              <p className="text-sm text-slate-500">{t.subtitle}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="form-label">{t.name}</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div>
              <label className="form-label">{t.country}</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">{t.contactEmail}</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">{t.phone}</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="md:col-span-2 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={handleClearForm}
                className="btn-muted"
              >
                {t.clear}
              </button>

              <button type="submit" className="btn-success">
                {t.add}
              </button>
            </div>
          </form>

          <div className="mt-8">
            {manufacturers.length > 0 ? (
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>{t.name}</th>
                      <th>{t.country}</th>
                      <th>{t.contactEmail}</th>
                      <th>{t.phone}</th>
                      <th>{t.actions}</th>
                    </tr>
                  </thead>

                  <tbody>
                    {manufacturers.map((manufacturer) => (
                      <tr key={manufacturer.id}>
                        <td>#{manufacturer.id}</td>
                        <td>{manufacturer.name}</td>
                        <td>{manufacturer.country || '-'}</td>
                        <td>{manufacturer.contact_email || '-'}</td>
                        <td>{manufacturer.phone || '-'}</td>
                        <td>
                          <button
                            onClick={() => handleDelete(manufacturer.id)}
                            className="btn-danger"
                          >
                            {t.delete}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">{t.noData}</div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Manufacturers;