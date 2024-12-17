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
    updateTrackStats: (state, action) => {
      const { trackId, playCount, likes, dislikes, shareCount } = action.payload;
      const updateTrack = (track) => {
        if (track._id === trackId) {
          return { ...track, playCount, shareCount,
            likes: Array.isArray(likes) ? likes : [],
            dislikes: Array.isArray(dislikes) ? dislikes : []
           };
        }
        return track;
      };
      state.userTracks = Array.isArray(state.userTracks) 
        ? state.userTracks.map(updateTrack)
        : [];
      state.allTracks = state.allTracks.map(updateTrack);
    },

    likeTrackStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    likeTrackSuccess: (state, action) => {
      const { trackId, likes, dislikes } = action.payload;
      const updateTrack = (track) => {
        if (track._id === trackId) {
          return { ...track, likes, dislikes };
        }
        return track;
      };
      state.userTracks = Array.isArray(state.userTracks) 
      ? state.userTracks.map(updateTrack)
      : [];
     state.allTracks = state.allTracks.map(updateTrack);
      state.loading = false;
    },
    likeTrackFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    dislikeTrackStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    dislikeTrackSuccess: (state, action) => {
      const { trackId, likes, dislikes } = action.payload;
      const updateTrack = (track) => {
        if (track._id === trackId) {
          return { ...track, likes, dislikes };
        }
        return track;
      };
      state.userTracks = Array.isArray(state.userTracks) 
      ? state.userTracks.map(updateTrack)
      : [];
     state.allTracks = state.allTracks.map(updateTrack);
      state.loading = false;
    },
    dislikeTrackFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  
    addCommentSuccess: (state, action) => {
      const { trackId, comment } = action.payload;
      const updateTrack = (track) => {
        if (track._id === trackId) {
          return { 
            ...track, 
            comments: [...(track.comments || []), {
              _id: comment._id,
              user: comment.user,
              username: comment.username,
              text: comment.text,
              createdAt: comment.createdAt
            }]
          };
        }
        return track;
      };
      state.userTracks = Array.isArray(state.userTracks) 
      ? state.userTracks.map(updateTrack)
      : [];
    state.allTracks = state.allTracks.map(updateTrack);
    },
    fetchCommentsSuccess: (state, action) => {
      const { trackId, comments } = action.payload;
      const updateTrack = (track) => {
        if (track._id === trackId) {
          return { 
            ...track, 
            comments: comments.map(comment => ({
              _id: comment._id,
              user: comment.user,
              username: comment.username,
              text: comment.text,
              createdAt: comment.createdAt
            }))
          };
        }
        return track;
      };
      state.userTracks = Array.isArray(state.userTracks) 
      ? state.userTracks.map(updateTrack)
      : [];
    state.allTracks = state.allTracks.map(updateTrack);
    },
    deleteCommentSuccess: (state, action) => {
      const { trackId, commentId } = action.payload;
      const updateTrack = (track) => {
        if (track._id === trackId) {
          return {
            ...track,
            comments: track.comments.filter(comment => comment._id !== commentId)
          };
        }
        return track;
      };
      state.userTracks = Array.isArray(state.userTracks) 
      ? state.userTracks.map(updateTrack)
      : [];
    state.allTracks = state.allTracks.map(updateTrack);
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
  updateTrackStats,
  addCommentSuccess,
  fetchCommentsSuccess,
  deleteCommentSuccess,
  likeTrackStart,
  likeTrackSuccess,
  likeTrackFailure,
  dislikeTrackStart,
  dislikeTrackSuccess,
  dislikeTrackFailure,
} = trackSlice.actions;

export default trackSlice.reducer;