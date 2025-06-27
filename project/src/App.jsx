import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Provider } from 'react-redux';
import store from './redux/store.js';
import { Budget } from './components/Budget.jsx';
import { ExpenseForm } from './components/ExpenseForm.jsx';
import { ExpenseTable } from './components/ExpenseTable.jsx';
import { AIInsights } from './components/AIInsights.jsx';
import { Auth } from './components/Auth.jsx';
import { getExpenses } from './redux/actions/expenseActions.js';
import { logout } from './redux/actions/authActions.js';
import { LogOut, Brain, DollarSign, PieChart, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

const AppContent = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getExpenses());
    }
  }, [isAuthenticated, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  if (!isAuthenticated) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Brain className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Expense Tracker
                </h1>
                <p className="text-sm text-gray-600">Smart financial management</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Welcome back,</p>
                <p className="font-semibold text-gray-800">{user?.name}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <LogOut size={18} />
                Logout
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Budget Section */}
          <Budget />

          {/* Add Expense Form */}
          <ExpenseForm />

          {/* AI Insights */}
          <AIInsights />

          {/* Expense Table */}
          <ExpenseTable />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-md border-t border-white/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 AI Expense Tracker. Built with intelligence and care.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;