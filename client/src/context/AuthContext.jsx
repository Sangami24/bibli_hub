import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user on mount
  useEffect(() => {
    const token = localStorage.getItem('biblihub_token');
    const savedUser = localStorage.getItem('biblihub_user');

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('biblihub_token');
        localStorage.removeItem('biblihub_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const data = await authAPI.login({ email, password });
      localStorage.setItem('biblihub_token', data.token);
      localStorage.setItem('biblihub_user', JSON.stringify(data.user));
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (email, password, name) => {
    setError(null);
    try {
      const data = await authAPI.register({ email, password, name });
      localStorage.setItem('biblihub_token', data.token);
      localStorage.setItem('biblihub_user', JSON.stringify(data.user));
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const googleLogin = async (credential) => {
    setError(null);
    try {
      const data = await authAPI.googleLogin(credential);
      localStorage.setItem('biblihub_token', data.token);
      localStorage.setItem('biblihub_user', JSON.stringify(data.user));
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('biblihub_token');
    localStorage.removeItem('biblihub_user');
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('biblihub_user', JSON.stringify(updatedUser));
  };

  const refreshUser = async () => {
    try {
      const data = await authAPI.getMe();
      updateUser(data.user);
      return data.user;
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        googleLogin,
        logout,
        updateUser,
        refreshUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
