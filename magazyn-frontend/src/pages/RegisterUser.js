import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { translate } from '../i18n/translations';

const Register = ({ language }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    roleName: 'worker',
    firstName: '',
    lastName: '',
    email: '',
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const t = (key) => translate(language, key);

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const response = await axios.post('/api/users/register', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        setSuccessMessage(t('common.userRegistered'));
        setTimeout(() => navigate('/user-management'), 2000);
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setError(t('common.usernameTaken'));
      } else if (err.response?.status === 400) {
        setError(err.response.data.message || t('common.registrationError'));
      } else {
        setError(t('common.registrationError'));
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {t('common.registerUser')}
        </h2>

        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-gray-700">
              {t('common.username')}
            </label>

            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className="border rounded-lg w-full p-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">
              {t('common.password')}
            </label>

            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="border rounded-lg w-full p-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">
              {t('common.roleName')}
            </label>

            <select
              value={formData.roleName}
              onChange={(e) => handleInputChange('roleName', e.target.value)}
              className="border rounded-lg w-full p-2"
            >
              <option value="worker">Worker</option>
              <option value="managing director">Managing Director</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">
              {t('common.firstName')}
            </label>

            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="border rounded-lg w-full p-2"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">
              {t('common.lastName')}
            </label>

            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="border rounded-lg w-full p-2"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">
              {t('common.email')}
            </label>

            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="border rounded-lg w-full p-2"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4">
              {error}
            </p>
          )}

          {successMessage && (
            <p className="text-green-500 text-sm mb-4">
              {successMessage}
            </p>
          )}

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate('/user-management')}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              {t('common.cancel')}
            </button>

            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              {t('common.registerUser')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;