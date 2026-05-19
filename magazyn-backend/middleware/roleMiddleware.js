const verifyRole = (allowedRoles) => {
    return (req, res, next) => {
      const userRole = req.user.role; 
  
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: 'Brak uprawnień do wykonania tej operacji' });
      }
  
      next();
    };
  };
  
  module.exports = verifyRole;
  