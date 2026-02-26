import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import hotelReducer from './hotelSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    hotel: hotelReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    })
})