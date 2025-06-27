import { LOGIN_SUCCESS, LOGOUT, REGISTER_SUCCESS } from '../actionTypes.js';

const initialState = {
  token: localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user')) || null,
  isAuthenticated: !!localStorage.getItem('token')
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true
      };
    case LOGOUT:
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('totalBudget');
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false
      };
    default:
      return state;
  }
};

export default authReducer;