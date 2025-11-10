import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"; 
import { AuthProvider, useAuth } from './context/AuthContext';
import SignUp from './pages/Auth/SignUp';
import Home from './pages/Dashboard/Home';
import Login from './pages/Auth/Login';
import Income from './pages/Dashboard/Income';
import Expense from './pages/Dashboard/Expense';
import Inventory from './pages/Dashboard/Inventory';
import Reports from './pages/Dashboard/Reports';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/dashboard" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/income" element={<ProtectedRoute><Income /></ProtectedRoute>} />
          <Route path="/expense" element={<ProtectedRoute><Expense /></ProtectedRoute>} />
          <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        </Routes>
        <Toaster position="top-right" />
      </Router>
    </AuthProvider>
  )
}

const Root = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default App
