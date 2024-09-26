import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from '../Redux/user/userSlice';
import tracksReducer from '../Redux/user/tracksSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';


const rootReducer = combineReducers({
  user: userReducer,
  tracks: tracksReducer,
 
});
const persistConfig ={
  key: 'root',
  version: 1,
  storage, 
  whitelist: ['user'], // We'll only persist the user state
}
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
     serializableCheck: false,
   }),
});

export const persistor = persistStore(store);
