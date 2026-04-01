import axios from 'axios';
import axiosInstance from './axiosInstance';

/**
 * authApi — Repository class for authentication API calls.
 * Follows the Repository Pattern on the frontend.
 */
class AuthApi {
  async register({ firstName, lastName, email, password, confirmPassword }) {
    const { data } = await axiosInstance.post('/auth/register', {
      firstName, lastName, email, password, confirmPassword,
    });
    return data;
  }

  async login(email, password) {
    const { data } = await axiosInstance.post('/auth/login', { email, password });
    return data;
  }

  async logout(token) {
    const { data } = await axiosInstance.post('/auth/logout');
    return data;
  }

  async logoutAll(token) {
    const { data } = await axiosInstance.post('/auth/logout-all');
    return data;
  }

  async getProfile() {
    const { data } = await axiosInstance.get('/auth/profile');
    return data;
  }
}

export const authApi = new AuthApi();
