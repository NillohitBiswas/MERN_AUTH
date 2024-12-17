import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export function CommentNavigation({ currentIndex, totalComments, onScroll }) {
  if (totalComments <= 1) return null;

  return (
    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
      <button
        onClick={() => onScroll('up')}
        disabled={currentIndex === 0}
        className="p-1 bg-lime-400 text-black rounded-full hover:bg-lime-600 focus:outline-none disabled:opacity-50"
        aria-label="Previous comment"
      >
        <ChevronUp size={20} />
      </button>
      <button
        onClick={() => onScroll('down')}
        disabled={currentIndex === totalComments - 1}
        className="p-1 bg-lime-400 text-black rounded-full hover:bg-lime-600 focus:outline-none disabled:opacity-50"
        aria-label="Next comment"
      >
        <ChevronDown size={20} />
      </button>
    </div>
  );
}