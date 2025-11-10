import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { LuTrendingUp, LuTrendingDown, LuDollarSign, LuCreditCard, LuCalendar, LuUser } from 'react-icons/lu'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer, AreaChart, Area } from 'recharts'
import api from '../../utils/api'

function Reports() {
  const [incomes, setIncomes] = useState([])
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('all')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [incomeResponse, expenseResponse] = await Promise.all([
        api.get('/income/get'),
        api.get('/expense/get')
      ])
      
      if (incomeResponse.data.success) {
        setIncomes(incomeResponse.data.incomes)
      }
      if (expenseResponse.data.success) {
        setExpenses(expenseResponse.data.expenses)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0)
  const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const netProfit = totalIncome - totalExpense
  const profitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : 0

  // Monthly data for trends
  const getMonthlyData = () => {
    const monthlyData = {}
    
    incomes.forEach(income => {
      const month = new Date(income.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      if (!monthlyData[month]) monthlyData[month] = { month, income: 0, expense: 0 }
      monthlyData[month].income += income.amount
    })
    
    expenses.forEach(expense => {
      const month = new Date(expense.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      if (!monthlyData[month]) monthlyData[month] = { month, income: 0, expense: 0 }
      monthlyData[month].expense += expense.amount
    })
    
    return Object.values(monthlyData).map(data => ({
      ...data,
      profit: data.income - data.expense
    })).sort((a, b) => new Date(a.month) - new Date(b.month))
  }

  // Category-wise expense breakdown
  const getCategoryBreakdown = () => {
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    }, {})
    
    return Object.entries(categoryTotals)
      .map(([name, amount]) => ({ name, amount, percentage: ((amount / totalExpense) * 100).toFixed(1) }))
      .sort((a, b) => b.amount - a.amount)
  }

  const monthlyData = getMonthlyData()
  const categoryData = getCategoryBreakdown()
  const colors = ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5A2B', '#EC4899']

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading reports...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <LuUser className="text-white text-lg lg:text-xl" />
              </div>
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Financial Reports</h2>
                <p className="text-sm lg:text-base text-gray-600">Comprehensive analysis of your financial performance</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <LuCalendar className="w-4 h-4 text-gray-500" />
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-xl lg:text-2xl font-bold text-green-600">₹{totalIncome.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <LuDollarSign className="text-green-600 text-lg" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-xl lg:text-2xl font-bold text-red-600">₹{totalExpense.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <LuCreditCard className="text-red-600 text-lg" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600">{netProfit >= 0 ? 'Net Profit' : 'Net Loss'}</p>
                <p className={`text-xl lg:text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{Math.abs(netProfit).toLocaleString()}
                </p>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                netProfit >= 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {netProfit >= 0 ? 
                  <LuTrendingUp className="text-green-600 text-lg" /> : 
                  <LuTrendingDown className="text-red-600 text-lg" />
                }
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600">Profit Margin</p>
                <p className={`text-xl lg:text-2xl font-bold ${parseFloat(profitMargin) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {profitMargin}%
                </p>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                parseFloat(profitMargin) >= 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {parseFloat(profitMargin) >= 0 ? 
                  <LuTrendingUp className="text-green-600 text-lg" /> : 
                  <LuTrendingDown className="text-red-600 text-lg" />
                }
              </div>
            </div>
          </div>
        </div>

        {/* Profit/Loss Analysis */}
        <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6 border border-gray-100">
          <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4">Profit & Loss Analysis</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Financial Status</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Revenue</span>
                  <span className="text-green-600 font-semibold">₹{totalIncome.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Expenses</span>
                  <span className="text-red-600 font-semibold">₹{totalExpense.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg border-2 border-gray-200">
                  <span className="font-semibold">{netProfit >= 0 ? 'Net Profit' : 'Net Loss'}</span>
                  <span className={`font-bold text-lg ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{Math.abs(netProfit).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Performance Insights</h4>
              <div className="space-y-3 text-sm">
                {netProfit >= 0 ? (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-green-800 font-medium">✅ You're in profit!</p>
                    <p className="text-green-700 mt-1">Your income exceeds expenses by ₹{netProfit.toLocaleString()}</p>
                  </div>
                ) : (
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-red-800 font-medium">⚠️ You're in loss</p>
                    <p className="text-red-700 mt-1">Your expenses exceed income by ₹{Math.abs(netProfit).toLocaleString()}</p>
                  </div>
                )}
                
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-blue-800 font-medium">💡 Recommendation</p>
                  <p className="text-blue-700 mt-1">
                    {netProfit >= 0 
                      ? 'Consider investing your surplus or building an emergency fund.' 
                      : 'Review your expenses and look for areas to cut costs.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
          {/* Monthly Trend */}
          <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6 border border-gray-100">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Monthly Profit/Loss Trend</h3>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250} className="lg:!h-[300px]">
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']} />
                  <Area type="monotone" dataKey="income" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="expense" stackId="2" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
                  <Line type="monotone" dataKey="profit" stroke="#8B5CF6" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48 lg:h-64 text-gray-500 text-sm">
                No data available for trend analysis
              </div>
            )}
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6 border border-gray-100">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Expense Categories</h3>
            {categoryData.length > 0 ? (
              <div className="space-y-3">
                {categoryData.slice(0, 6).map((category, index) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: colors[index % colors.length] }}
                      />
                      <span className="text-sm font-medium text-gray-700">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">₹{category.amount.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{category.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
                No expense categories to display
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Reports