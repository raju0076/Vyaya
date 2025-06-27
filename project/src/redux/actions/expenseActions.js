import axios from 'axios';
import {
  ADD_EXPENSE,
  DELETE_EXPENSE,
  EDIT_EXPENSE,
  SET_EXPENSES,
  SET_EDIT_EXPENSE,
  RESET_FORM,
  SET_LOADING,
  SET_ERROR
} from '../actionTypes.js';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

// Set loading state
export const setLoading = (loading) => ({
  type: SET_LOADING,
  payload: loading
});

// Set error state
export const setError = (error) => ({
  type: SET_ERROR,
  payload: error
});

// Get all expenses
export const getExpenses = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true));
    const token = getState().auth.token;
    
    const response = await axios.get(`${API_URL}/expenses`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    dispatch({
      type: SET_EXPENSES,
      payload: response.data
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    dispatch(setError(error.response?.data?.message || 'Error fetching expenses'));
    toast.error('Failed to load expenses');
  }
};

// Add new expense
export const addExpense = (expenseData) => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true));
    const token = getState().auth.token;
    
    const response = await axios.post(`${API_URL}/expenses`, expenseData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    dispatch({
      type: ADD_EXPENSE,
      payload: response.data
    });
    
    toast.success('Expense added successfully!');
    
    // Get AI insights after adding expense
    dispatch(getAIInsights());
  } catch (error) {
    console.error('Error adding expense:', error);
    dispatch(setError(error.response?.data?.message || 'Error adding expense'));
    toast.error('Failed to add expense');
  }
};

// Update expense
export const updateExpense = (id, expenseData) => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true));
    const token = getState().auth.token;
    
    const response = await axios.put(`${API_URL}/expenses/${id}`, expenseData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    dispatch({
      type: EDIT_EXPENSE,
      payload: response.data
    });
    
    toast.success('Expense updated successfully!');
  } catch (error) {
    console.error('Error updating expense:', error);
    dispatch(setError(error.response?.data?.message || 'Error updating expense'));
    toast.error('Failed to update expense');
  }
};

// Delete expense
export const deleteExpense = (id) => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true));
    const token = getState().auth.token;
    
    await axios.delete(`${API_URL}/expenses/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    dispatch({
      type: DELETE_EXPENSE,
      payload: id
    });
    
    toast.success('Expense deleted successfully!');
  } catch (error) {
    console.error('Error deleting expense:', error);
    dispatch(setError(error.response?.data?.message || 'Error deleting expense'));
    toast.error('Failed to delete expense');
  }
};

// Set expense for editing
export const setEditExpense = (expense) => ({
  type: SET_EDIT_EXPENSE,
  payload: expense
});

// Reset form
export const resetForm = () => ({
  type: RESET_FORM
});

// Get AI insights
export const getAIInsights = () => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;
    const expenses = getState().expenses.expenses;
    
    if (expenses.length === 0) return;
    
    const response = await axios.post(`${API_URL}/ai/insights`, 
      { expenses },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    dispatch({
      type: 'SET_AI_INSIGHTS',
      payload: response.data
    });
  } catch (error) {
    console.error('Error getting AI insights:', error);
  }
};