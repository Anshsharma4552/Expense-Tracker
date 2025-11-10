import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { LuDollarSign, LuCreditCard, LuUser } from 'react-icons/lu'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts'
import api from '../../utils/api'

function Home() {
  const { user } = useAuth();
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [incomeResponse, expenseResponse] = await Promise.all([
        api.get('/income/get'),
        api.get('/expense/get')
      ]);
      
      if (incomeResponse.data.success) {
        setIncomes(incomeResponse.data.incomes);
      }
      if (expenseResponse.data.success) {
        setExpenses(expenseResponse.data.expenses);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalSavings = totalIncome - totalExpense;

  // Process data for charts
  const getTopExpenseCategories = () => {
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});
    
    return Object.entries(categoryTotals)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  };

  const reportData = [
    { name: 'Income', value: totalIncome, color: '#10B981' },
    { name: 'Expense', value: totalExpense, color: '#EF4444' },
    { name: 'Savings', value: totalSavings, color: '#8B5CF6' }
  ];

  const getLast7DaysExpenses = () => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dateStr = date.toISOString().split('T')[0];
      
      const dayExpenses = expenses.filter(expense => 
        expense.date.split('T')[0] === dateStr
      );
      
      const totalAmount = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      last7Days.push({ day: dayName, amount: totalAmount });
    }
    
    return last7Days;
  };

  const getRecentExpenses = () => {
    return expenses
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .map(expense => ({
        name: expense.title,
        date: new Date(expense.date).toLocaleDateString(),
        amount: `₹${expense.amount.toLocaleString()}`
      }));
  };

  const topExpenses = getTopExpenseCategories();
  const expenseActivity = getLast7DaysExpenses();
  const recentExpenses = getRecentExpenses();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading dashboard data...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Top Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="bg-white rounded-lg shadow p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600">Total Income</p>
                <p className="text-xl lg:text-3xl font-bold text-green-600">₹{totalIncome.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <LuDollarSign className="text-green-600 text-lg lg:text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600">Total Expense</p>
                <p className="text-xl lg:text-3xl font-bold text-red-600">₹{totalExpense.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <LuCreditCard className="text-red-600 text-lg lg:text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 lg:p-6 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600">Total Savings</p>
                <p className="text-xl lg:text-3xl font-bold text-purple-600">₹{totalSavings.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <LuUser className="text-purple-600 text-lg lg:text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
          {/* Bar Chart */}
          <div className="bg-white rounded-lg shadow p-4 lg:p-6">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Top 5 Expense Categories</h3>
            {topExpenses.length > 0 ? (
              <ResponsiveContainer width="100%" height={250} className="lg:!h-[300px]">
                <BarChart data={topExpenses}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']} />
                  <Bar dataKey="amount" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48 lg:h-64 text-gray-500 text-sm">
                No expense data available
              </div>
            )}
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-lg shadow p-4 lg:p-6">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Financial Overview</h3>
            {totalIncome > 0 || totalExpense > 0 ? (
              <ResponsiveContainer width="100%" height={250} className="lg:!h-[300px]">
                <PieChart>
                  <Pie
                    data={reportData.filter(item => item.value > 0)}
                    cx="50%"
                    cy="50%"
                    outerRadius={window.innerWidth < 768 ? 60 : 80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ₹${value.toLocaleString()}`}
                  >
                    {reportData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48 lg:h-64 text-gray-500 text-sm">
                No financial data available
              </div>
            )}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
          {/* Line Chart */}
          <div className="bg-white rounded-lg shadow p-4 lg:p-6">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Expense Activity (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={200} className="lg:!h-[250px]">
              <LineChart data={expenseActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']} />
                <Line type="monotone" dataKey="amount" stroke="#EF4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Expenses */}
          <div className="bg-white rounded-lg shadow p-4 lg:p-6">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Recent Expenses</h3>
            {recentExpenses.length > 0 ? (
              <div className="space-y-2 lg:space-y-3 max-h-48 lg:max-h-64 overflow-y-auto">
                {recentExpenses.map((expense, index) => (
                  <div key={index} className="flex items-center justify-between p-2 lg:p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm lg:text-base truncate">{expense.name}</p>
                      <p className="text-xs lg:text-sm text-gray-500">{expense.date}</p>
                    </div>
                    <p className="font-semibold text-red-600 text-sm lg:text-base ml-2">{expense.amount}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 lg:py-8 text-gray-500 text-sm">
                No recent expenses found
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Home