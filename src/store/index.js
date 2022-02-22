import { configureStore } from '@reduxjs/toolkit'
import userSlice from './stateSlice/userSlice'

export default configureStore({
  reducer: {
    user: userSlice,
  },
})
