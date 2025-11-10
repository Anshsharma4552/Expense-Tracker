import React from 'react';
import { LuUser, LuMail } from 'react-icons/lu';

function ProfileModal({ isOpen, onClose, user }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Profile Details</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="text-center mb-6">
          {user?.profileImageUrl ? (
            <img 
              src={user.profileImageUrl} 
              alt="Profile" 
              className="w-20 h-20 rounded-full object-cover mx-auto border-4 border-purple-100"
            />
          ) : (
            <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold">
              {user?.fullName?.charAt(0)?.toUpperCase()}
            </div>
          )}
        </div>

        <div className="space-y-4">
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
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-5 h-5 text-purple-600 flex items-center justify-center">📅</div>
            <div>
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="font-medium text-gray-900">Recently Joined</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileModal;