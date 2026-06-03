import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const AddProduct = ({
  language,
  toggleLanguage,
  theme,
  toggleTheme,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: '',
    status: '',
    locationId: '',
    manufacturerId: '',
  });

  const [locations, setLocations] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const navigate = useNavigate();

  const translations = {
    pl: {
      addProduct: 'Dodaj produkt',
      name: 'Nazwa',
      description: 'Opis',
      quantity: 'Ilość',
      status: 'Status',
      location: 'Lokalizacja',
      manufacturer: 'Producent',
      submit: 'Zapisz',
      cancel: 'Anuluj',
      selectStatus: 'Wybierz status',
      selectLocation: 'Wybierz lokalizację',
      selectManufacturer: 'Wybierz producenta',
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
      manufacturer: 'Manufacturer',
      submit: 'Save',
      cancel: 'Cancel',
      selectStatus: 'Select status',
      selectLocation: 'Select location',
      selectManufacturer: 'Select manufacturer',
      available: 'Available',
      occupied: 'Occupied',
      statusError: 'Status must be either "available" or "occupied".',
      success: 'Product added successfully!',
      error: 'Failed to add product.',
    },
  };

  const t = translations[language] || translations.pl;

  useEffect(() => {
    const fetchInitialData = async () => {
      const token = localStorage.getItem('token');

      try {
        const [locationsResponse, manufacturersResponse] = await Promise.all([
          axios.get('/api/warehouse-locations', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('/api/manufacturers', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setLocations(locationsResponse.data || []);
        setManufacturers(manufacturersResponse.data || []);
      } catch (err) {
        setLocations([]);
        setManufacturers([]);
      }
    };

    fetchInitialData();
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

    const payload = {
      ...formData,
      manufacturerId: formData.manufacturerId || null,
    };

    try {
      await axios.post('/api/products', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(t.success);
      navigate('/products');
    } catch (err) {
      alert(t.error);
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

            <div>
              <label className="form-label">{t.manufacturer}</label>
              <select
                value={formData.manufacturerId}
                onChange={(e) => handleInputChange('manufacturerId', e.target.value)}
                className="form-input"
              >
                <option value="">{t.selectManufacturer}</option>
                {manufacturers.map((manufacturer) => (
                  <option key={manufacturer.id} value={manufacturer.id}>
                    {manufacturer.name}
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