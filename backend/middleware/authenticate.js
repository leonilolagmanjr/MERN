// middleware/authenticate.js

const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust with your actual model

const authenticate = (requiredRole = null) => {
  return async (req, res, next) => {
    try {
      const token = req.header('Authorization').replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ msg: 'Not authorized' });
      }

      // Attach user data and role to the request object
      req.user = {
        id: user._id,
        role: user.role,  // Attach the user's role
      };

      // Check if role is required and if the user has the right role
      if (requiredRole && req.user.role !== requiredRole) {
        return res.status(403).json({ msg: 'Access Denied. Admins only.' });
      }

      next();
    } catch (err) {
      res.status(401).json({ msg: 'Authentication Failed' });
    }
  };
};

module.exports = authenticate;
