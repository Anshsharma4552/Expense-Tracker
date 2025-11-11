import React, { useState, useRef, useEffect } from 'react';
import { LuUser, LuMail, LuCamera, LuSettings, LuLogOut, LuUsers, LuPlus, LuTrash2 } from 'react-icons/lu';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AddAccountModal from './AddAccountModal';
import api from '../utils/api';
import toast from 'react-hot-toast';

function ProfileModal({ isOpen, onClose, user }) {
  const { uploadImage, updateProfile, logout, switchAccount, removeAccount, accounts, currentAccountId } = useAuth();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ totalTransactions: 0, totalSavings: 0 });
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || ''
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchUserStats();
      setFormData({
        fullName: user?.fullName || '',
        email: user?.email || ''
      });
    }
  }, [isOpen, user]);

  const fetchUserStats = async () => {
    try {
      const [incomeResponse, expenseResponse] = await Promise.all([
        api.get('/income/get'),
        api.get('/expense/get')
      ]);
      
      const incomes = incomeResponse.data.success ? incomeResponse.data.incomes : [];
      const expenses = expenseResponse.data.success ? expenseResponse.data.expenses : [];
      
      const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
      const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      const totalTransactions = incomes.length + expenses.length;
      const totalSavings = totalIncome - totalExpense;
      
      setStats({ totalTransactions, totalSavings });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  if (!isOpen) return null;

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const uploadResult = await uploadImage(file);
      if (uploadResult.success) {
        // Update profile in database
        const updateResult = await updateProfile({ profileImageUrl: uploadResult.imageUrl });
        if (updateResult.success) {
          toast.success('Profile picture updated successfully!');
        } else {
          toast.error('Failed to save profile picture');
        }
      } else {
        toast.error(uploadResult.message || 'Failed to upload image');
      }
    } catch (error) {
      toast.error('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!formData.fullName.trim()) {
      toast.error('Full name is required');
      return;
    }

    setSaving(true);
    try {
      const result = await updateProfile({ fullName: formData.fullName });
      if (result.success) {
        toast.success('Profile updated successfully!');
        setEditMode(false);
      } else {
        toast.error(result.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" style={{backgroundColor: '#EEEEEE'}}>
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b" style={{borderColor: '#CBCBCB'}}>
          <h2 className="text-xl font-bold" style={{color: '#777C6D'}}>Profile Settings</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full transition-colors"
            style={{color: '#777C6D'}}
          >
            ✕
          </button>
        </div>
        
        {/* Profile Picture Section */}
        <div className="p-6 text-center border-b" style={{borderColor: '#CBCBCB'}}>
          <div className="relative inline-block">
            {user?.profileImageUrl ? (
              <img 
                src={user.profileImageUrl} 
                alt="Profile" 
                className="w-24 h-24 rounded-full object-cover border-4" 
                style={{borderColor: '#B7B89F'}}
              />
            ) : (
              <div className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold" style={{backgroundColor: '#777C6D'}}>
                {user?.fullName?.charAt(0)?.toUpperCase()}
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors disabled:opacity-50"
              style={{backgroundColor: '#777C6D'}}
            >
              {uploading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <LuCamera className="w-4 h-4" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          <p className="text-sm mt-2" style={{color: '#777C6D', opacity: 0.7}}>Click camera icon to change photo</p>
        </div>

        {/* Profile Information */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            <button
              onClick={() => setEditMode(!editMode)}
              className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              <span className="w-4 h-4 flex items-center justify-center text-sm">✏️</span>
              <span>{editMode ? 'Cancel' : 'Edit'}</span>
            </button>
          </div>

          {editMode ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <LuUser className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-900">{user?.fullName}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <LuMail className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{user?.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Account Management */}
        {accounts.length > 1 && (
          <div className="p-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Switch Account</h3>
              <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                {accounts.length} accounts
              </span>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {accounts.map((account) => (
                <div key={account._id} className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  currentAccountId === account._id 
                    ? 'bg-purple-50 border-purple-200' 
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}>
                  <div className="flex items-center space-x-3">
                    {account.profileImageUrl ? (
                      <img src={account.profileImageUrl} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {account.fullName?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{account.fullName}</p>
                      <p className="text-xs text-gray-500">{account.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {currentAccountId === account._id ? (
                      <span className="text-xs text-purple-600 font-medium">Current</span>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            switchAccount(account._id);
                            toast.success(`Switched to ${account.fullName}`);
                          }}
                          className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                        >
                          Switch
                        </button>
                        <button
                          onClick={() => {
                            removeAccount(account._id);
                            toast.success('Account removed');
                          }}
                          className="text-xs text-red-500 hover:text-red-600 p-1"
                        >
                          <LuTrash2 className="w-3 h-3" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowAddAccountModal(true)}
              className="w-full mt-3 flex items-center justify-center space-x-2 p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <LuPlus className="w-4 h-4" />
              <span>Add Another Account</span>
            </button>
          </div>
        )}

        {/* Current Account Data */}
        <div className="p-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Account</h3>
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              {user?.profileImageUrl ? (
                <img src={user.profileImageUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.fullName?.charAt(0)?.toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-900">{user?.fullName}</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-white p-2 rounded">
                <p className="text-lg font-bold text-purple-600">{stats.totalTransactions}</p>
                <p className="text-xs text-gray-500">Transactions</p>
              </div>
              <div className="bg-white p-2 rounded">
                <p className={`text-lg font-bold ${stats.totalSavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{Math.abs(stats.totalSavings).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">{stats.totalSavings >= 0 ? 'Savings' : 'Loss'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Options */}
        <div className="p-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
          <div className="space-y-2">
            <button 
              onClick={() => setShowAddAccountModal(true)}
              className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <LuSettings className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Account Settings</p>
                <p className="text-sm text-gray-500">Add or manage multiple accounts</p>
              </div>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
              <span className="w-5 h-5 text-gray-600 flex items-center justify-center">🔔</span>
              <div>
                <p className="font-medium text-gray-900">Notifications</p>
                <p className="text-sm text-gray-500">Configure notification preferences</p>
              </div>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
              <span className="w-5 h-5 text-gray-600 flex items-center justify-center">🛡️</span>
              <div>
                <p className="font-medium text-gray-900">Privacy & Security</p>
                <p className="text-sm text-gray-500">Manage your privacy settings</p>
              </div>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
              <span className="w-5 h-5 text-gray-600 flex items-center justify-center">❓</span>
              <div>
                <p className="font-medium text-gray-900">Help & Support</p>
                <p className="text-sm text-gray-500">Get help and contact support</p>
              </div>
            </button>
            
            <button 
              onClick={() => {
                logout();
                toast.success('Logged out successfully');
                navigate('/login');
                onClose();
              }}
              className="w-full flex items-center space-x-3 p-3 text-left hover:bg-red-50 rounded-lg transition-colors text-red-600"
            >
              <LuLogOut className="w-5 h-5" />
              <div>
                <p className="font-medium">Sign Out</p>
                <p className="text-sm text-red-500">Sign out of your account</p>
              </div>
            </button>
          </div>
        </div>


      </div>
      
      <AddAccountModal 
        isOpen={showAddAccountModal} 
        onClose={() => setShowAddAccountModal(false)} 
      />
    </div>
  );
}

export default ProfileModal;