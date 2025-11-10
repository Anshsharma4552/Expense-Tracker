import React from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { LuCreditCard } from 'react-icons/lu'

function Expense() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-lg shadow-purple-600/5 p-6 border border-purple-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                <LuCreditCard className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Expense Management</h2>
                <p className="text-gray-600">Track and categorize your expenses</p>
              </div>
            </div>
            <button className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors">
              <span>+</span>
              <span>Add Expense</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
            <h3 className="text-sm font-medium text-red-600 mb-1">This Month</h3>
            <p className="text-2xl font-bold text-red-700">₹0</p>
          </div>
          <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
            <h3 className="text-sm font-medium text-orange-600 mb-1">This Year</h3>
            <p className="text-2xl font-bold text-orange-700">₹0</p>
          </div>
          <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
            <h3 className="text-sm font-medium text-purple-600 mb-1">Total Expenses</h3>
            <p className="text-2xl font-bold text-purple-600">₹0</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg shadow-purple-600/5 p-6 border border-purple-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Expenses</h3>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LuCreditCard className="text-gray-400 text-2xl" />
            </div>
            <p className="text-gray-500 mb-4">No expense records found</p>
            <button className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition-colors">
              Add Your First Expense
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Expense