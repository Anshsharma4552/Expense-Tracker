import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { LuUser, LuPlus, LuSearch, LuFilter, LuTrash2, LuPackage, LuSettings } from 'react-icons/lu'
import api from '../../utils/api'
import toast from 'react-hot-toast'

function Inventory() {
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    price: '',
    description: ''
  })

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const response = await api.get('/inventory/get')
      if (response.data.success) {
        setItems(response.data.items)
      }
    } catch (error) {
      console.error('Error fetching items:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['Electronics', 'Furniture', 'Supplies', 'Equipment', 'Other']
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock': return 'text-white'
      case 'Low Stock': return 'text-white'
      case 'Out of Stock': return 'text-white'
      default: return 'text-white'
    }
  }

  const getStatus = (quantity) => {
    if (quantity === 0) return 'Out of Stock'
    if (quantity <= 5) return 'Low Stock'
    return 'In Stock'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      if (editingItem) {
        const response = await api.put(`/inventory/${editingItem._id}`, formData)
        if (response.data.success) {
          toast.success('Item updated successfully!')
          setEditingItem(null)
        }
      } else {
        const response = await api.post('/inventory/add', formData)
        if (response.data.success) {
          toast.success('Item added successfully!')
        }
      }
      setFormData({ name: '', category: '', quantity: '', price: '', description: '' })
      setShowForm(false)
      fetchItems()
    } catch (error) {
      toast.error(error.response?.data?.message || `Error ${editingItem ? 'updating' : 'adding'} item`)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity.toString(),
      price: item.price.toString(),
      description: item.description || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await api.delete(`/inventory/${id}`)
        if (response.data.success) {
          toast.success('Item deleted successfully!')
          fetchItems()
        }
      } catch (error) {
        toast.error('Error deleting item')
      }
    }
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
  const lowStockItems = items.filter(item => item.quantity <= 5 && item.quantity > 0).length
  const outOfStockItems = items.filter(item => item.quantity === 0).length

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading inventory...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="rounded-2xl shadow-lg p-4 lg:p-6 border" style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F'}}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center" style={{backgroundColor: '#B7B89F'}}>
                <LuPackage className="text-white text-lg lg:text-xl" />
              </div>
              <div>
                <h2 className="text-xl lg:text-2xl font-bold" style={{color: '#777C6D'}}>Inventory Management</h2>
                <p className="text-sm lg:text-base" style={{color: '#777C6D', opacity: 0.8}}>Track and manage your inventory items</p>
              </div>
            </div>
            <button 
              onClick={() => setShowForm(true)}
              className="flex items-center justify-center space-x-2 px-4 py-2 rounded-xl transition-colors text-sm lg:text-base"
              style={{backgroundColor: '#777C6D', color: '#EEEEEE'}}
            >
              <LuPlus className="w-4 h-4" />
              <span>Add Item</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="rounded-xl shadow-lg p-4 lg:p-6 border" style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F'}}>
            <h3 className="text-xs lg:text-sm font-medium mb-1" style={{color: '#777C6D'}}>Total Items</h3>
            <p className="text-xl lg:text-2xl font-bold" style={{color: '#777C6D'}}>{items.length}</p>
          </div>
          <div className="rounded-xl shadow-lg p-4 lg:p-6 border" style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F'}}>
            <h3 className="text-xs lg:text-sm font-medium mb-1" style={{color: '#777C6D'}}>Total Value</h3>
            <p className="text-xl lg:text-2xl font-bold" style={{color: '#777C6D'}}>₹{totalValue.toLocaleString()}</p>
          </div>
          <div className="rounded-xl shadow-lg p-4 lg:p-6 border" style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F'}}>
            <h3 className="text-xs lg:text-sm font-medium mb-1" style={{color: '#777C6D'}}>Low Stock</h3>
            <p className="text-xl lg:text-2xl font-bold" style={{color: '#777C6D'}}>{lowStockItems}</p>
          </div>
          <div className="rounded-xl shadow-lg p-4 lg:p-6 border" style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F'}}>
            <h3 className="text-xs lg:text-sm font-medium mb-1" style={{color: '#777C6D'}}>Out of Stock</h3>
            <p className="text-xl lg:text-2xl font-bold" style={{color: '#777C6D'}}>{outOfStockItems}</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="rounded-xl shadow-lg p-4 lg:p-6 border" style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F'}}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{color: '#777C6D'}} />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{backgroundColor: '#EEEEEE', borderColor: '#B7B89F', color: '#777C6D'}}
              />
            </div>
            <div className="flex items-center space-x-2">
              <LuFilter className="w-4 h-4" style={{color: '#777C6D'}} />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{backgroundColor: '#EEEEEE', borderColor: '#B7B89F', color: '#777C6D'}}
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="rounded-xl shadow-lg border overflow-hidden" style={{backgroundColor: '#EEEEEE', borderColor: '#CBCBCB'}}>
          <div className="p-4 lg:p-6 border-b" style={{borderColor: '#CBCBCB'}}>
            <h3 className="text-lg font-semibold" style={{color: '#777C6D'}}>Inventory Items ({filteredItems.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{backgroundColor: '#CBCBCB'}}>
                <tr>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: '#777C6D'}}>Item</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: '#777C6D'}}>Category</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: '#777C6D'}}>Quantity</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: '#777C6D'}}>Price</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: '#777C6D'}}>Value</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: '#777C6D'}}>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{backgroundColor: '#EEEEEE', borderColor: '#CBCBCB'}}>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 lg:px-6 py-12 text-center">
                      <div style={{color: '#777C6D'}}>
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{backgroundColor: '#B7B89F'}}>
                          <LuPackage className="text-white text-2xl" />
                        </div>
                        <p>No inventory items found</p>
                        <button 
                          onClick={() => setShowForm(true)}
                          className="mt-2 font-medium"
                          style={{color: '#777C6D'}}
                        >
                          Add your first item
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-100">
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="font-medium" style={{color: '#777C6D'}}>{item.name}</div>
                      {item.description && (
                        <div className="text-sm" style={{color: '#777C6D', opacity: 0.7}}>{item.description}</div>
                      )}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm" style={{color: '#777C6D'}}>
                      {item.category}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm" style={{color: '#777C6D'}}>
                      {item.quantity}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm" style={{color: '#777C6D'}}>
                      ₹{item.price.toLocaleString()}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium" style={{color: '#777C6D'}}>
                      ₹{(item.quantity * item.price).toLocaleString()}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(getStatus(item.quantity))}`} style={{backgroundColor: '#777C6D'}}>
                          {getStatus(item.quantity)}
                        </span>
                        <button 
                          onClick={() => handleEdit(item)}
                          className="p-1 rounded transition-colors"
                          style={{color: '#777C6D'}}
                        >
                          <LuSettings className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(item._id)}
                          className="p-1 text-red-400 hover:bg-red-900/20 rounded transition-colors"
                        >
                          <LuTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Item Modal */}
        {showForm && (
          <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="rounded-2xl p-4 lg:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto" style={{backgroundColor: '#EEEEEE'}}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold" style={{color: '#777C6D'}}>{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
                <button 
                  onClick={() => setShowForm(false)}
                  className="p-2 rounded-full transition-colors"
                  style={{color: '#777C6D'}}
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: '#777C6D'}}>Item Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F', color: '#777C6D'}}
                    placeholder="Enter item name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: '#777C6D'}}>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F', color: '#777C6D'}}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{color: '#777C6D'}}>Quantity</label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F', color: '#777C6D'}}
                      placeholder="0"
                      min="0"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{color: '#777C6D'}}>Price (₹)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F', color: '#777C6D'}}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: '#777C6D'}}>Description (Optional)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      setEditingItem(null)
                      setFormData({ name: '', category: '', quantity: '', price: '', description: '' })
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
                    {loading ? (editingItem ? 'Updating...' : 'Adding...') : (editingItem ? 'Update Item' : 'Add Item')}
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

export default Inventory