const AuthService = require('../services/AuthService');

/**
 * AuthController - HTTP layer for authentication.
 * OOP class with bound methods for use as Express route handlers.
 */
class AuthController {
  constructor() {
    this.authService = new AuthService();
    this.register   = this.register.bind(this);
    this.login      = this.login.bind(this);
    this.logout     = this.logout.bind(this);
    this.logoutAll  = this.logoutAll.bind(this);
    this.getProfile = this.getProfile.bind(this);
  }

  async register(req, res, next) {
    try {
      const { firstName, lastName, email, password, confirmPassword } = req.body;

      if (!firstName || !lastName || !email || !password || !confirmPassword) {
        return res.status(400).json({ error: 'All fields are required.' });
      }
      if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match.' });
      }
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters.' });
      }

      const { user, token } = await this.authService.register(
        firstName, lastName, email, password
      );
      res.status(201).json({ message: 'Registration successful.', user, token });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({ error: 'Email already registered.' });
      }
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }
      const { user, token } = await this.authService.login(email, password);
      res.json({ message: 'Login successful.', user, token });
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  }

  async logout(req, res, next) {
    try {
      await this.authService.logout(req.user._id, req.token);
      res.json({ message: 'Logged out successfully.' });
    } catch (err) { next(err); }
  }

  async logoutAll(req, res, next) {
    try {
      await this.authService.logoutAll(req.user._id);
      res.json({ message: 'Logged out from all devices successfully.' });
    } catch (err) { next(err); }
  }

  async getProfile(req, res) {
    res.json({ user: req.user });
  }
}

module.exports = new AuthController();
