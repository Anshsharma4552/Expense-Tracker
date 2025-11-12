import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { LuTrendingUp, LuTrendingDown, LuDollarSign, LuCreditCard, LuCalendar, LuUser, LuCheck, LuX, LuLightbulb } from 'react-icons/lu'
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
  const colors = ['#777C6D', '#B7B89F', '#CBCBCB', '#EEEEEE', '#777C6D', '#B7B89F', '#CBCBCB']

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
        <div className="rounded-2xl shadow-lg p-4 lg:p-6 border" style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F'}}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center" style={{backgroundColor: '#B7B89F'}}>
                <LuTrendingUp className="text-white text-lg lg:text-xl" />
              </div>
              <div>
                <h2 className="text-xl lg:text-2xl font-bold" style={{color: '#777C6D'}}>Financial Reports</h2>
                <p className="text-sm lg:text-base" style={{color: '#777C6D', opacity: 0.8}}>Comprehensive analysis of your financial performance</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <LuCalendar className="w-4 h-4" style={{color: '#777C6D'}} />
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{backgroundColor: '#EEEEEE', borderColor: '#B7B89F', color: '#777C6D'}}
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
          <div className="rounded-xl shadow-lg p-4 lg:p-6 border" style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium" style={{color: '#777C6D'}}>Total Revenue</p>
                <p className="text-xl lg:text-2xl font-bold" style={{color: '#777C6D'}}>₹{totalIncome.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{backgroundColor: '#B7B89F'}}>
                <LuDollarSign className="text-white text-lg" />
              </div>
            </div>
          </div>
          
          <div className="rounded-xl shadow-lg p-4 lg:p-6 border" style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium" style={{color: '#777C6D'}}>Total Expenses</p>
                <p className="text-xl lg:text-2xl font-bold" style={{color: '#777C6D'}}>₹{totalExpense.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{backgroundColor: '#B7B89F'}}>
                <LuCreditCard className="text-white text-lg" />
              </div>
            </div>
          </div>
          
          <div className="rounded-xl shadow-lg p-4 lg:p-6 border" style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium" style={{color: '#777C6D'}}>{netProfit >= 0 ? 'Net Profit' : 'Net Loss'}</p>
                <p className="text-xl lg:text-2xl font-bold" style={{color: '#777C6D'}}>
                  ₹{Math.abs(netProfit).toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{backgroundColor: '#B7B89F'}}>
                {netProfit >= 0 ? <LuTrendingUp className="text-white text-lg" /> : <LuTrendingDown className="text-white text-lg" />}
              </div>
            </div>
          </div>
          
          <div className="rounded-xl shadow-lg p-4 lg:p-6 border" style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium" style={{color: '#777C6D'}}>Profit Margin</p>
                <p className="text-xl lg:text-2xl font-bold" style={{color: '#777C6D'}}>
                  {profitMargin}%
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{backgroundColor: '#B7B89F'}}>
                {parseFloat(profitMargin) >= 0 ? <LuTrendingUp className="text-white text-lg" /> : <LuTrendingDown className="text-white text-lg" />}
              </div>
            </div>
          </div>
        </div>

        {/* Profit/Loss Analysis */}
        <div className="rounded-xl shadow-lg p-4 lg:p-6 border" style={{backgroundColor: '#EEEEEE', borderColor: '#CBCBCB'}}>
          <h3 className="text-lg lg:text-xl font-semibold mb-4" style={{color: '#777C6D'}}>Profit & Loss Analysis</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3" style={{color: '#777C6D'}}>Financial Status</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg border" style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F'}}>
                  <span className="text-sm font-medium" style={{color: '#777C6D'}}>Revenue</span>
                  <span className="font-semibold" style={{color: '#777C6D'}}>₹{totalIncome.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg border" style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F'}}>
                  <span className="text-sm font-medium" style={{color: '#777C6D'}}>Expenses</span>
                  <span className="font-semibold" style={{color: '#777C6D'}}>₹{totalExpense.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg border-2" style={{backgroundColor: '#B7B89F', borderColor: '#777C6D'}}>
                  <span className="font-semibold" style={{color: '#777C6D'}}>{netProfit >= 0 ? 'Net Profit' : 'Net Loss'}</span>
                  <span className="font-bold text-lg" style={{color: '#777C6D'}}>
                    ₹{Math.abs(netProfit).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3" style={{color: '#777C6D'}}>Performance Insights</h4>
              <div className="space-y-3 text-sm">
                {netProfit >= 0 ? (
                  <div className="p-3 rounded-lg border" style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F'}}>
                    <div className="flex items-center space-x-2">
                      <LuCheck className="w-4 h-4" style={{color: '#777C6D'}} />
                      <p className="font-medium" style={{color: '#777C6D'}}>You're in profit!</p>
                    </div>
                    <p className="mt-1" style={{color: '#777C6D'}}>Your income exceeds expenses by ₹{netProfit.toLocaleString()}</p>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg border" style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F'}}>
                    <div className="flex items-center space-x-2">
                      <LuX className="w-4 h-4" style={{color: '#777C6D'}} />
                      <p className="font-medium" style={{color: '#777C6D'}}>You're in loss</p>
                    </div>
                    <p className="mt-1" style={{color: '#777C6D'}}>Your expenses exceed income by ₹{Math.abs(netProfit).toLocaleString()}</p>
                  </div>
                )}
                
                <div className="p-3 rounded-lg border" style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F'}}>
                  <div className="flex items-center space-x-2">
                    <LuLightbulb className="w-4 h-4" style={{color: '#777C6D'}} />
                    <p className="font-medium" style={{color: '#777C6D'}}>Recommendation</p>
                  </div>
                  <p className="mt-1" style={{color: '#777C6D'}}>
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
          <div className="rounded-xl shadow-lg p-4 lg:p-6 border" style={{backgroundColor: '#EEEEEE', borderColor: '#CBCBCB'}}>
            <h3 className="text-base lg:text-lg font-semibold mb-4" style={{color: '#777C6D'}}>Monthly Profit/Loss Trend</h3>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250} className="lg:!h-[300px]">
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']} />
                  <Area type="monotone" dataKey="income" stackId="1" stroke="#777C6D" fill="#777C6D" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="expense" stackId="2" stroke="#B7B89F" fill="#B7B89F" fillOpacity={0.6} />
                  <Line type="monotone" dataKey="profit" stroke="#CBCBCB" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48 lg:h-64 text-sm" style={{color: '#777C6D'}}>
                No data available for trend analysis
              </div>
            )}
          </div>

          {/* Category Breakdown */}
          <div className="rounded-xl shadow-lg p-4 lg:p-6 border" style={{backgroundColor: '#EEEEEE', borderColor: '#CBCBCB'}}>
            <h3 className="text-base lg:text-lg font-semibold mb-4" style={{color: '#777C6D'}}>Expense Categories</h3>
            {categoryData.length > 0 ? (
              <div className="space-y-3">
                {categoryData.slice(0, 6).map((category, index) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: colors[index % colors.length] }}
                      />
                      <span className="text-sm font-medium" style={{color: '#777C6D'}}>{category.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold" style={{color: '#777C6D'}}>₹{category.amount.toLocaleString()}</p>
                      <p className="text-xs" style={{color: '#777C6D', opacity: 0.7}}>{category.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-sm" style={{color: '#777C6D'}}>
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