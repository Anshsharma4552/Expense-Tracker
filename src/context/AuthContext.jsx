import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [currentAccountId, setCurrentAccountId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const savedAccounts = localStorage.getItem('accounts');
    const savedCurrentAccountId = localStorage.getItem('currentAccountId');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    if (savedAccounts) {
      setAccounts(JSON.parse(savedAccounts));
    }
    if (savedCurrentAccountId) {
      setCurrentAccountId(savedCurrentAccountId);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user: userData, token } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      // Add to accounts list if not already present
      const existingAccounts = JSON.parse(localStorage.getItem('accounts') || '[]');
      const accountExists = existingAccounts.find(acc => acc._id === userData._id);
      
      if (!accountExists) {
        const updatedAccounts = [...existingAccounts, userData];
        localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
        setAccounts(updatedAccounts);
      }
      
      localStorage.setItem('currentAccountId', userData._id);
      setCurrentAccountId(userData._id);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { user: newUser, token } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('currentAccountId');
    setUser(null);
    setCurrentAccountId(null);
  };

  const switchAccount = async (accountId) => {
    try {
      const account = accounts.find(acc => acc._id === accountId);
      if (!account) return { success: false, message: 'Account not found' };
      
      // Here you would typically make an API call to get a new token for this account
      // For now, we'll simulate switching by updating the current user
      localStorage.setItem('user', JSON.stringify(account));
      localStorage.setItem('currentAccountId', accountId);
      setUser(account);
      setCurrentAccountId(accountId);
      
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Failed to switch account' };
    }
  };

  const removeAccount = (accountId) => {
    const updatedAccounts = accounts.filter(acc => acc._id !== accountId);
    localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
    setAccounts(updatedAccounts);
    
    if (currentAccountId === accountId && updatedAccounts.length > 0) {
      switchAccount(updatedAccounts[0]._id);
    } else if (updatedAccounts.length === 0) {
      logout();
    }
  };

  const uploadImage = async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await api.post('/auth/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      return { success: true, imageUrl: response.data.imageUrl };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Image upload failed' 
      };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/auth/update-profile', profileData);
      if (response.data.success) {
        const updatedUser = response.data.user;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        return { success: true, user: updatedUser };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Profile update failed' 
      };
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    uploadImage,
    updateProfile,
    switchAccount,
    removeAccount,
    accounts,
    currentAccountId,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};