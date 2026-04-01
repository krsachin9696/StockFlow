const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');

const userRepository = new UserRepository();

/**
 * auth middleware — validates Bearer JWT and checks it exists in the
 * user's tokens[] array (supports token invalidation on logout).
 */
const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.replace('Bearer ', '').trim();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check token still exists in user's tokens array
    const user = await userRepository.findByIdWithToken(decoded._id, token);
    if (!user) {
      return res.status(401).json({ error: 'Token has been invalidated. Please log in again.' });
    }

    req.token = token;
    req.user  = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token. Please log in again.' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please log in again.' });
    }
    res.status(500).json({ error: 'Authentication error.' });
  }
};

module.exports = auth;
