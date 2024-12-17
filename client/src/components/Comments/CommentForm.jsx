import React from 'react';

export function CommentForm({ onSubmit, commentText, setCommentText }) {
  return (
    <form onSubmit={onSubmit} className="mb-4 flex">
      <input
        type="text"
        id="comment-input"
        name="comment"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Add a comment..."
        className="flex-grow p-2 border border-gray-200 rounded-l-md focus:outline-none focus:ring-2 focus:ring-lime-400"
        maxLength={500}
      />
      <button
        type="submit"
        disabled={!commentText.trim()}
        className="px-4 bg-lime-400 text-black rounded-r-md hover:bg-lime-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Post
      </button>
    </form>
  );
}