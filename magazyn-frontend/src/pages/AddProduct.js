import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProduct = ({ language, toggleLanguage }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: '',
    status: '',
    locationId: '',
  });
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();

  const translations = {
    pl: {
      addProduct: 'Dodaj produkt',
      name: 'Nazwa',
      description: 'Opis',
      quantity: 'Ilość',
      status: 'Status',
      location: 'Lokalizacja',
      submit: 'Zapisz',
      cancel: 'Anuluj',
      logout: 'Wyloguj się',
      selectStatus: 'Wybierz status',
      selectLocation: 'Wybierz lokalizację',
      available: 'Wolne',
      occupied: 'Zajęte',
      statusError: 'Status może być tylko "wolne" lub "zajęte".',
      success: 'Produkt dodany pomyślnie!',
      error: 'Nie udało się dodać produktu.',
    },
    en: {
      addProduct: 'Add product',
      name: 'Name',
      description: 'Description',
      quantity: 'Quantity',
      status: 'Status',
      location: 'Location',
      submit: 'Save',
      cancel: 'Cancel',
      logout: 'Log out',
      selectStatus: 'Select status',
      selectLocation: 'Select location',
      available: 'Available',
      occupied: 'Occupied',
      statusError: 'Status must be either "available" or "occupied".',
      success: 'Product added successfully!',
      error: 'Failed to add product.',
    },
  };

  const t = translations[language] || translations.pl;

  useEffect(() => {
    const fetchLocations = async () => {
      const token = localStorage.getItem('token');

      try {
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

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!['wolne', 'zajęte'].includes(formData.status)) {
      alert(t.statusError);
      return;
    }

    const token = localStorage.getItem('token');

    try {
      await axios.post('/api/products', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(t.success);
      navigate('/products');
    } catch (err) {
      alert(t.error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="app-shell">
      <nav className="bg-beige-200 shadow px-6 py-4 flex justify-between items-center fixed top-0 left-0 w-full z-10">
        <div className="flex items-center gap-4">
          <img
            src="/assets/logo.png"
            alt="Magazyn Logo"
            className="w-10 h-10 cursor-pointer"
            onClick={() => navigate('/products')}
          />
          <h1 className="text-lg font-bold text-gray-800">{t.addProduct}</h1>
        </div>

        <div className="flex items-center gap-4">
          <button className="btn-muted" onClick={toggleLanguage}>
            {language === 'pl' ? 'EN' : 'PL'}
          </button>
          <button onClick={handleLogout} className="btn-danger">
            {t.logout}
          </button>
        </div>
      </nav>

      <main className="page-content">
        <section className="page-card max-w-2xl mx-auto">
          <div className="toolbar">
            <h2 className="page-title">{t.addProduct}</h2>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              <label className="form-label">{t.description}</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="form-input min-h-[110px]"
              />
            </div>

            <div>
              <label className="form-label">{t.quantity}</label>
              <input
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div>
              <label className="form-label">{t.status}</label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="form-input"
                required
              >
                <option value="">{t.selectStatus}</option>
                <option value="wolne">{t.available}</option>
                <option value="zajęte">{t.occupied}</option>
              </select>
            </div>

            <div>
              <label className="form-label">{t.location}</label>
              <select
                value={formData.locationId}
                onChange={(e) => handleInputChange('locationId', e.target.value)}
                className="form-input"
                required
              >
                <option value="">{t.selectLocation}</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.code}
                  </option>
                ))}
              </select>
            </div>

            <div className="toolbar mt-4">
              <button
                type="button"
                onClick={() => navigate('/products')}
                className="btn-muted"
              >
                {t.cancel}
              </button>

              <button type="submit" className="btn-success">
                {t.submit}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default AddProduct;