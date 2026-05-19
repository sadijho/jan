const i18n = require('../config/i18n');

const i18nMiddleware = (req, res, next) => {
  const lang = req.headers['accept-language']; 
  if (lang) {
    i18n.setLocale(req, lang.split(',')[0]); 
  }
  next();
};

module.exports = i18nMiddleware;
