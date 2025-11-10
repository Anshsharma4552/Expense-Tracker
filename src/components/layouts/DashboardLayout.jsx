import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LuTrendingUpDown, LuUser, LuDollarSign, LuCreditCard, LuLogOut } from 'react-icons/lu';
import ProfileModal from '../ProfileModal';

function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LuUser },
    { path: '/income', label: 'Sales', icon: LuDollarSign },
    { path: '/expense', label: 'Purchase', icon: LuCreditCard },
    { path: '/inventory', label: 'Inventory', icon: LuUser },
    { path: '/reports', label: 'Reports', icon: LuUser },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-40">
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <LuTrendingUpDown className="text-white text-lg" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Expense Tracker</h1>
          </div>
        </div>
        <nav className="mt-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-6 py-3 text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-purple-50 text-purple-600 border-r-2 border-purple-600' 
                    : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LuLogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <header className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
              <button
                onClick={() => setShowProfileModal(true)}
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-50 transition-colors"
              >
                {user?.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {user?.fullName?.charAt(0)?.toUpperCase()}
                  </div>
                )}
              </button>
            </div>
          </div>
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
      <ProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
        user={user} 
      />
    </div>
  );
}

export default DashboardLayout;