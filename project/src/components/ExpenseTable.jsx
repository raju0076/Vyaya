import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Edit3, Trash2, Search, Filter, Calendar, TrendingUp } from 'lucide-react';
import { deleteExpense, setEditExpense } from '../redux/actions/expenseActions';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

export const ExpenseTable = ({ showActions = true }) => {
  const dispatch = useDispatch();
  const { expenses, loading } = useSelector((state) => state.expenses);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'food', label: 'Food', icon: '🍽️' },
    { value: 'transport', label: 'Transport', icon: '🚗' },
    { value: 'entertainment', label: 'Entertainment', icon: '🎬' },
    { value: 'accommodation', label: 'Accommodation', icon: '🏨' },
    { value: 'activities', label: 'Activities', icon: '⚽' },
    { value: 'other', label: 'Other', icon: '📦' }
  ];

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      dispatch(deleteExpense(id));
    }
  };

  const handleEdit = (expense) => {
    dispatch(setEditExpense(expense));
  };

  const filteredAndSortedExpenses = expenses
    .filter(expense => {
      const matchesSearch = expense.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || expense.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = new Date(a.date) - new Date(b.date);
      } else if (sortBy === 'amount') {
        comparison = a.amount - b.amount;
      } else if (sortBy === 'description') {
        comparison = a.description.localeCompare(b.description);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const totalExpenses = filteredAndSortedExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat?.icon || '📦';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-white via-gray-50 to-blue-50 rounded-2xl shadow-xl p-6 backdrop-blur-md border border-white/20"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
            <TrendingUp className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Expense History</h2>
            <p className="text-sm text-gray-600">
              {filteredAndSortedExpenses.length} expenses • ₹{totalExpenses.toLocaleString('en-IN')} total
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-all duration-300 bg-white/80"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-3 text-gray-400" size={20} />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-all duration-300 bg-white/80 appearance-none"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.icon ? `${cat.icon} ${cat.label}` : cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-all duration-300 bg-white/80"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="description">Sort by Description</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl transition-colors"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Date</th>
                <th className="px-6 py-4 text-left font-semibold">Description</th>
                <th className="px-6 py-4 text-left font-semibold">Category</th>
                <th className="px-6 py-4 text-right font-semibold">Amount</th>
                {showActions && (
                  <th className="px-6 py-4 text-center font-semibold">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredAndSortedExpenses.map((expense, index) => (
                  <motion.tr
                    key={expense._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`border-b border-gray-100 hover:bg-gray-50/80 transition-colors ${
                      index % 2 === 0 ? 'bg-white/50' : 'bg-gray-50/30'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span className="font-medium">
                          {format(new Date(expense.date), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-800">{expense.description}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getCategoryIcon(expense.category)}</span>
                        <span className="capitalize text-sm font-medium text-gray-600">
                          {expense.category}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-bold text-lg text-red-600">
                        ₹{expense.amount.toLocaleString('en-IN')}
                      </span>
                    </td>
                    {showActions && (
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEdit(expense)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            <Edit3 size={18} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(expense._id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </motion.button>
                        </div>
                      </td>
                    )}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {filteredAndSortedExpenses.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No expenses found</h3>
          <p className="text-gray-500">
            {searchTerm || filterCategory !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Start by adding your first expense above'
            }
          </p>
        </div>
      )}
    </motion.div>
  );
};