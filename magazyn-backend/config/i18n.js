const i18n = require('i18n');
const path = require('path');

i18n.configure({
  locales: ['pl', 'en'], 
  directory: path.join(__dirname, '../locales'), 
  defaultLocale: 'pl', 
  queryParameter: 'lang', 
  cookie: 'lang', 
});

module.exports = i18n;
