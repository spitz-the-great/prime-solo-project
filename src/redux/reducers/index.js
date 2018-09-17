import { combineReducers } from 'redux';
import user from './userReducer';
import login from './loginReducer';
import profileReducer from './profileReducer';

const store = combineReducers({
  user,
  login,
  profileReducer,
});

export default store;
