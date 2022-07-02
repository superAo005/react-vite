import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    info: {},
    base_url: 'http://39.105.10.134:8999/api/hn/bpsa',
  },
  reducers: {
    setInfo: (state, action) => {
      state.info = action.payload
      state.base_url = 'http://39.105.10.134:8999/api/hn/bpsa'
    },
  },
})

// Action creators are generated for each case reducer function
export const { setInfo } = userSlice.actions

export default userSlice.reducer
