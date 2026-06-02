import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { translate } from '../i18n/translations';
import Navbar from '../components/Navbar';

const Register = ({ language, toggleLanguage }) => {
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
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
    <div className="app-shell">
      <Navbar
        userData={null}
        language={language}
        toggleLanguage={toggleLanguage}
        links={[]}
      />

      <main className="page-content">
        <section className="page-card max-w-2xl mx-auto">
          <div className="toolbar">
            <h2 className="page-title">{t('common.registerUser')}</h2>
          </div>

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div>
              <label className="form-label">{t('common.username')}</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div>
              <label className="form-label">{t('common.password')}</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div>
              <label className="form-label">{t('common.roleName')}</label>
              <select
                value={formData.roleName}
                onChange={(e) => handleInputChange('roleName', e.target.value)}
                className="form-input"
              >
                <option value="worker">Worker</option>
                <option value="managing director">Managing Director</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="form-label">{t('common.firstName')}</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">{t('common.lastName')}</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">{t('common.email')}</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="form-input"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                {successMessage}
              </div>
            )}

            <div className="toolbar mt-4">
              <button
                type="button"
                onClick={() => navigate('/user-management')}
                className="btn-muted"
              >
                {t('common.cancel')}
              </button>

              <button type="submit" className="btn-success">
                {t('common.registerUser')}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default Register;