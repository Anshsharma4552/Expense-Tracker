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
        <div className="rounded-2xl shadow-lg p-4 lg:p-6 border" style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F'}}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center" style={{backgroundColor: '#B7B89F'}}>
                <span className="text-lg lg:text-xl">💰</span>
              </div>
              <div>
                <h2 className="text-xl lg:text-2xl font-bold" style={{color: '#777C6D'}}>Income Management</h2>
                <p className="text-sm lg:text-base" style={{color: '#777C6D', opacity: 0.8}}>Track and manage your income sources</p>
              </div>
            </div>
            <button 
              onClick={() => setShowForm(true)}
              className="flex items-center justify-center space-x-2 px-4 py-2 rounded-xl transition-colors text-sm lg:text-base"
              style={{backgroundColor: '#777C6D', color: '#EEEEEE'}}
            >
              <LuPlus className="w-4 h-4" />
              <span>Add Income</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="rounded-2xl p-4 lg:p-6 border" style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F'}}>
            <h3 className="text-xs lg:text-sm font-medium mb-1" style={{color: '#777C6D'}}>Total Income</h3>
            <p className="text-xl lg:text-2xl font-bold text-green-600">₹{totalIncome.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl p-4 lg:p-6 border" style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F'}}>
            <h3 className="text-xs lg:text-sm font-medium mb-1" style={{color: '#777C6D'}}>This Month</h3>
            <p className="text-xl lg:text-2xl font-bold text-blue-600">₹{totalIncome.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl p-4 lg:p-6 border sm:col-span-2 lg:col-span-1" style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F'}}>
            <h3 className="text-xs lg:text-sm font-medium mb-1" style={{color: '#777C6D'}}>Records</h3>
            <p className="text-xl lg:text-2xl font-bold" style={{color: '#777C6D'}}>{incomes.length}</p>
          </div>
        </div>

        <div className="rounded-2xl shadow-lg p-6 border" style={{backgroundColor: '#EEEEEE', borderColor: '#CBCBCB'}}>
          <h3 className="text-lg font-semibold mb-4" style={{color: '#777C6D'}}>Income Records</h3>
          {incomes.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{backgroundColor: '#B7B89F'}}>
                <span className="text-2xl">💰</span>
              </div>
              <p className="mb-4" style={{color: '#777C6D'}}>No income records found</p>
              <button 
                onClick={() => setShowForm(true)}
                className="px-6 py-2 rounded-xl transition-colors"
                style={{backgroundColor: '#777C6D', color: '#EEEEEE'}}
              >
                Add Your First Income
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {incomes.map((income) => (
                <div key={income._id} className="flex items-center justify-between p-4 rounded-lg transition-colors border" style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F'}}>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{backgroundColor: '#B7B89F'}}>
                        <span className="text-lg">💰</span>
                      </div>
                      <div>
                        <h4 className="font-medium" style={{color: '#777C6D'}}>{income.title}</h4>
                        <p className="text-sm" style={{color: '#777C6D', opacity: 0.8}}>{income.category} • {new Date(income.date).toLocaleDateString()}</p>
                        {income.description && <p className="text-sm mt-1" style={{color: '#777C6D', opacity: 0.7}}>{income.description}</p>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-semibold text-green-600">₹{income.amount.toLocaleString()}</span>
                    <button 
                      onClick={() => handleDelete(income._id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
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
            <div className="rounded-2xl p-4 lg:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto" style={{backgroundColor: '#EEEEEE'}}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold" style={{color: '#777C6D'}}>Add Income</h3>
                <button 
                  onClick={() => setShowForm(false)}
                  className="p-2 rounded-full transition-colors"
                  style={{color: '#777C6D'}}
                >
                  <LuX className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: '#777C6D'}}>Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F', color: '#777C6D'}}
                    placeholder="Enter income title"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: '#777C6D'}}>Amount (₹)</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F', color: '#777C6D'}}
                    placeholder="Enter amount"
                    min="1"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: '#777C6D'}}>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F', color: '#777C6D'}}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: '#777C6D'}}>Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F', color: '#777C6D'}}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: '#777C6D'}}>Description (Optional)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F', color: '#777C6D'}}
                    placeholder="Enter description"
                    rows="3"
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-2 border rounded-lg transition-colors"
                    style={{borderColor: '#B7B89F', color: '#777C6D'}}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                    style={{backgroundColor: '#777C6D', color: '#EEEEEE'}}
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