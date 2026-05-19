import React, { useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const Login = ({ language }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('/api/users/login', { username, password });
      const token = response.data.token;
      localStorage.setItem('token', token);

      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.role;

      if (userRole === 'admin') {
        window.location.href = '/dashboard'; // Dashboard dla admina
      } else if (userRole === 'managing director') {
        window.location.href = '/dashboard-md'; // Dashboard dla managing directora
      } else if (userRole === 'worker') {
        window.location.href = '/dashboard-worker'; // Dashboard dla workera
      } else {
        window.location.href = '/'; 
      }
    } catch (err) {
      setError(language === 'pl' ? 'Nieprawidłowy login lub hasło.' : 'Invalid username or password.');
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-xl font-bold text-gray-900">
        {language === 'pl' ? 'Logowanie' : 'Login'}
      </h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
        <div>
          <label className="block text-gray-800 font-medium mb-2">
            {language === 'pl' ? 'Nazwa użytkownika:' : 'Username:'}
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
            {language === 'pl' ? 'Hasło:' : 'Password:'}
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
          {language === 'pl' ? 'Zaloguj się' : 'Log in'}
        </button>
      </form>
      {error && <p className="text-red-500 font-medium">{error}</p>}
    </div>
  );
};

export default Login;
