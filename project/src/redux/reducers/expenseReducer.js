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

const initialState = {
  expenses: [],
  editExpense: {},
  isEdit: false,
  loading: false,
  error: null
};

const expenseReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_EXPENSES:
      return {
        ...state,
        expenses: action.payload.expenses || action.payload,
        loading: false,
        error: null
      };
    case ADD_EXPENSE:
      return {
        ...state,
        expenses: [action.payload, ...state.expenses],
        loading: false,
        error: null
      };
    case DELETE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense._id !== action.payload),
        loading: false,
        error: null
      };
    case EDIT_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.map(expense =>
          expense._id === action.payload._id ? action.payload : expense
        ),
        editExpense: {},
        isEdit: false,
        loading: false,
        error: null
      };
    case SET_EDIT_EXPENSE:
      return {
        ...state,
        editExpense: action.payload,
        isEdit: true
      };
    case RESET_FORM:
      return {
        ...state,
        editExpense: {},
        isEdit: false
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
};

export default expenseReducer;