import React from 'react';
import { User, Trash2 } from 'lucide-react';

export function Comment({ comment, currentUser, onDelete, isDeleting }) {
  const canDelete = currentUser && (
    currentUser._id === comment.user || // Check user ID
    currentUser.id === comment.user     // Fallback check
  );

  return (
    <div className="flex items-start space-x-4">
      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
        <User className="w-6 h-6 text-gray-500" />
      </div>
      <div className="text-white flex-grow">
        <p className="font-semibold">{comment.username || 'Anonymous'}</p>
        <p className="text-sm text-muted-foreground">
          {comment.createdAt 
            ? new Date(comment.createdAt).toLocaleString() 
            : 'Unknown date'}
        </p>
        <p className="mt-1">{comment.text}</p>
      </div>
      {canDelete && (
        <button
          onClick={() => onDelete(comment._id)}
          disabled={isDeleting}
          className="py-7 px-12 text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors"
          aria-label="Delete comment"
        >
          <Trash2 size={20} />
        </button>
      )}
    </div>
  );
}