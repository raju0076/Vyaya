import { SET_BUDGET } from '../actionTypes.js';

export const setBudget = (budget) => ({
  type: SET_BUDGET,
  payload: budget
});