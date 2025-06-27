import { SET_BUDGET } from '../actionTypes.js';

const initialState = {
  budget: Number(localStorage.getItem('totalBudget')) || 0
};

const budgetReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_BUDGET:
      localStorage.setItem('totalBudget', action.payload);
      return {
        ...state,
        budget: action.payload
      };
    default:
      return state;
  }
};

export default budgetReducer;