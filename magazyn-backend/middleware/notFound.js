const notFound = (req, res, next) => {
  const error = new Error(`Nie znaleziono - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = notFound;