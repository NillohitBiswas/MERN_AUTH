import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addComment, getComments } from '../Redux/trackAPI';
import { User } from 'lucide-react';

export function CommentSection({ trackId }) {
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { allTracks, loading } = useSelector((state) => state.tracks);

  useEffect(() => {
    dispatch(getComments(trackId));
  }, [dispatch, trackId]);

  const track = allTracks.find(track => track._id === trackId);
  const comments = track?.comments || [];

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (commentText.trim() && currentUser) {
      try {
        setError(null);
        await dispatch(addComment({ trackId, text: commentText })).unwrap();
        setCommentText('');
      } catch (err) {
        setError('Failed to post comment. Please try again.');
      }
    }
  };

  if (loading) {
    return <div>Loading comments...</div>;
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Comments</h3>
      {currentUser ? (
        <form onSubmit={handleSubmitComment} className="mb-4 flex">
          <input
            type="text"
            id="comment-input" // Added id attribute
            name="comment" // Added name attribute
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none"
          >
            Post
          </button>
        </form>
      ) : (
        <p className="mb-4 text-muted-foreground">Please log in to comment.</p>
      )}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="space-y-4">
        {comments.map((comment, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-6 h-6 text-gray-500" />
            </div>
            <div>
              <p className="font-semibold">{comment.username || 'Anonymous'}</p>
              <p className="text-sm text-muted-foreground">
                {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : 'Unknown date'}
              </p>
              <p className="mt-1">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}