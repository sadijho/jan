import React from 'react';
import { useNavigate } from 'react-router-dom';
import { translate } from '../i18n/translations';

const Navbar = ({
  userData,
  language,
  toggleLanguage,
  links = [],
  theme = 'light',
  toggleTheme,
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
    <nav className="navbar">
      <div className="flex items-center gap-4">
        <img
          src="/assets/logo.png"
          alt="Magazyn Logo"
          className="w-10 h-10 cursor-pointer"
          onClick={handleLogoClick}
        />

        {userData && (
          <div>
            <h1 className="navbar-user-name">
              {userData.firstName} {userData.lastName}
            </h1>

            <p className="navbar-user-role">
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
          type="button"
          onClick={toggleTheme}
          className="btn-muted"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        <button
          type="button"
          onClick={toggleLanguage}
          className="btn-muted"
        >
          {language === 'pl' ? 'EN' : 'PL'}
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="btn-danger"
        >
          {t('common.logout')}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;