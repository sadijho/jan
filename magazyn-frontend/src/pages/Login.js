import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { translate } from '../i18n/translations';

const Login = ({ language }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const t = (key) => translate(language, key);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('/api/users/login', {
        username,
        password,
      });

      const token = response.data.token;
      localStorage.setItem('token', token);

      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.role;

      if (userRole === 'admin') {
        window.location.href = '/dashboard';
      } else if (userRole === 'managing director') {
        window.location.href = '/dashboard-md';
      } else if (userRole === 'worker') {
        window.location.href = '/dashboard-worker';
      } else {
        window.location.href = '/';
      }
    } catch (err) {
      setError(t('common.invalidCredentials'));
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-xl font-bold text-gray-900">
        {t('common.login')}
      </h2>

      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-4 w-full"
      >
        <div>
          <label className="block text-gray-800 font-medium mb-2">
            {t('common.usernameLabel')}
          </label>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 border-2 border-[#d4a276] rounded-md bg-transparent focus:ring-2 focus:ring-[#d4a276] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-800 font-medium mb-2">
            {t('common.passwordLabel')}
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border-2 border-[#d4a276] rounded-md bg-transparent focus:ring-2 focus:ring-[#d4a276] focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-transparent border-2 border-[#d4a276] text-[#d4a276] rounded-lg hover:bg-[#d4a276] hover:text-white transition-all"
        >
          {t('common.loginButton')}
        </button>
      </form>

      {error && (
        <p className="text-red-500 font-medium">
          {error}
        </p>
      )}
    </div>
  );
};

export default Login;