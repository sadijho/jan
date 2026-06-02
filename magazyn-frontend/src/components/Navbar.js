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
    if (userData?.role === 'admin') navigate('/dashboard');
    else if (userData?.role === 'managing director') navigate('/dashboard-md');
    else if (userData?.role === 'worker') navigate('/dashboard-worker');
    else navigate('/');
  };

  return (
    <nav className="fixed top-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl -translate-x-1/2 rounded-2xl border border-white/60 bg-white/85 px-5 py-3 shadow-xl backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-3"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md">
            <img
              src="/assets/logo.png"
              alt="Magazyn Logo"
              className="h-8 w-8 object-contain"
            />
          </span>

          {userData && (
            <span className="text-left">
              <span className="block text-sm font-bold text-slate-800">
                {userData.firstName} {userData.lastName}
              </span>

              <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                {t(`roles.${userData.role}`)}
              </span>
            </span>
          )}
        </button>

        <div className="flex flex-wrap items-center justify-end gap-2">
          {links.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className="btn-primary"
            >
              {link.label}
            </button>
          ))}

          <button
            onClick={toggleLanguage}
            className="btn-muted"
          >
            {language === 'pl' ? 'EN' : 'PL'}
          </button>

          <button
            onClick={handleLogout}
            className="btn-danger"
          >
            {t('common.logout')}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;