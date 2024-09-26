import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userTracks: [],
  allTracks: [],
  loading: false,
  error: null,
};

const trackSlice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {
    fetchTracksStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUserTracksSuccess: (state, action) => {
      state.userTracks = action.payload;
      state.loading = false;
    },
    fetchAllTracksSuccess: (state, action) => {
      state.allTracks = action.payload;
      state.loading = false;
    },
    fetchTracksFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    uploadTrackStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    uploadTrackSuccess: (state, action) => {
      state.userTracks.push(action.payload);
      state.loading = false;
    },
    uploadTrackFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteTrackStart: (state) => {
      state.loading = true
      state.error = null
    },
    deleteTrackSuccess: (state, action) => {
      state.loading = false
      state.userTracks = state.userTracks.filter(track => track._id !== action.payload)
      state.allTracks = state.allTracks.filter(track => track._id !== action.payload)
    },
    deleteTrackFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
  },
});

export const {
  fetchTracksStart,
  fetchUserTracksSuccess,
  fetchAllTracksSuccess,
  fetchTracksFailure,
  uploadTrackStart,
  uploadTrackSuccess,
  uploadTrackFailure,
  deleteTrackStart,
  deleteTrackSuccess,
  deleteTrackFailure,
} = trackSlice.actions;

export default trackSlice.reducer;