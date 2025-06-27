import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import expenseReducer from './reducers/expenseReducer.js';
import budgetReducer from './reducers/budgetReducer.js';
import authReducer from './reducers/authReducer.js';
import aiReducer from './reducers/aiReducer.js';

const rootReducer = combineReducers({
  expenses: expenseReducer,
  budget: budgetReducer,
  auth: authReducer,
  ai: aiReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;