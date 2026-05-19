import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Login from './Login';
import '../styles/Home.css';

const Home = ({ language, toggleLanguage }) => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="bg-cover bg-center h-screen flex flex-col relative" style={{ backgroundImage: `url('/assets/warehouse-background.png')` }}>
      <nav className="flex justify-between items-center bg-white bg-opacity-50 backdrop-blur-md px-4 py-2 fixed top-0 w-full shadow-md">
        <button onClick={() => setShowLogin(false)} className="flex items-center">
          <img
            src="/assets/logo.png"
            alt="Magazyn Logo"
            className="w-10 h-10 object-contain hover:opacity-80 transition-opacity"
          />
        </button>

        <div className="flex items-center gap-3">
          <Link to="/about" className="text-gray-800 hover:text-gray-600 transition font-semibold">
            {language === 'pl' ? 'O NAS' : 'ABOUT US'}
          </Link>
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-lg"
          >
            <img
              src={language === 'pl' ? '/assets/uk-flag.png' : '/assets/pl-flag.png'}
              alt="language"
              className="w-5 h-5"
            />
            <span className="text-sm font-medium">{language === 'pl' ? 'EN' : 'PL'}</span>
          </button>
        </div>
      </nav>

      <div className="flex flex-1 items-center justify-center">
        {!showLogin && (
          <button
            className="flex items-center gap-2 bg-white text-gray-800 px-6 py-3 rounded-lg shadow-md text-lg font-semibold transition-all hover:bg-gray-100"
            onClick={() => setShowLogin(true)}
          >
            {language === 'pl' ? 'Zaloguj się' : 'Log in'}
          </button>
        )}

        {showLogin && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-50 backdrop-blur-md border-4 border-[#d4a276] rounded-lg shadow-lg p-6 w-96">
            <Login language={language} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
