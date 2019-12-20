import { combineReducers } from 'redux';
import auth from './reducers/auth';
import order from './reducers/order';
import pickedOrder from './reducers/pickedOrder';

export default combineReducers({
  auth,
  order,
  pickedOrder
});
