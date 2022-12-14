import { configureStore, combineReducers, getDefaultMiddleware } from '@reduxjs/toolkit'
import userSlice from './stateSlice/userSlice'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  // whitelist: ['user'],
}
const rootReducer = combineReducers({
  user: userSlice,
})
const persistedReducer = persistReducer(persistConfig, rootReducer)
export default configureStore({
  // reducer: {
  //   user: userSlice,
  // },
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
})
