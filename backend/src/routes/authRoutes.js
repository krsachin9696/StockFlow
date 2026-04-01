const express = require('express');
const authController = require('../controllers/AuthController');
const auth = require('../middleware/auth');

const router = express.Router();

// Public
router.post('/register', authController.register);
router.post('/login',    authController.login);

// Protected (require valid bearer token)
router.post('/logout',     auth, authController.logout);
router.post('/logout-all', auth, authController.logoutAll);
router.get('/profile',     auth, authController.getProfile);

module.exports = router;
