const BaseRepository = require('./BaseRepository');
const User = require('../models/User');

/**
 * UserRepository - Data access layer for User entities.
 * Extends BaseRepository with user-specific queries (token management).
 */
class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return this.model.findOne({ email: email.toLowerCase().trim() });
  }

  // Used by auth middleware: validates token is still in user's tokens[]
  async findByIdWithToken(id, token) {
    return this.model.findOne({ _id: id, 'tokens.token': token });
  }

  // Logout single device — remove one token
  async removeToken(userId, token) {
    return this.model.findByIdAndUpdate(
      userId,
      { $pull: { tokens: { token } } },
      { new: true }
    );
  }

  // Logout all devices — clear entire tokens array
  async clearAllTokens(userId) {
    return this.model.findByIdAndUpdate(
      userId,
      { $set: { tokens: [] } },
      { new: true }
    );
  }

  async createUser(userData) {
    const user = new this.model(userData);
    await user.save();
    return user;
  }
}

module.exports = UserRepository;
