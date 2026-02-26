import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import request from '../utils/request'

// 异步 thunk actions
export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await request.post('/api/auth/login', credentials)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Login failed')
    }
  }
)

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState()
      const response = await request.get('/api/user/profile', {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch profile')
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null
  },
  reducers: {
    logout: (state) => {
      state.userInfo = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.userInfo = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isAuthenticated = false
      })
      // Fetch profile cases
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.userInfo = action.payload
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.error = action.payload
      })
  }
})

export const { logout, clearError } = userSlice.actions
export default userSlice.reducer