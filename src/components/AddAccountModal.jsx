import React, { useState } from 'react';
import { LuUser, LuMail, LuLock, LuX, LuUserPlus } from 'react-icons/lu';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function AddAccountModal({ isOpen, onClose }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        const result = await login(formData.email, formData.password);
        if (result.success) {
          toast.success('Account added successfully!');
          onClose();
          setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
        } else {
          toast.error(result.message);
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          return;
        }
        const result = await register({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password
        });
        if (result.success) {
          toast.success('New account created and added!');
          onClose();
          setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
        } else {
          toast.error(result.message);
        }
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Add Account</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-700"
          >
            <LuX className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => {
                setMode('login');
                resetForm();
              }}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                mode === 'login'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Login Existing
            </button>
            <button
              onClick={() => {
                setMode('signup');
                resetForm();
              }}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                mode === 'signup'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Create New
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <LuUser className="inline w-4 h-4 mr-1" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <LuMail className="inline w-4 h-4 mr-1" />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <LuLock className="inline w-4 h-4 mr-1" />
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <LuLock className="inline w-4 h-4 mr-1" />
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <LuUserPlus className="w-4 h-4" />
                    <span>{mode === 'login' ? 'Add Account' : 'Create Account'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info */}
        <div className="p-6 bg-gray-50 rounded-b-2xl">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {mode === 'login' 
                ? 'Login to an existing account to add it to your account list'
                : 'Create a new account and it will be automatically added to your account list'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddAccountModal;