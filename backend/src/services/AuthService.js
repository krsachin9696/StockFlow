const UserRepository = require('../repositories/UserRepository');

/**
 * AuthService - Business logic for authentication.
 * OOP class injecting UserRepository (dependency injection).
 * Handles: register, login, logout (single), logout (all devices).
 */
class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(firstName, lastName, email, password) {
    // Check duplicate email
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new Error('Email is already registered. Please use a different email.');
    }

    // Create user — password hashing handled by the model's pre-save hook
    const user = await this.userRepository.createUser({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      password,
    });

    const token = await user.generateAuthToken();
    return { user, token };
  }

  async login(email, password) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    const token = await user.generateAuthToken();
    return { user, token };
  }

  // Invalidates the current token (single device logout)
  async logout(userId, token) {
    await this.userRepository.removeToken(userId, token);
  }

  // Clears all tokens (logout from every device)
  async logoutAll(userId) {
    await this.userRepository.clearAllTokens(userId);
  }
}

module.exports = AuthService;
