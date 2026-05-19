const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  console.log('Nagłówki żądania:', req.headers); // Logowanie nagłówków
  if (!token) {
    console.log('Brak tokenu w nagłówku.');
    return res.status(401).json({ message: 'Brak tokenu uwierzytelniającego' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token dekodowany w middleware:', decoded); // Logowanie dekodowanego tokena
    req.user = decoded; // Dane użytkownika z tokenu
    next();
  } catch (error) {
    console.error('Błąd weryfikacji tokenu:', error);
    res.status(403).json({ message: 'Nieprawidłowy lub wygasły token' });
  }
};

module.exports = verifyToken;
