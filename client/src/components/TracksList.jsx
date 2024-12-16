import React, { useRef, useState, useEffect } from 'react';
import { FileMusic, CirclePause,CirclePlay, Trash2 } from 'lucide-react';

export default function TrackList({ tracks, showDelete = false, playTrack, currentTrack, isPlaying, handleDelete, loadMore, hasMore }) {
  const listRef = useRef(null);
  const [isFetching, setIsFetching] = useState(false);

  const handleScroll = () => {
    if (listRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 5 && !isFetching) {
        setIsFetching(true);
        loadMore();
      }
    }
  };

  useEffect(() => {
    setIsFetching(false);
  }, [tracks]);

  return (
    <div
      ref={listRef}
      className="h-[350px] overflow-y-auto pr-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-lime-600 [&::-webkit-scrollbar-thumb]:rounded-full [scrollbar-color:rgb(132,204,22)_rgb(31,41,55)] [scrollbar-width:thin]"
      onScroll={handleScroll}
    >
      <ul className="space-y-2">
        {tracks.map((track) => (
          <li
            key={track._id}
            className="flex justify-between items-center bg-gray-900 p-3 rounded-lg border border-lime-600 hover:bg-opacity-70 transition-all duration-300"
          >
            <div className="flex items-center">
              <FileMusic className="text-lime-400 mr-3" size={22} />
              <span className="font-mono text-white text-base ">{track.title} - <span className="text-lime-400">{track.artist}</span></span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => playTrack(track)}
                className="p-1 rounded-full bg-lime-500 text-black hover:bg-lime-300 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-opacity-50 transition-colors duration-300"
              >
                {currentTrack && currentTrack._id === track._id && isPlaying ? (
                  <CirclePause size={18} />
                ) : (
                  <CirclePlay size={18} />
                )}
              </button>
              
              {showDelete && (
                <button
                  onClick={() => handleDelete(track._id, track.filePath)}
                  className="p-1 rounded-full bg-red-500 text-black hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-300"
                  aria-label="Delete"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
      {isFetching && hasMore && (
        <div className="text-center py-4">
          <p className="text-lime-500">Loading more tracks...</p>
        </div>
      )}
      {!hasMore && tracks.length > 0 && (
        <div className="text-center py-4">
          <p className="text-lime-600">No more tracks to load</p>
        </div>
      )}
    </div>
  );
}