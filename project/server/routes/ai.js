import express from 'express';
import Expense from '../models/Expense.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/insights', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(100);

    if (expenses.length === 0) {
      return res.json({ message: 'No expenses found for analysis' });
    }

    const insights = generateInsights(expenses);
    res.json(insights);
  } catch (error) {
    console.error('AI insights error:', error);
    res.status(500).json({ message: 'Server error generating insights' });
  }
});

router.post('/categorize', auth, async (req, res) => {
  try {
    const { description } = req.body;
    const suggestedCategory = categorizeExpense(description);
    res.json({ suggestedCategory });
  } catch (error) {
    console.error('Categorization error:', error);
    res.status(500).json({ message: 'Server error categorizing expense' });
  }
});

router.get('/budget-recommendations', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(30);

    const recommendations = generateBudgetRecommendations(expenses);
    res.json(recommendations);
  } catch (error) {
    console.error('Budget recommendations error:', error);
    res.status(500).json({ message: 'Server error generating recommendations' });
  }
});

function generateInsights(expenses) {
  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const avgExpense = totalAmount / expenses.length;
  const categoryStats = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});
  const topCategory = Object.entries(categoryStats).sort(([, a], [, b]) => b - a)[0];
  const weeklySpending = calculateWeeklyTrends(expenses);
  const patterns = analyzeSpendingPatterns(expenses);

  return {
    summary: {
      totalExpenses: expenses.length,
      totalAmount,
      avgExpense: Math.round(avgExpense),
      topCategory: topCategory ? topCategory[0] : 'none'
    },
    categoryBreakdown: categoryStats,
    trends: weeklySpending,
    patterns,
    recommendations: generateRecommendations(expenses, categoryStats)
  };
}

function calculateWeeklyTrends(expenses) {
  const weeks = {};
  expenses.forEach(expense => {
    const weekStart = new Date(expense.date);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekKey = weekStart.toISOString().split('T')[0];
    weeks[weekKey] = (weeks[weekKey] || 0) + expense.amount;
  });
  return Object.entries(weeks)
    .sort(([a], [b]) => new Date(b) - new Date(a))
    .slice(0, 4)
    .map(([week, amount]) => ({ week, amount }));
}

function analyzeSpendingPatterns(expenses) {
  const patterns = [];
  const categoryCount = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + 1;
    return acc;
  }, {});
  const mostFrequent = Object.entries(categoryCount).sort(([, a], [, b]) => b - a)[0];

  if (mostFrequent && mostFrequent[1] > expenses.length * 0.3) {
    patterns.push({
      type: 'frequency',
      message: `You spend most frequently on ${mostFrequent[0]} (${mostFrequent[1]} times)`
    });
  }

  const avgAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0) / expenses.length;
  const largeExpenses = expenses.filter(exp => exp.amount > avgAmount * 2);

  if (largeExpenses.length > 0) {
    patterns.push({
      type: 'large_expenses',
      message: `You have ${largeExpenses.length} expenses significantly above average`
    });
  }

  return patterns;
}

function generateRecommendations(expenses, categoryStats) {
  const recommendations = [];
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  Object.entries(categoryStats).forEach(([category, amount]) => {
    const percentage = (amount / total) * 100;
    if (percentage > 40) {
      recommendations.push({
        type: 'category_warning',
        category,
        message: `${category} represents ${percentage.toFixed(1)}% of your spending. Consider setting limits.`
      });
    }
  });

  if (expenses.length > 20) {
    const avgPerWeek = expenses.length / 4;
    if (avgPerWeek > 10) {
      recommendations.push({
        type: 'frequency',
        message: 'You have many small transactions. Consider consolidating purchases.'
      });
    }
  }

  return recommendations;
}

function categorizeExpense(description) {
  const keywords = {
    food: ['food', 'restaurant', 'meal', 'lunch', 'dinner', 'breakfast', 'pizza', 'burger', 'coffee', 'cafe', 'snack'],
    transport: ['uber', 'taxi', 'bus', 'train', 'fuel', 'gas', 'metro', 'parking', 'flight', 'petrol'],
    entertainment: ['movie', 'cinema', 'game', 'music', 'netflix', 'spotify', 'concert', 'show', 'theater'],
    accommodation: ['hotel', 'rent', 'airbnb', 'room', 'stay', 'lodge', 'hostel'],
    activities: ['gym', 'sport', 'activity', 'class', 'course', 'workshop', 'fitness', 'yoga']
  };
  const lowerDesc = description.toLowerCase();
  for (const [category, words] of Object.entries(keywords)) {
    if (words.some(word => lowerDesc.includes(word))) {
      return category;
    }
  }
  return 'other';
}

function generateBudgetRecommendations(expenses) {
  if (expenses.length === 0) {
    return { recommended: 5000, reasoning: 'Start with a basic budget' };
  }
  const monthlySpending = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const recommendedBudget = Math.ceil(monthlySpending * 1.2 / 1000) * 1000;
  return {
    recommended: recommendedBudget,
    current: monthlySpending,
    reasoning: `Based on your recent spending of ₹${monthlySpending}, we recommend a budget with 20% buffer`
  };
}

export default router;
