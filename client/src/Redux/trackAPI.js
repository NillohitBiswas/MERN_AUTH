import { createAsyncThunk } from '@reduxjs/toolkit';
import { updateTrackStats, addCommentSuccess, fetchCommentsSuccess,
  likeTrackStart,
  likeTrackSuccess,
  likeTrackFailure,
  dislikeTrackStart,
  dislikeTrackSuccess,
  dislikeTrackFailure,
 } from "./user/tracksSlice";

export const incrementPlayCount = createAsyncThunk(
  'tracks/incrementPlayCount',
  async (trackId, thunkAPI) => {
    try {
      const res = await fetch(`/api/tracks/${trackId}/play`, { method: 'POST' });
      if (!res.ok) {
        throw new Error('Failed to increment play count');
      }
      const data = await res.json();
      thunkAPI.dispatch(updateTrackStats({ trackId, ...data }));
      return data;
    } catch (error) {
      console.error('Error incrementing play count:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const likeTrack = createAsyncThunk(
  'tracks/likeTrack',
  async (trackId, thunkAPI) => {
    const state = thunkAPI.getState();
    const track = state.tracks.allTracks.find(track => track._id === trackId);
    
    // Optimistically update the state
    const userId = localStorage.getItem('userId'); // Assuming you have userId stored in localStorage
    const newLikes = track.likes.includes(userId) 
      ? track.likes.filter(id => id !== userId) 
      : [...track.likes, userId];

    thunkAPI.dispatch(likeTrackSuccess({ trackId, likes: newLikes, dislikes: track.dislikes }));

    try {
      thunkAPI.dispatch(likeTrackStart());
      const response = await fetch(`/api/tracks/${trackId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to like track');
      }

      thunkAPI.dispatch(likeTrackSuccess(data));
      return data;
    } catch (error) {
      thunkAPI.dispatch(likeTrackFailure(error.message));
      throw error;
    }
  }
);

export const dislikeTrack = createAsyncThunk(
  'tracks/dislikeTrack',
  async (trackId, thunkAPI) => {
    const state = thunkAPI.getState();
    const track = state.tracks.allTracks.find(track => track._id === trackId);
    
    // Optimistically update the state
    const userId = localStorage.getItem('userId'); // Assuming you have userId stored in localStorage
    const newDislikes = track.dislikes.includes(userId) 
      ? track.dislikes.filter(id => id !== userId) 
      : [...track.dislikes, userId];

    thunkAPI.dispatch(dislikeTrackSuccess({ trackId, likes: track.likes, dislikes: newDislikes }));

    try {
      thunkAPI.dispatch(dislikeTrackStart());
      const response = await fetch(`/api/tracks/${trackId}/dislike`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to dislike track');
      }

      thunkAPI.dispatch(dislikeTrackSuccess(data));
      return data;
    } catch (error) {
      thunkAPI.dispatch(dislikeTrackFailure(error.message));
      throw error;
    }
  }
);


export const shareTrack = createAsyncThunk(
  'tracks/shareTrack',
  async (trackId, thunkAPI) => {
    try {
      const res = await fetch(`/api/tracks/${trackId}/share`, { method: 'POST' });
      if (!res.ok) {
        throw new Error('Failed to share track');
      }
      const data = await res.json();
      thunkAPI.dispatch(updateTrackStats({ trackId, ...data }));
      return data;
    } catch (error) {
      console.error('Error sharing track:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addComment = createAsyncThunk(
  'tracks/addComment',
  async ({ trackId, text }, thunkAPI) => {
    try {
      const response = await fetch(`/api/tracks/${trackId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add comment');
      }

      const data = await response.json();
      thunkAPI.dispatch(addCommentSuccess({ trackId, comment: data }));
      return data;
    } catch (error) {
      console.error('Error adding comment:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getComments = createAsyncThunk(
  'tracks/getComments',
  async (trackId, thunkAPI) => {
    try {
      const res = await fetch(`/api/tracks/${trackId}/comments`);
      if (!res.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await res.json();
      thunkAPI.dispatch(fetchCommentsSuccess({ trackId, comments: data }));
      return data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);