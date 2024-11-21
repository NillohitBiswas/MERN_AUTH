'use client'

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BarChart2, ThumbsUp, ThumbsDown, Share2 } from 'lucide-react';
import { likeTrack, dislikeTrack } from '../Redux/trackAPI';

export function TrackStats({ track }) {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { allTracks } = useSelector((state) => state.tracks);

  // Find the current track in the Redux state
  const currentTrack = allTracks.find(t => t._id === track._id) || track;

  const handleLike = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Please log in to like tracks');
      return;
    }
    try {
      await dispatch(likeTrack(track._id)).unwrap();
    } catch (error) {
      console.error('Error liking track:', error);
      alert(error.message || 'Failed to like track. Please try again.');
    }
  };

  const handleDislike = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Please log in to dislike tracks');
      return;
    }
    try {
      await dispatch(dislikeTrack(track._id)).unwrap();
    } catch (error) {
      console.error('Error disliking track:', error);
      alert(error.message || 'Failed to dislike track. Please try again.');
    }
  };

  

  const isLiked = currentUser &&
                  Array.isArray(currentTrack.likes) &&
                  currentTrack.likes.includes(currentUser._id);
  const isDisliked = currentUser &&
                     Array.isArray(currentTrack.dislikes) &&
                     currentTrack.dislikes.includes(currentUser._id);

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center">
        <BarChart2 size={20} className="mr-1" />
        <span>{currentTrack.playCount || 0}</span>
      </div>
      <button
        onClick={handleLike}
        className={`flex items-center space-x-1 ${
          isLiked ? 'text-blue-500' : 'text-black'
        }`}
        aria-label={`Like ${currentTrack.title}`}
       >
        <ThumbsUp size={20} />
        <span>{Array.isArray(currentTrack.likes) ? currentTrack.likes.length : 0}</span>
      </button>
      <button
        onClick={handleDislike}
        className={`flex items-center space-x-1 ${
          isDisliked ? 'text-red-500' : 'text-black'
        }`}
        aria-label={`Dislike ${currentTrack.title}`}
       >
        <ThumbsDown size={20} />
        <span>{Array.isArray(currentTrack.dislikes) ? currentTrack.dislikes.length : 0}</span>
      </button>
      <div className="flex items-center space-x-1">
        <Share2 size={20}  className="mr-1" />
        <span>{currentTrack.shareCount || 0}</span>
      </div>
    </div>
  );
}