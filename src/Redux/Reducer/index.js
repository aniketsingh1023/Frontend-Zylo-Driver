import {combineReducers} from 'redux';
import UserinfoReducer from './UserinfoReducer';
import loadingReducer from './loadingRedux';

const appReducer = combineReducers({
  Userinfo: UserinfoReducer,
  loading: loadingReducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'RESET_APP') {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
