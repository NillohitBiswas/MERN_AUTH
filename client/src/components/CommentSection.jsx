import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addComment, getComments, deleteComment } from '../Redux/trackAPI';
import { toast } from 'react-toastify';
import { Comment } from './Comments/Comment';
import { CommentNavigation } from './Comments/CommentNavigation';
import { CommentForm } from './Comments/CommentForm';

export function CommentSection({ trackId }) {
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { allTracks, loading } = useSelector((state) => state.tracks);

  useEffect(() => {
    if (trackId) {
      dispatch(getComments(trackId));
    }
  }, [dispatch, trackId]);

  const track = allTracks?.find(track => track._id === trackId);
  const comments = track?.comments || [];

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    if (!currentUser) {
      toast.error('Please log in to comment');
      return;
    }

    try {
      setError(null);
      await dispatch(addComment({ trackId, text: commentText })).unwrap();
      setCommentText('');
      toast.success('Comment added successfully');
    } catch (err) {
      setError('Failed to post comment. Please try again.');
      toast.error(err.message || 'Failed to post comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!currentUser || isDeleting || !commentId) return;

    try {
      setIsDeleting(true);
      setError(null);
      await dispatch(deleteComment({ trackId, commentId })).unwrap();
      setCurrentIndex(prevIndex => Math.min(prevIndex, comments.length - 2));
      toast.success('Comment deleted successfully');
    } catch (err) {
      const errorMessage = err.message || 'An error occurred while deleting the comment';
      if (errorMessage.toLowerCase().includes('permission')) {
        toast.error('You can only delete your own comments');
      } else {
        setError(`Failed to delete comment: ${errorMessage}`);
        toast.error('Failed to delete comment');
      }
      console.error('Error deleting comment:', err);
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleScroll = (direction) => {
    if (direction === 'up') {
      setCurrentIndex(prev => Math.max(0, prev - 1));
    } else {
      setCurrentIndex(prev => Math.min(comments.length - 1, prev + 1));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-lime-400">Loading comments...</div>
      </div>
    );
  }

  const currentComment = comments[currentIndex];

  return (
    <div className="mt-5">
      <h3 className="text-lg text-lime-600 font-semibold mb-4">Comments</h3>
      
      {currentUser ? (
        <CommentForm
          onSubmit={handleSubmitComment}
          commentText={commentText}
          setCommentText={setCommentText}
        />
      ) : (
        <p className="mb-4 text-white text-muted-foreground">Please log in to comment.</p>
      )}

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="space-y-4">
        {comments.length > 0 && currentComment ? (
          <div className="relative">
            <Comment
              comment={currentComment}
              currentUser={currentUser}
              onDelete={handleDeleteComment}
              isDeleting={isDeleting}
            />
            <CommentNavigation
              currentIndex={currentIndex}
              totalComments={comments.length}
              onScroll={handleScroll}
            />
          </div>
        ) : (
          <p className="text-white">No comments yet.</p>
        )}
      </div>

      {comments.length > 0 && (
        <p className="text-sm text-white mt-2">
          Comment {currentIndex + 1} of {comments.length}
        </p>
      )}
    </div>
  );
}