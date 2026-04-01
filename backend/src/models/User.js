const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * UserModel - OOP class that builds the User Mongoose schema.
 * Encapsulates schema definition, instance methods, and lifecycle hooks.
 */
class UserModel {
  constructor() {
    this.schema = new mongoose.Schema(
      {
        firstName: {
          type: String,
          required: [true, 'First name is required'],
          trim: true,
          maxlength: [50, 'First name cannot exceed 50 characters'],
        },
        lastName: {
          type: String,
          required: [true, 'Last name is required'],
          trim: true,
          maxlength: [50, 'Last name cannot exceed 50 characters'],
        },
        email: {
          type: String,
          required: [true, 'Email is required'],
          unique: true,
          lowercase: true,
          trim: true,
          match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
        },
        password: {
          type: String,
          required: [true, 'Password is required'],
          minlength: [6, 'Password must be at least 6 characters'],
        },
        // Array of active tokens — supports per-device logout and logout-all
        tokens: [{ token: { type: String, required: true } }],
      },
      { timestamps: true }
    );

    this._addInstanceMethods();
    this._addPreSaveHook();
  }

  _addInstanceMethods() {
    // Generate JWT and persist it in the tokens array
    this.schema.methods.generateAuthToken = async function () {
      const token = jwt.sign(
        { _id: this._id.toString() },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      this.tokens = this.tokens.concat({ token });
      await this.save();
      return token;
    };

    // Compare plaintext password with stored hash
    this.schema.methods.comparePassword = async function (plain) {
      return bcrypt.compare(plain, this.password);
    };

    // Strip sensitive fields from serialised output
    this.schema.methods.toJSON = function () {
      const obj = this.toObject();
      delete obj.password;
      delete obj.tokens;
      return obj;
    };
  }

  _addPreSaveHook() {
    this.schema.pre('save', async function (next) {
      if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
      }
      next();
    });
  }

  build() {
    return mongoose.model('User', this.schema);
  }
}

const userModel = new UserModel();
module.exports = userModel.build();
