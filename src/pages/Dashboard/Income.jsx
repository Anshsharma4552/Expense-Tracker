import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { LuDollarSign, LuPlus, LuX, LuTrash2 } from 'react-icons/lu'
import api from '../../utils/api'
import toast from 'react-hot-toast'

function Income() {
  const [showForm, setShowForm] = useState(false)
  const [incomes, setIncomes] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  })

  const categories = ['Salary', 'Freelance', 'Business', 'Investment', 'Other']

  useEffect(() => {
    fetchIncomes()
  }, [])

  const fetchIncomes = async () => {
    try {
      const response = await api.get('/income/get')
      if (response.data.success) {
        setIncomes(response.data.incomes)
      }
    } catch (error) {
      console.error('Error fetching incomes:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await api.post('/income/add', formData)
      if (response.data.success) {
        toast.success('Income added successfully!')
        setFormData({ title: '', amount: '', category: '', description: '', date: new Date().toISOString().split('T')[0] })
        setShowForm(false)
        fetchIncomes()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding income')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this income?')) {
      try {
        const response = await api.delete(`/income/${id}`)
        if (response.data.success) {
          toast.success('Income deleted successfully!')
          fetchIncomes()
        }
      } catch (error) {
        toast.error('Error deleting income')
      }
    }
  }

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <LuDollarSign className="text-white text-lg lg:text-xl" />
              </div>
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Income Management</h2>
                <p className="text-sm lg:text-base text-gray-600">Track and manage your income sources</p>
              </div>
            </div>
            <button 
              onClick={() => setShowForm(true)}
              className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors text-sm lg:text-base"
            >
              <LuPlus className="w-4 h-4" />
              <span>Add Income</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="bg-green-50 rounded-2xl p-4 lg:p-6 border border-green-100">
            <h3 className="text-xs lg:text-sm font-medium text-green-600 mb-1">Total Income</h3>
            <p className="text-xl lg:text-2xl font-bold text-green-700">₹{totalIncome.toLocaleString()}</p>
          </div>
          <div className="bg-blue-50 rounded-2xl p-4 lg:p-6 border border-blue-100">
            <h3 className="text-xs lg:text-sm font-medium text-blue-600 mb-1">This Month</h3>
            <p className="text-xl lg:text-2xl font-bold text-blue-700">₹{totalIncome.toLocaleString()}</p>
          </div>
          <div className="bg-purple-50 rounded-2xl p-4 lg:p-6 border border-purple-100 sm:col-span-2 lg:col-span-1">
            <h3 className="text-xs lg:text-sm font-medium text-purple-600 mb-1">Records</h3>
            <p className="text-xl lg:text-2xl font-bold text-purple-600">{incomes.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Income Records</h3>
          {incomes.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LuDollarSign className="text-gray-400 text-2xl" />
              </div>
              <p className="text-gray-500 mb-4">No income records found</p>
              <button 
                onClick={() => setShowForm(true)}
                className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition-colors"
              >
                Add Your First Income
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {incomes.map((income) => (
                <div key={income._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <LuDollarSign className="text-green-600 text-lg" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{income.title}</h4>
                        <p className="text-sm text-gray-500">{income.category} • {new Date(income.date).toLocaleDateString()}</p>
                        {income.description && <p className="text-sm text-gray-600 mt-1">{income.description}</p>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-semibold text-green-600">₹{income.amount.toLocaleString()}</span>
                    <button 
                      onClick={() => handleDelete(income._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LuTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Income Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-4 lg:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Add Income</h3>
                <button 
                  onClick={() => setShowForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <LuX className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter income title"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter amount"
                    min="1"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter description"
                    rows="3"
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add Income'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default Income