import React from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { LuDollarSign, LuCreditCard, LuUser } from 'react-icons/lu'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts'

function Home() {
  const { user } = useAuth();

  // Sample data
  const topExpenses = [
    { name: 'Food', amount: 12000 },
    { name: 'Transport', amount: 8000 },
    { name: 'Shopping', amount: 6000 },
    { name: 'Bills', amount: 5000 },
    { name: 'Entertainment', amount: 3000 }
  ];

  const reportData = [
    { name: 'Income', value: 50000, color: '#10B981' },
    { name: 'Expense', value: 34000, color: '#EF4444' },
    { name: 'Savings', value: 16000, color: '#8B5CF6' }
  ];

  const expenseActivity = [
    { day: 'Mon', amount: 1200 },
    { day: 'Tue', amount: 2000 },
    { day: 'Wed', amount: 1500 },
    { day: 'Thu', amount: 3000 },
    { day: 'Fri', amount: 2500 },
    { day: 'Sat', amount: 4000 },
    { day: 'Sun', amount: 1800 }
  ];

  const recentExpenses = [
    { name: 'Grocery Shopping', date: '2024-01-15', amount: '₹855' },
    { name: 'Gas Station', date: '2024-01-14', amount: '₹450' },
    { name: 'Restaurant', date: '2024-01-13', amount: '₹327' },
    { name: 'Online Shopping', date: '2024-01-12', amount: '₹1200' },
    { name: 'Utilities', date: '2024-01-11', amount: '₹952' }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Income</p>
                <p className="text-3xl font-bold text-green-600">₹50,000</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <LuDollarSign className="text-green-600 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Expense</p>
                <p className="text-3xl font-bold text-red-600">₹34,000</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <LuCreditCard className="text-red-600 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Savings</p>
                <p className="text-3xl font-bold text-purple-600">₹16,000</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <LuUser className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Expense Sources</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topExpenses}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reportData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ₹${value}`}
                >
                  {reportData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Activity (7 days)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={expenseActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#EF4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Expenses */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Expenses</h3>
            <div className="space-y-3">
              {recentExpenses.map((expense, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{expense.name}</p>
                    <p className="text-sm text-gray-500">{expense.date}</p>
                  </div>
                  <p className="font-semibold text-red-600">{expense.amount}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Home