import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { translate } from '../i18n/translations';

const AddProduct = ({ language }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: '',
    status: '',
    locationId: '',
  });

  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();
  const t = (key) => translate(language, key);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await axios.get('/api/warehouse-locations', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setLocations(response.data);
      } catch (err) {
        console.error('Error fetching locations:', err);
      }
    };

    fetchLocations();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!['wolne', 'zajęte'].includes(formData.status)) {
      toast.error(t('common.statusError'));
      return;
    }

    try {
      const token = localStorage.getItem('token');

      await axios.post('/api/products', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(t('common.productAdded'));
      navigate('/products');
    } catch (err) {
      console.error('Error adding product:', err);
      toast.error(t('common.productAddError'));
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-xl font-bold mb-4">
        {t('common.addProduct')}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md"
      >
        <div className="mb-4">
          <label className="block text-gray-700">
            {t('table.name')}
          </label>

          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              handleInputChange('name', e.target.value)
            }
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">
            {t('table.description')}
          </label>

          <input
            type="text"
            value={formData.description}
            onChange={(e) =>
              handleInputChange('description', e.target.value)
            }
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">
            {t('table.quantity')}
          </label>

          <input
            type="number"
            value={formData.quantity}
            onChange={(e) =>
              handleInputChange('quantity', e.target.value)
            }
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">
            {t('table.status')}
          </label>

          <select
            value={formData.status}
            onChange={(e) =>
              handleInputChange('status', e.target.value)
            }
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value="">
              {t('common.selectStatus')}
            </option>

            <option value="wolne">
              {t('common.available')}
            </option>

            <option value="zajęte">
              {t('common.occupied')}
            </option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">
            {t('common.location')}
          </label>

          <select
            value={formData.locationId}
            onChange={(e) =>
              handleInputChange('locationId', e.target.value)
            }
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value="">
              {t('common.selectLocation')}
            </option>

            {locations.map((location) => (
              <option
                key={location.id}
                value={location.id}
              >
                {location.code}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t('common.submit')}
          </button>

          <button
            type="button"
            onClick={() => navigate('/products')}
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
          >
            {t('common.cancel')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;