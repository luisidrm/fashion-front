import { configureStore, combineReducers } from '@reduxjs/toolkit'
import {
  persistStore, persistReducer,
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for webs
import cartReducer from '../app/(main)/cart/_slices/cartSlice'
import authReducer from '../app/(main)/account/_slice/authSlice'
import { authApi } from '../app/(main)/account/_service/authApi'
import { shopApi } from '@/app/(main)/shop/_service/shopApi'
import { categoriesApi } from '../app/(main)/admin/categories/_service/categoriesApi'
import { offersApi } from '../app/(main)/admin/offers/_service/offersApi'

const rootReducer = combineReducers({
  cart: cartReducer,
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
  [shopApi.reducerPath]: shopApi.reducer,
  [categoriesApi.reducerPath]: categoriesApi.reducer,
  [offersApi.reducerPath]: offersApi.reducer,
})

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart', 'auth'], // ← cart and auth are persisted across sessions
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(authApi.middleware)
    .concat(shopApi.middleware)
    .concat(categoriesApi.middleware)
    .concat(offersApi.middleware),
})

export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch