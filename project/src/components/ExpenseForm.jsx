import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addExpense, updateExpense, resetForm } from "../redux/actions/expenseActions";
import { Calendar, DollarSign, Tag, FileText, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export const ExpenseForm = () => {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "other",
    date: new Date().toISOString().split('T')[0]
  });

  const dispatch = useDispatch();
  const { editExpense, isEdit } = useSelector((state) => state.expenses);
  const { smartCategories } = useSelector((state) => state.ai);

  useEffect(() => {
    if (isEdit && editExpense) {
      setFormData({
        description: editExpense.description || "",
        amount: editExpense.amount?.toString() || "",
        category: editExpense.category || "other",
        date: editExpense.date ? new Date(editExpense.date).toISOString().split('T')[0] : ""
      });
    }
  }, [isEdit, editExpense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // AI-powered category suggestion
    if (name === 'description' && value.length > 3) {
      suggestCategory(value);
    }
  };

  const suggestCategory = (description) => {
    const keywords = {
      food: ['food', 'restaurant', 'meal', 'lunch', 'dinner', 'breakfast', 'pizza', 'burger', 'coffee'],
      transport: ['uber', 'taxi', 'bus', 'train', 'fuel', 'gas', 'metro', 'parking'],
      entertainment: ['movie', 'cinema', 'game', 'music', 'netflix', 'spotify', 'concert'],
      accommodation: ['hotel', 'rent', 'airbnb', 'room', 'stay'],
      activities: ['gym', 'sport', 'activity', 'class', 'course', 'workshop']
    };

    const lowerDesc = description.toLowerCase();
    for (const [category, words] of Object.entries(keywords)) {
      if (words.some(word => lowerDesc.includes(word))) {
        setFormData(prev => ({ ...prev, category }));
        toast.success(`Suggested category: ${category}`, { duration: 2000 });
        break;
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.description || !formData.amount || !formData.date) {
      toast.error('Please fill in all fields');
      return;
    }

    const expenseData = {
      ...formData,
      amount: Number(formData.amount)
    };

    if (isEdit && editExpense._id) {
      dispatch(updateExpense(editExpense._id, expenseData));
    } else {
      dispatch(addExpense(expenseData));
    }

    // Reset form
    setFormData({
      description: "",
      amount: "",
      category: "other",
      date: new Date().toISOString().split('T')[0]
    });
    dispatch(resetForm());
  };

  const categories = [
    { value: 'food', label: 'Food & Dining', icon: '🍽️' },
    { value: 'transport', label: 'Transportation', icon: '🚗' },
    { value: 'entertainment', label: 'Entertainment', icon: '🎬' },
    { value: 'accommodation', label: 'Accommodation', icon: '🏨' },
    { value: 'activities', label: 'Activities', icon: '⚽' },
    { value: 'other', label: 'Other', icon: '📦' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 rounded-2xl shadow-xl p-6 backdrop-blur-md border border-white/20"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
          <Sparkles className="text-white" size={20} />
        </div>
        <h2 className="text-xl font-bold text-gray-800">
          {isEdit ? 'Update Expense' : 'Add New Expense'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Calendar size={16} />
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all duration-300 bg-white/80"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <DollarSign size={16} />
              Amount
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all duration-300 bg-white/80"
              required
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FileText size={16} />
            Description
          </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="What did you spend on?"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all duration-300 bg-white/80"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Tag size={16} />
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all duration-300 bg-white/80"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-center pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isEdit ? 'Update Expense' : 'Add Expense'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};