// src/app/store.js
import { configureStore } from '@reduxjs/toolkit'
import shipmentsReducer from '../features/shipments/shipmentsSlice'

export const store = configureStore({
  reducer: {
    shipments: shipmentsReducer,
  },
})
