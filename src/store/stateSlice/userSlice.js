import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    info: {},
  },
  reducers: {
    setInfo: (state, action) => {
      state.info = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setInfo } = userSlice.actions

export default userSlice.reducer
