import React, { useState } from 'react';
import { LuUser, LuMail, LuLock, LuX, LuUserPlus } from 'react-icons/lu';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function AddAccountModal({ isOpen, onClose }) {
  const { login, register, switchAccount, currentAccountId } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [loading, setLoading] = useState(false);
  const [showSwitchConfirm, setShowSwitchConfirm] = useState(false);
  const [newAccountData, setNewAccountData] = useState(null);
  const [previousAccountId, setPreviousAccountId] = useState(null);
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
          setPreviousAccountId(currentAccountId);
          setNewAccountData({ name: formData.email, id: result.user?.id });
          setShowSwitchConfirm(true);
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
          setPreviousAccountId(currentAccountId);
          setNewAccountData({ name: formData.fullName, id: result.user?.id });
          setShowSwitchConfirm(true);
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

  const handleSwitchToNew = () => {
    toast.success(`Switched to ${newAccountData.name}`);
    setShowSwitchConfirm(false);
    onClose();
    setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
  };

  const handleStayWithCurrent = () => {
    if (previousAccountId) {
      switchAccount(previousAccountId);
      toast.success('Staying with previous account');
    }
    setShowSwitchConfirm(false);
    onClose();
    setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl" style={{backgroundColor: '#EEEEEE'}}>
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b" style={{borderColor: '#CBCBCB'}}>
          <h2 className="text-xl font-bold" style={{color: '#777C6D'}}>Add Account</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full transition-colors"
            style={{color: '#777C6D'}}
          >
            <LuX className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="p-6 border-b" style={{borderColor: '#CBCBCB'}}>
          <div className="flex rounded-lg p-1" style={{backgroundColor: '#CBCBCB'}}>
            <button
              onClick={() => {
                setMode('login');
                resetForm();
              }}
              className="flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200"
              style={mode === 'login' ? {backgroundColor: '#777C6D', color: '#EEEEEE'} : {color: '#777C6D'}}
            >
              Login Existing
            </button>
            <button
              onClick={() => {
                setMode('signup');
                resetForm();
              }}
              className="flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200"
              style={mode === 'signup' ? {backgroundColor: '#777C6D', color: '#EEEEEE'} : {color: '#777C6D'}}
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
                <label className="block text-sm font-medium mb-2" style={{color: '#777C6D'}}>
                  <LuUser className="inline w-4 h-4 mr-1" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F', color: '#777C6D'}}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#777C6D'}}>
                <LuMail className="inline w-4 h-4 mr-1" />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F', color: '#777C6D'}}
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#777C6D'}}>
                <LuLock className="inline w-4 h-4 mr-1" />
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F', color: '#777C6D'}}
                placeholder="Enter your password"
                required
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{color: '#777C6D'}}>
                  <LuLock className="inline w-4 h-4 mr-1" />
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F', color: '#777C6D'}}
                  placeholder="Confirm your password"
                  required
                />
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border rounded-lg transition-colors"
                style={{borderColor: '#B7B89F', color: '#777C6D'}}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                style={{backgroundColor: '#777C6D', color: '#EEEEEE'}}
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

        {/* Switch Confirmation */}
        {showSwitchConfirm && (
          <div className="absolute inset-0 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="rounded-xl p-6 m-4 shadow-2xl" style={{backgroundColor: '#EEEEEE'}}>
              <h3 className="text-lg font-bold mb-4" style={{color: '#777C6D'}}>Account Added Successfully!</h3>
              <p className="text-sm mb-6" style={{color: '#777C6D'}}>Would you like to switch to the new account or stay with your current account?</p>
              <div className="flex space-x-3">
                <button
                  onClick={handleStayWithCurrent}
                  className="flex-1 px-4 py-2 border rounded-lg transition-colors"
                  style={{borderColor: '#B7B89F', color: '#777C6D'}}
                >
                  Stay with Current
                </button>
                <button
                  onClick={handleSwitchToNew}
                  className="flex-1 px-4 py-2 rounded-lg transition-colors"
                  style={{backgroundColor: '#777C6D', color: '#EEEEEE'}}
                >
                  Switch to New
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="p-6 rounded-b-2xl" style={{backgroundColor: '#CBCBCB'}}>
          <div className="text-center">
            <p className="text-sm" style={{color: '#777C6D'}}>
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