import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Brain, TrendingUp, AlertCircle, Target, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { getAIInsights } from '../redux/actions/expenseActions';

export const AIInsights = () => {
  const dispatch = useDispatch();
  const { expenses } = useSelector(state => state.expenses);
  const { insights, loading } = useSelector(state => state.ai);

  useEffect(() => {
    if (expenses.length > 0) {
      dispatch(getAIInsights());
    }
  }, [expenses, dispatch]);

  const generateLocalInsights = () => {
    if (expenses.length === 0) return null;

    const categories = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const avgExpense = totalSpent / expenses.length;
    const topCategory = Object.entries(categories).reduce((a, b) => a[1] > b[1] ? a : b)[0];

    return {
      totalSpent,
      avgExpense,
      topCategory,
      categories,
      trends: generateTrends(),
      recommendations: generateRecommendations(categories, totalSpent)
    };
  };

  const generateTrends = () => {
    if (expenses.length < 2) return [];
    
    const last7Days = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return expenseDate >= weekAgo;
    });

    const prev7Days = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const twoWeeksAgo = new Date();
      const weekAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return expenseDate >= twoWeeksAgo && expenseDate < weekAgo;
    });

    const currentTotal = last7Days.reduce((sum, expense) => sum + expense.amount, 0);
    const previousTotal = prev7Days.reduce((sum, expense) => sum + expense.amount, 0);
    
    const change = previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0;

    return [{
      period: 'Last 7 days',
      change: change.toFixed(1),
      trend: change > 0 ? 'increase' : 'decrease'
    }];
  };

  const generateRecommendations = (categories, totalSpent) => {
    const recommendations = [];
    
    const topSpending = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];
    if (topSpending && topSpending[1] > totalSpent * 0.4) {
      recommendations.push({
        type: 'warning',
        message: `You're spending ${((topSpending[1] / totalSpent) * 100).toFixed(1)}% of your budget on ${topSpending[0]}. Consider setting a limit for this category.`
      });
    }

    if (categories.food && categories.food > totalSpent * 0.3) {
      recommendations.push({
        type: 'tip',
        message: 'Try meal planning and cooking at home to reduce food expenses by 20-30%.'
      });
    }

    if (expenses.length > 10) {
      recommendations.push({
        type: 'insight',
        message: `Your average expense is ₹${(totalSpent / expenses.length).toFixed(0)}. Small expenses add up!`
      });
    }

    return recommendations;
  };

  const localInsights = generateLocalInsights();

  if (!localInsights) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 rounded-2xl shadow-xl p-6 backdrop-blur-md border border-white/20"
      >
        <div className="text-center py-8">
          <Brain className="mx-auto text-purple-400 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">AI Insights Coming Soon</h3>
          <p className="text-gray-500">Add some expenses to see personalized insights and recommendations</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 rounded-2xl shadow-xl p-6 backdrop-blur-md border border-white/20"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg">
          <Brain className="text-white" size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">AI Insights</h2>
          <p className="text-sm text-gray-600">Smart analysis of your spending patterns</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white/60 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white/30"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Top Category</p>
              <p className="font-bold text-lg capitalize">{localInsights.topCategory}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white/60 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white/30"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Expense</p>
              <p className="font-bold text-lg">₹{localInsights.avgExpense.toFixed(0)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white/60 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white/30"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Zap className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="font-bold text-lg">₹{localInsights.totalSpent.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {localInsights.trends.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <TrendingUp size={18} />
            Spending Trends
          </h3>
          {localInsights.trends.map((trend, index) => (
            <div key={index} className="bg-white/50 rounded-lg p-3 border border-white/30">
              <p className="text-sm text-gray-600">{trend.period}</p>
              <p className={`font-semibold ${trend.trend === 'increase' ? 'text-red-600' : 'text-green-600'}`}>
                {trend.change}% {trend.trend} from previous period
              </p>
            </div>
          ))}
        </div>
      )}

      {localInsights.recommendations.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <AlertCircle size={18} />
            Smart Recommendations
          </h3>
          <div className="space-y-3">
            {localInsights.recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border-l-4 ${
                  rec.type === 'warning' 
                    ? 'bg-red-50 border-red-400 text-red-800'
                    : rec.type === 'tip'
                    ? 'bg-blue-50 border-blue-400 text-blue-800'
                    : 'bg-green-50 border-green-400 text-green-800'
                }`}
              >
                <p className="text-sm">{rec.message}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};