import { combineReducers } from 'redux';
import auth from './reducers/auth';
import order from './reducers/order';

export default combineReducers({
  auth,
  order
});
