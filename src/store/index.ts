import { configureStore, combineReducers } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
} from 'redux-persist'
import counterReducer from './slices/counterSlice'

const rootReducer = combineReducers({
  counter: counterReducer,
})

const makeStore = () => {
  // Guard: only use localStorage on the client
  const persistConfig = {
    key: 'root',
    storage: typeof window !== 'undefined'
      ? require('redux-persist/lib/storage').default
      : require('redux-persist/lib/storage/session').default,
    whitelist: ['counter'],
  }

  const persistedReducer = persistReducer(persistConfig, rootReducer)

  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  })

  const persistor = persistStore(store)
  return { store, persistor }
}

export const { store, persistor } = makeStore()

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch