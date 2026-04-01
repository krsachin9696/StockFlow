import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

/**
 * AuthProvider — Context provider encapsulating auth state and actions.
 * Persists token and user to localStorage for page refresh resilience.
 */
export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [token,   setToken]   = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('sf_token');
    const storedUser  = localStorage.getItem('sf_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      try { setUser(JSON.parse(storedUser)); } catch (_) {}
    }
    setLoading(false);
  }, []);

  const _persist = (u, t) => {
    setUser(u); setToken(t);
    localStorage.setItem('sf_token', t);
    localStorage.setItem('sf_user', JSON.stringify(u));
  };

  const _clear = () => {
    setUser(null); setToken(null);
    localStorage.removeItem('sf_token');
    localStorage.removeItem('sf_user');
  };

  const login = useCallback(async (email, password) => {
    const data = await authApi.login(email, password);
    _persist(data.user, data.token);
    return data;
  }, []);

  const register = useCallback(async (fields) => {
    const data = await authApi.register(fields);
    _persist(data.user, data.token);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try { if (token) await authApi.logout(token); } catch (_) {}
    _clear();
  }, [token]);

  const logoutAll = useCallback(async () => {
    try { if (token) await authApi.logoutAll(token); } catch (_) {}
    _clear();
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, logoutAll }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for consuming auth context
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
