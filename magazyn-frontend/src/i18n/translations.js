const translations = {
  pl: {
    common: {
      logout: 'Wyloguj się',
      users: 'Użytkownicy',
      orders: 'Zamówienia',
      myOrders: 'Moje zamówienia',
      allOrders: 'Wszystkie zamówienia',
      locations: 'Lokalizacje',
      products: 'Produkty',
      statuses: 'Statusy',
      placeOrder: 'Złóż zamówienie',
      noData: 'Brak danych do wyświetlenia.',
      next: 'Dalej',
      previous: 'Wstecz',
    },
    roles: {
      admin: 'Admin',
      'managing director': 'Managing Director',
      worker: 'Worker',
    },
    table: {
      orderId: 'ID zamówienia',
      products: 'Produkty',
    },
  },

  en: {
    common: {
      logout: 'Log out',
      users: 'Users',
      orders: 'Orders',
      myOrders: 'My Orders',
      allOrders: 'All Orders',
      locations: 'Locations',
      products: 'Products',
      statuses: 'Statuses',
      placeOrder: 'Place Order',
      noData: 'No data to display.',
      next: 'Next',
      previous: 'Previous',
    },
    roles: {
      admin: 'Admin',
      'managing director': 'Managing Director',
      worker: 'Worker',
    },
    table: {
      orderId: 'Order ID',
      products: 'Products',
    },
  },
};

export const translate = (language, key) => {
  const selectedLanguage = translations[language] || translations.pl;

  return (
    key.split('.').reduce((value, part) => value?.[part], selectedLanguage) ||
    key.split('.').reduce((value, part) => value?.[part], translations.pl) ||
    key
  );
};

export default translations;