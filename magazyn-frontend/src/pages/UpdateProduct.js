import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

const UpdateProduct = ({
  language,
  toggleLanguage,
  theme,
  toggleTheme,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: '',
    status: '',
    locationId: '',
  });

  const translations = {
    pl: {
      title: 'Edycja produktu',
      name: 'Nazwa',
      description: 'Opis',
      quantity: 'Ilość',
      status: 'Status',
      location: 'Lokalizacja',
      save: 'Zapisz',
      cancel: 'Anuluj',
      selectStatus: 'Wybierz status',
      selectLocation: 'Wybierz lokalizację',
      available: 'Wolne',
      occupied: 'Zajęte',
      success: 'Produkt został zaktualizowany.',
      error: 'Nie udało się zaktualizować produktu.',
      loading: 'Ładowanie...',
    },
    en: {
      title: 'Edit product',
      name: 'Name',
      description: 'Description',
      quantity: 'Quantity',
      status: 'Status',
      location: 'Location',
      save: 'Save',
      cancel: 'Cancel',
      selectStatus: 'Select status',
      selectLocation: 'Select location',
      available: 'Available',
      occupied: 'Occupied',
      success: 'Product updated successfully.',
      error: 'Failed to update product.',
      loading: 'Loading...',
    },
  };

  const t = translations[language] || translations.pl;

  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem('token');

      try {
        const [productResponse, locationsResponse] = await Promise.all([
          axios.get(`/api/products/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('/api/warehouse-locations', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const productData = productResponse.data;

        setProduct(productData);

        setFormData({
          name: productData.name || '',
          description: productData.description || '',
          quantity: productData.quantity || '',
          status: productData.status || '',
          locationId: productData.location_id || '',
        });

        setLocations(locationsResponse.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, [id]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    try {
      await axios.put(`/api/products/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(t.success);
      navigate('/products');
    } catch (err) {
      alert(t.error);
    }
  };

  if (!product) {
    return (
      <div className="app-shell">
        <main className="page-content">
          <div className="page-card">
            <div className="empty-state">{t.loading}</div>
          </div>
        </main>
      </div>
    );
  }

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
          <h2 className="page-title">{t.title}</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="form-label">{t.name}</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">{t.description}</label>
              <textarea
                className="form-input min-h-[120px]"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange('description', e.target.value)
                }
              />
            </div>

            <div>
              <label className="form-label">{t.quantity}</label>
              <input
                type="number"
                className="form-input"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">{t.status}</label>
              <select
                className="form-input"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
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
                className="form-input"
                value={formData.locationId}
                onChange={(e) =>
                  handleInputChange('locationId', e.target.value)
                }
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
                className="btn-muted"
                onClick={() => navigate('/products')}
              >
                {t.cancel}
              </button>

              <button type="submit" className="btn-success">
                {t.save}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default UpdateProduct;