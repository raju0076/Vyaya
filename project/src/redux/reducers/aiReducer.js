import {
  SET_AI_INSIGHTS,
  SET_AI_LOADING,
  SET_EXPENSE_PREDICTION,
  SET_SMART_CATEGORIES
} from '../actionTypes.js';

const initialState = {
  insights: null,
  predictions: null,
  smartCategories: [],
  loading: false
};

const aiReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_AI_INSIGHTS:
      return {
        ...state,
        insights: action.payload,
        loading: false
      };
    case SET_EXPENSE_PREDICTION:
      return {
        ...state,
        predictions: action.payload,
        loading: false
      };
    case SET_SMART_CATEGORIES:
      return {
        ...state,
        smartCategories: action.payload,
        loading: false
      };
    case SET_AI_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

export default aiReducer;