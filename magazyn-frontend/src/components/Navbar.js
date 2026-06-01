import React from 'react';
import { useNavigate } from 'react-router-dom';
import { translate } from '../i18n/translations';

const Navbar = ({
  userData,
  language,
  toggleLanguage,
  links = [],
}) => {
  const navigate = useNavigate();
  const t = (key) => translate(language, key);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleLogoClick = () => {
    if (userData?.role === 'admin') {
      navigate('/dashboard');
    } else if (userData?.role === 'managing director') {
      navigate('/dashboard-md');
    } else if (userData?.role === 'worker') {
      navigate('/dashboard-worker');
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center fixed top-0 left-0 w-full z-10 border-b">
      <div className="flex items-center gap-4">
        <img
          src="/assets/logo.png"
          alt="Magazyn Logo"
          className="w-10 h-10 cursor-pointer"
          onClick={handleLogoClick}
        />

        {userData && (
          <div>
            <h1 className="text-lg font-bold text-gray-800">
              {userData.firstName} {userData.lastName}
            </h1>

            <p className="text-sm text-gray-500 capitalize">
              {t(`roles.${userData.role}`)}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {links.map((link) => (
          <button
            key={link.path}
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
          {t('common.logout')}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;