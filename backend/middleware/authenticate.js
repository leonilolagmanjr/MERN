const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = (requiredRole = null) => {
  return async (req, res, next) => {
    try {
      const token = req.header('Authorization').replace('Bearer ', '');
      console.log('Token:', token); // Debugging log
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      console.log('Authenticated User:', user); // Debugging log

      if (!user) {
        return res.status(401).json({ msg: 'Not authorized' });
      }
      req.user = {
        id: user._id,
        role: user.role,
      };
      if (requiredRole && req.user.role !== requiredRole) {
        return res.status(403).json({ msg: 'Access Denied. Admins only.' });
      }

      next();
    } catch (err) {
      console.error('Authentication Error:', err.message); // Debugging log
      res.status(401).json({ msg: 'Authentication Failed' });
    }
  };
};

module.exports = authenticate;
