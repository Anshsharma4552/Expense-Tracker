import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { LuCreditCard, LuPlus, LuX, LuTrash2, LuSettings } from 'react-icons/lu'
import api from '../../utils/api'
import toast from 'react-hot-toast'

function Expense() {
  const [showForm, setShowForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  })

  const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Healthcare', 'Education', 'Other']

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    try {
      const response = await api.get('/expense/get')
      if (response.data.success) {
        setExpenses(response.data.expenses)
      }
    } catch (error) {
      console.error('Error fetching expenses:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      if (editingExpense) {
        const response = await api.put(`/expense/${editingExpense._id}`, formData)
        if (response.data.success) {
          toast.success('Expense updated successfully!')
          setEditingExpense(null)
        }
      } else {
        const response = await api.post('/expense/add', formData)
        if (response.data.success) {
          toast.success('Expense added successfully!')
        }
      }
      setFormData({ title: '', amount: '', category: '', description: '', date: new Date().toISOString().split('T')[0] })
      setShowForm(false)
      fetchExpenses()
    } catch (error) {
      toast.error(error.response?.data?.message || `Error ${editingExpense ? 'updating' : 'adding'} expense`)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (expense) => {
    setEditingExpense(expense)
    setFormData({
      title: expense.title,
      amount: expense.amount.toString(),
      category: expense.category,
      description: expense.description || '',
      date: expense.date.split('T')[0]
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        const response = await api.delete(`/expense/${id}`)
        if (response.data.success) {
          toast.success('Expense deleted successfully!')
          fetchExpenses()
        }
      } catch (error) {
        toast.error('Error deleting expense')
      }
    }
  }

  const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="rounded-2xl shadow-lg p-4 lg:p-6 border" style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F'}}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center" style={{backgroundColor: '#B7B89F'}}>
                <LuCreditCard className="text-white text-lg lg:text-xl" />
              </div>
              <div>
                <h2 className="text-xl lg:text-2xl font-bold" style={{color: '#777C6D'}}>Expense Management</h2>
                <p className="text-sm lg:text-base" style={{color: '#777C6D', opacity: 0.8}}>Track and categorize your expenses</p>
              </div>
            </div>
            <button 
              onClick={() => setShowForm(true)}
              className="flex items-center justify-center space-x-2 px-4 py-2 rounded-xl transition-colors text-sm lg:text-base"
              style={{backgroundColor: '#777C6D', color: '#EEEEEE'}}
            >
              <LuPlus className="w-4 h-4" />
              <span>Add Expense</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="rounded-2xl p-4 lg:p-6 border" style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F'}}>
            <h3 className="text-xs lg:text-sm font-medium mb-1" style={{color: '#777C6D'}}>Total Expenses</h3>
            <p className="text-xl lg:text-2xl font-bold" style={{color: '#777C6D'}}>₹{totalExpense.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl p-4 lg:p-6 border" style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F'}}>
            <h3 className="text-xs lg:text-sm font-medium mb-1" style={{color: '#777C6D'}}>This Month</h3>
            <p className="text-xl lg:text-2xl font-bold" style={{color: '#777C6D'}}>₹{totalExpense.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl p-4 lg:p-6 border sm:col-span-2 lg:col-span-1" style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F'}}>
            <h3 className="text-xs lg:text-sm font-medium mb-1" style={{color: '#777C6D'}}>Records</h3>
            <p className="text-xl lg:text-2xl font-bold" style={{color: '#777C6D'}}>{expenses.length}</p>
          </div>
        </div>

        <div className="rounded-2xl shadow-lg p-6 border" style={{backgroundColor: '#EEEEEE', borderColor: '#CBCBCB'}}>
          <h3 className="text-lg font-semibold mb-4" style={{color: '#777C6D'}}>Expense Records</h3>
          {expenses.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{backgroundColor: '#B7B89F'}}>
                <LuCreditCard className="text-white text-2xl" />
              </div>
              <p className="mb-4" style={{color: '#777C6D'}}>No expense records found</p>
              <button 
                onClick={() => setShowForm(true)}
                className="px-6 py-2 rounded-xl transition-colors"
                style={{backgroundColor: '#777C6D', color: '#EEEEEE'}}
              >
                Add Your First Expense
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {expenses.map((expense) => (
                <div key={expense._id} className="flex items-center justify-between p-4 rounded-lg transition-colors border" style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F'}}>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{backgroundColor: '#B7B89F'}}>
                        <LuCreditCard className="text-white text-lg" />
                      </div>
                      <div>
                        <h4 className="font-medium" style={{color: '#777C6D'}}>{expense.title}</h4>
                        <p className="text-sm" style={{color: '#777C6D', opacity: 0.8}}>{expense.category} • {new Date(expense.date).toLocaleDateString()}</p>
                        {expense.description && <p className="text-sm mt-1" style={{color: '#777C6D', opacity: 0.7}}>{expense.description}</p>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-semibold" style={{color: '#777C6D'}}>₹{expense.amount.toLocaleString()}</span>
                    <button 
                      onClick={() => handleEdit(expense)}
                      className="p-2 rounded-lg transition-colors"
                      style={{color: '#777C6D'}}
                    >
                      <LuSettings className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(expense._id)}
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

        {/* Add Expense Modal */}
        {showForm && (
          <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="rounded-2xl p-4 lg:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto" style={{backgroundColor: '#EEEEEE'}}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold" style={{color: '#777C6D'}}>{editingExpense ? 'Edit Expense' : 'Add Expense'}</h3>
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
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F', color: '#777C6D'}}
                    placeholder="Enter expense title"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: '#777C6D'}}>Amount (₹)</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F', color: '#777C6D'}}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: '#777C6D'}}>Description (Optional)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F', color: '#777C6D'}}
                    placeholder="Enter description"
                    rows="3"
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingExpense(null)
                      setFormData({ title: '', amount: '', category: '', description: '', date: new Date().toISOString().split('T')[0] })
                    }}
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
                    {loading ? (editingExpense ? 'Updating...' : 'Adding...') : (editingExpense ? 'Update Expense' : 'Add Expense')}
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

export default Expense