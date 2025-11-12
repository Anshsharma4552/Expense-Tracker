import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LuTrendingUpDown, LuUser, LuDollarSign, LuCreditCard, LuLogOut, LuMenu, LuX } from 'react-icons/lu';
import ProfileModal from '../ProfileModal';

function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const getCurrentPageTitle = () => {
    const currentItem = navItems.find(item => item.path === location.pathname);
    return currentItem ? currentItem.label : 'Dashboard';
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: '#777C6D'}}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`} style={{backgroundColor: '#B7B89F'}}>
        <div className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{backgroundColor: '#777C6D'}}>
                <LuTrendingUpDown className="text-white text-lg" />
              </div>
              <h1 className="text-lg lg:text-xl font-semibold" style={{color: '#EEEEEE'}}>Expense Tracker</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-700 text-gray-300"
            >
              <LuX className="w-5 h-5" />
            </button>
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
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-4 lg:px-6 py-3 text-sm font-medium transition-colors ${
                  isActive 
                    ? 'border-r-2' 
                    : ''
                }`}
                style={isActive ? {backgroundColor: '#777C6D', borderRightColor: '#EEEEEE', color: '#EEEEEE'} : {color: '#777C6D'}}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LuLogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        <header className="shadow-sm border-b" style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F'}}>
          <div className="px-4 lg:px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md hover:bg-gray-700 text-gray-300"
                >
                  <LuMenu className="w-6 h-6" />
                </button>
                <h2 className="text-xl lg:text-2xl font-bold" style={{color: '#777C6D'}}>{getCurrentPageTitle()}</h2>
              </div>
              <button
                onClick={() => setShowProfileModal(true)}
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-700 transition-colors"
              >
                {user?.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt="Profile" 
                    className="w-8 h-8 lg:w-10 lg:h-10 rounded-full object-cover border-2 border-gray-600"
                  />
                ) : (
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm lg:text-lg">
                    {user?.fullName?.charAt(0)?.toUpperCase()}
                  </div>
                )}
              </button>
            </div>
          </div>
        </header>
        <main className="p-4 lg:p-6">
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