import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import request from '../utils/request'

// 异步 thunk actions
export const fetchHotels = createAsyncThunk(
  'hotel/fetchHotels',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await request.get('/api/hotels', { params })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch hotels')
    }
  }
)

export const searchHotels = createAsyncThunk(
  'hotel/searchHotels',
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await request.post('/api/hotels/search', searchParams)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Search failed')
    }
  }
)

export const fetchHotelDetail = createAsyncThunk(
  'hotel/fetchDetail',
  async (hotelId, { rejectWithValue }) => {
    try {
      const response = await request.get(`/api/hotels/${hotelId}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch hotel detail')
    }
  }
)

const hotelSlice = createSlice({
  name: 'hotel',
  initialState: {
    hotels: [],
    currentHotel: null,
    searchResults: [],
    loading: false,
    searchLoading: false,
    error: null
  },
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = []
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch hotels cases
      .addCase(fetchHotels.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.loading = false
        state.hotels = action.payload
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Search hotels cases
      .addCase(searchHotels.pending, (state) => {
        state.searchLoading = true
        state.error = null
      })
      .addCase(searchHotels.fulfilled, (state, action) => {
        state.searchLoading = false
        state.searchResults = action.payload
      })
      .addCase(searchHotels.rejected, (state, action) => {
        state.searchLoading = false
        state.error = action.payload
      })
      // Fetch hotel detail cases
      .addCase(fetchHotelDetail.fulfilled, (state, action) => {
        state.currentHotel = action.payload
      })
      .addCase(fetchHotelDetail.rejected, (state, action) => {
        state.error = action.payload
      })
  }
})

export const { clearSearchResults, clearError } = hotelSlice.actions
export default hotelSlice.reducer