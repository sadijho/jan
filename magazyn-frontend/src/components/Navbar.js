import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({
  userData,
  language,
  toggleLanguage,
  links = [],
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center fixed top-0 left-0 w-full z-10 border-b">
      <div className="flex items-center gap-4">
        <img
          src="/assets/logo.png"
          alt="Magazyn Logo"
          className="w-10 h-10 cursor-pointer"
          onClick={() => navigate('/')}
        />

        {userData && (
          <div>
            <h1 className="text-lg font-bold text-gray-800">
              {userData.firstName} {userData.lastName}
            </h1>

            <p className="text-sm text-gray-500 capitalize">
              {userData.role}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {links.map((link, index) => (
          <button
            key={index}
            onClick={() => navigate(link.path)}
            className={`${link.color} px-4 py-2 rounded-lg text-white hover:opacity-90 transition`}
          >
            {link.label}
          </button>
        ))}

        <button
          onClick={toggleLanguage}
          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          {language === 'pl' ? 'EN' : 'PL'}
        </button>

        <button
          onClick={handleLogout}
          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          {language === 'pl' ? 'Wyloguj się' : 'Log out'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;