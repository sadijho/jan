const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Brak tokenu uwierzytelniającego' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Błąd weryfikacji tokenu:', error);
    res.status(403).json({ message: 'Nieprawidłowy lub wygasły token' });
  }
};
module.exports = verifyToken;
