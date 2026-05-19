import React from 'react';
import { useNavigate } from 'react-router-dom';

const About = ({ language, toggleLanguage }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-cover bg-center h-screen flex flex-col relative" style={{ backgroundImage: `url('/assets/warehouse-background.png')` }}>
      {/* Navbar */}
      <nav className="flex justify-between items-center bg-white bg-opacity-50 backdrop-blur-md px-4 py-2 fixed top-0 w-full shadow-md">
        {/* Logo */}
        <button onClick={() => navigate('/')} className="flex items-center">
          <img
            src="/assets/logo.png"
            alt="Magazyn Logo"
            className="w-10 h-10 object-contain hover:opacity-80 transition-opacity"
          />
        </button>

        <div className="flex items-center gap-3">
          {/* "O NAS" */}
          <button className="text-gray-800 hover:text-gray-600 transition font-semibold">
            {language === 'pl' ? 'O NAS' : 'ABOUT US'}
          </button>
          {/* Zmiana języka */}
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

      <div className="flex flex-1 items-center justify-center mt-16">
        <div className="bg-white bg-opacity-50 backdrop-blur-md rounded-lg shadow-lg p-8 w-4/5 max-w-2xl text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {language === 'pl' ? 'O NAS' : 'ABOUT US'}
          </h1>
          <p className="text-gray-800 mb-6">
            {language === 'pl'
              ? 'Nasza aplikacja do zarządzania magazynem to nowoczesne rozwiązanie wspomagające organizację i kontrolę procesów magazynowych. Zapewniamy prostotę obsługi, szybkość działania oraz przejrzystość informacji, aby pomóc w efektywnym zarządzaniu Twoimi zasobami.'
              : 'Our warehouse management application is a modern solution designed to support the organization and control of warehouse processes. We ensure ease of use, speed, and transparency to help you efficiently manage your resources.'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-transparent border-2 border-[#d4a276] text-[#d4a276] rounded-lg hover:bg-[#d4a276] hover:text-white transition-all"
          >
            {language === 'pl' ? 'Powrót na stronę główną' : 'Back to Home'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
