import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistReducer, persistStore} from 'redux-persist';
import ReduxThunk from 'redux-thunk';

import reducer from '../Reducer';
import {applyMiddleware, compose, createStore} from 'redux';

const persistConfig = {
  timeout: 2000,
  key: 'appStateVer_54',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, reducer);
const enhancer = compose(applyMiddleware(ReduxThunk));

export default function configureStore(initialState) {
  const store = createStore(persistedReducer, initialState, enhancer);
  const persistor = persistStore(store);
  return {store, persistor};
}
