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
  const [timePeriod, setTimePeriod] = useState('7d');
  const [sortOrder, setSortOrder] = useState('recent');
  const [categoryPeriod, setCategoryPeriod] = useState('7d');
  const [overviewPeriod, setOverviewPeriod] = useState('7d');
  const [barChartKey, setBarChartKey] = useState(0);
  const [pieChartKey, setPieChartKey] = useState(0);
  const [lineChartKey, setLineChartKey] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setBarChartKey(prev => prev + 1);
  }, [categoryPeriod]);

  useEffect(() => {
    setPieChartKey(prev => prev + 1);
  }, [overviewPeriod]);

  useEffect(() => {
    setLineChartKey(prev => prev + 1);
  }, [timePeriod]);

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
  const getFilteredExpenses = (period) => {
    const today = new Date();
    let startDate;
    
    if (period === '7d') {
      startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === '30d') {
      startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (period === '6m') {
      startDate = new Date(today.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
    } else if (period === '1y') {
      startDate = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
    }
    
    return expenses.filter(expense => new Date(expense.date) >= startDate);
  };

  const getTopExpenseCategories = () => {
    const filteredExpenses = getFilteredExpenses(categoryPeriod);
    const categoryTotals = filteredExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});
    
    return Object.entries(categoryTotals)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  };

  const getOverviewData = () => {
    const filteredExpenses = getFilteredExpenses(overviewPeriod);
    const filteredIncomes = incomes.filter(income => {
      const today = new Date();
      let startDate;
      
      if (overviewPeriod === '7d') {
        startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (overviewPeriod === '30d') {
        startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      } else if (overviewPeriod === '6m') {
        startDate = new Date(today.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
      } else if (overviewPeriod === '1y') {
        startDate = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
      }
      
      return new Date(income.date) >= startDate;
    });
    
    const periodIncome = filteredIncomes.reduce((sum, income) => sum + income.amount, 0);
    const periodExpense = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const periodSavings = periodIncome - periodExpense;
    
    return [
      { name: 'Income', value: periodIncome, color: '#10B981' },
      { name: 'Expense', value: periodExpense, color: '#EF4444' },
      { name: 'Savings', value: periodSavings, color: '#8B5CF6' }
    ];
  };

  const getExpensesByPeriod = () => {
    const today = new Date();
    let data = [];
    
    if (timePeriod === '7d') {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dateStr = date.toISOString().split('T')[0];
        
        const dayExpenses = expenses.filter(expense => 
          expense.date.split('T')[0] === dateStr
        );
        
        const totalAmount = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        data.push({ period: dayName, amount: totalAmount });
      }
    } else if (timePeriod === '30d') {
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dayName = date.getDate();
        const dateStr = date.toISOString().split('T')[0];
        
        const dayExpenses = expenses.filter(expense => 
          expense.date.split('T')[0] === dateStr
        );
        
        const totalAmount = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        data.push({ period: dayName, amount: totalAmount });
      }
    } else if (timePeriod === '6m') {
      for (let i = 5; i >= 0; i--) {
        const date = new Date(today);
        date.setMonth(date.getMonth() - i);
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        const monthExpenses = expenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= monthStart && expenseDate <= monthEnd;
        });
        
        const totalAmount = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        data.push({ period: monthName, amount: totalAmount });
      }
    } else if (timePeriod === '1y') {
      for (let i = 11; i >= 0; i--) {
        const date = new Date(today);
        date.setMonth(date.getMonth() - i);
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        const monthExpenses = expenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= monthStart && expenseDate <= monthEnd;
        });
        
        const totalAmount = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        data.push({ period: monthName, amount: totalAmount });
      }
    }
    
    return data;
  };

  const getRecentExpenses = () => {
    let sortedExpenses = [...expenses];
    
    if (sortOrder === 'highest') {
      sortedExpenses.sort((a, b) => b.amount - a.amount);
    } else if (sortOrder === 'lowest') {
      sortedExpenses.sort((a, b) => a.amount - b.amount);
    } else {
      sortedExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    return sortedExpenses
      .slice(0, 5)
      .map(expense => ({
        name: expense.title,
        date: new Date(expense.date).toLocaleDateString(),
        amount: `₹${expense.amount.toLocaleString()}`,
        rawAmount: expense.amount
      }));
  };

  const topExpenses = getTopExpenseCategories();
  const expenseActivity = getExpensesByPeriod();
  const recentExpenses = getRecentExpenses();
  const reportData = getOverviewData();

  const timePeriodOptions = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '6m', label: '6 Months' },
    { value: '1y', label: '1 Year' }
  ];

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
      <div className="space-y-8">
        {/* Top Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 lg:p-10 border" style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm lg:text-base font-medium mb-2" style={{color: '#777C6D'}}>Total Income</p>
                <p className="text-2xl lg:text-4xl font-bold text-green-600">₹{totalIncome.toLocaleString()}</p>
              </div>
              <div className="w-16 h-16 lg:w-18 lg:h-18 rounded-2xl flex items-center justify-center shadow-lg" style={{backgroundColor: '#B7B89F'}}>
                <span className="text-2xl lg:text-3xl">💰</span>
              </div>
            </div>
          </div>
          
          <div className="rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 lg:p-10 border" style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm lg:text-base font-medium mb-2" style={{color: '#777C6D'}}>Total Expense</p>
                <p className="text-2xl lg:text-4xl font-bold text-red-600">₹{totalExpense.toLocaleString()}</p>
              </div>
              <div className="w-16 h-16 lg:w-18 lg:h-18 rounded-2xl flex items-center justify-center shadow-lg" style={{backgroundColor: '#B7B89F'}}>
                <span className="text-2xl lg:text-3xl">💳</span>
              </div>
            </div>
          </div>
          
          <div className="rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 lg:p-10 border sm:col-span-2 lg:col-span-1" style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm lg:text-base font-medium mb-2" style={{color: '#777C6D'}}>Total Savings</p>
                <p className="text-2xl lg:text-4xl font-bold text-blue-600">₹{totalSavings.toLocaleString()}</p>
              </div>
              <div className="w-16 h-16 lg:w-18 lg:h-18 rounded-2xl flex items-center justify-center shadow-lg" style={{backgroundColor: '#B7B89F'}}>
                <span className="text-2xl lg:text-3xl">💾</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-12">
          {/* Bar Chart */}
          <div className="rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 lg:p-8 border" style={{backgroundColor: '#EEEEEE', borderColor: '#CBCBCB'}}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <h3 className="text-base lg:text-lg font-semibold" style={{color: '#777C6D'}}>Top 5 Expense Categories</h3>
              <div className="flex rounded-xl p-1.5 shadow-inner" style={{backgroundColor: '#CBCBCB'}}>
                {timePeriodOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setCategoryPeriod(option.value)}
                    className={`px-4 py-2 text-xs lg:text-sm font-semibold rounded-lg transition-all duration-300`}
                    style={categoryPeriod === option.value ? {backgroundColor: '#777C6D', color: '#EEEEEE'} : {color: '#777C6D'}}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            {topExpenses.length > 0 ? (
              <ResponsiveContainer width="100%" height={250} className="lg:!h-[300px]">
                <BarChart key={`bar-${barChartKey}`} data={topExpenses}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']} />
                  <Bar dataKey="amount" fill="#8B5CF6" animationDuration={800} animationBegin={0} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48 lg:h-64 text-sm" style={{color: '#777C6D'}}>
                No expense data available
              </div>
            )}
          </div>

          {/* Pie Chart */}
          <div className="rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 lg:p-8 border" style={{backgroundColor: '#EEEEEE', borderColor: '#CBCBCB'}}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <h3 className="text-base lg:text-lg font-semibold" style={{color: '#777C6D'}}>Financial Overview</h3>
              <div className="flex rounded-xl p-1.5 shadow-inner" style={{backgroundColor: '#CBCBCB'}}>
                {timePeriodOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setOverviewPeriod(option.value)}
                    className={`px-4 py-2 text-xs lg:text-sm font-semibold rounded-lg transition-all duration-300`}
                    style={overviewPeriod === option.value ? {backgroundColor: '#777C6D', color: '#EEEEEE'} : {color: '#777C6D'}}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            {reportData.some(item => item.value > 0) ? (
              <ResponsiveContainer width="100%" height={250} className="lg:!h-[300px]">
                <PieChart key={`pie-${pieChartKey}`}>
                  <Pie
                    data={reportData.filter(item => item.value > 0)}
                    cx="50%"
                    cy="50%"
                    outerRadius={window.innerWidth < 768 ? 60 : 80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ₹${value.toLocaleString()}`}
                    animationDuration={800}
                    animationBegin={0}
                  >
                    {reportData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48 lg:h-64 text-sm" style={{color: '#777C6D'}}>
                No financial data available
              </div>
            )}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Line Chart */}
          <div className="rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 lg:p-8 border" style={{backgroundColor: '#EEEEEE', borderColor: '#CBCBCB'}}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <h3 className="text-base lg:text-lg font-semibold" style={{color: '#777C6D'}}>Expense Activity</h3>
              <div className="flex rounded-xl p-1.5 shadow-inner" style={{backgroundColor: '#CBCBCB'}}>
                {timePeriodOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTimePeriod(option.value)}
                    className={`px-4 py-2 text-xs lg:text-sm font-semibold rounded-lg transition-all duration-300`}
                    style={timePeriod === option.value ? {backgroundColor: '#777C6D', color: '#EEEEEE'} : {color: '#777C6D'}}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200} className="lg:!h-[250px]">
              <LineChart key={`line-${lineChartKey}`} data={expenseActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="period" 
                  fontSize={12} 
                  tick={{ fill: '#777C6D' }}
                  axisLine={{ stroke: '#B7B89F' }}
                />
                <YAxis 
                  fontSize={12} 
                  tick={{ fill: '#777C6D' }}
                  axisLine={{ stroke: '#B7B89F' }}
                />
                <Tooltip 
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']} 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#EF4444" 
                  strokeWidth={3}
                  dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#EF4444', strokeWidth: 2, fill: '#fff' }}
                  animationDuration={800}
                  animationBegin={0}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Expenses */}
          <div className="rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 lg:p-8 border" style={{backgroundColor: '#EEEEEE', borderColor: '#CBCBCB'}}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <h3 className="text-base lg:text-lg font-semibold" style={{color: '#777C6D'}}>Recent Expenses</h3>
              <div className="flex rounded-xl p-1.5 shadow-inner" style={{backgroundColor: '#CBCBCB'}}>
                {[{value: 'recent', label: 'Recent'}, {value: 'highest', label: 'Highest'}, {value: 'lowest', label: 'Lowest'}].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSortOrder(option.value)}
                    className={`px-4 py-2 text-xs lg:text-sm font-semibold rounded-lg transition-all duration-300`}
                    style={sortOrder === option.value ? {backgroundColor: '#777C6D', color: '#EEEEEE'} : {color: '#777C6D'}}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            {recentExpenses.length > 0 ? (
              <div className="space-y-3 lg:space-y-4 max-h-48 lg:max-h-64 overflow-y-auto">
                {recentExpenses.map((expense, index) => (
                  <div key={index} className="flex items-center justify-between p-4 lg:p-5 rounded-xl hover:shadow-md transition-all duration-200 border" style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F'}}>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm lg:text-base truncate" style={{color: '#777C6D'}}>{expense.name}</p>
                      <p className="text-xs lg:text-sm" style={{color: '#777C6D', opacity: 0.7}}>{expense.date}</p>
                    </div>
                    <p className="font-semibold text-red-600 text-sm lg:text-base ml-2">{expense.amount}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 lg:py-8 text-sm" style={{color: '#777C6D'}}>
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