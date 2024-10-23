'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ref, getStorage, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage"
import { app } from '../Firebase.js'
import { CirclePlay, CirclePause, Trash, CloudUpload, User, Music, FileMusic } from 'lucide-react'
import {
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
} from '../Redux/user/tracksSlice'

import InfiniteScroll from 'react-infinite-scroll-component';
import { SearchBar } from '../components/Searchbar.jsx'
import CircularSlider from '../components/CircularSlider.jsx'


export default function Tracks() {
  const [activeTab, setActiveTab] = useState('all')
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [uploadMessage, setUploadMessage] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [currentTrack, setCurrentTrack] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [audioReady, setAudioReady] = useState(false)
  const audioRef = useRef(null)

  const [allTracksPage, setAllTracksPage] = useState(1);
  const [userTracksPage, setUserTracksPage] = useState(1);
  const [hasMoreAllTracks, setHasMoreAllTracks] = useState(true);
  const [hasMoreUserTracks, setHasMoreUserTracks] = useState(true);

  const [filteredTracks, setFilteredTracks] = useState([])

  const dispatch = useDispatch()
  const { currentUser } = useSelector((state) => state.user)
  const { userTracks, allTracks, loading, error } = useSelector((state) => state.tracks)

  useEffect(() => {
    fetchAllTracks()
    if (currentUser) {
      fetchUserTracks()
    }
  }, [currentUser])

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.addEventListener('timeupdate', handleTimeUpdate)
      audio.addEventListener('loadedmetadata', handleLoadedMetadata)
      audio.addEventListener('ended', handleTrackEnded)
    }
    return () => {
      if (audio) {
        audio.removeEventListener('timeupdate', handleTimeUpdate)
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
        audio.removeEventListener('ended', handleTrackEnded)
      }
    }
  }, [])

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.fileUrl
      audioRef.current.load()
      setAudioReady(true)
    }
  }, [currentTrack])

  useEffect(() => {
    if (audioReady && isPlaying) {
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error)
        setIsPlaying(false)
      })
    }
  }, [audioReady, isPlaying])


  const fetchAllTracks = async () => {
    dispatch(fetchTracksStart());
    try {
      const res = await fetch(`/api/tracks/all?page=${allTracksPage}&limit=2`);
      const data = await res.json();
      dispatch(fetchAllTracksSuccess(allTracksPage === 1 ? data : [...allTracks, ...data]));
      setHasMoreAllTracks(data.length = 1);
      setAllTracksPage(prevPage => prevPage + 1);
    } catch (error) {
      dispatch(fetchTracksFailure(error instanceof Error ? error.message : 'An unknown error occurred'));
    }
  };

  const fetchUserTracks = async () => {
    if (!currentUser) return;
    dispatch(fetchTracksStart());
    try {
      const res = await fetch(`/api/tracks/user?page=${userTracksPage}&limit=2`, {
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        }
      });
      const data = await res.json();
      dispatch(fetchUserTracksSuccess(userTracksPage === 1 ? data : [...userTracks, ...data]));
      setHasMoreUserTracks(data.length = 1);
      setUserTracksPage(prevPage => prevPage + 1);
    } catch (error) {
      dispatch(fetchTracksFailure(error instanceof Error ? error.message : 'An unknown error occurred'));
    }
  };

  useEffect(() => {
    if (activeTab === 'all') {
      setAllTracksPage(1);
      setHasMoreAllTracks(false);
      fetchAllTracks();
    } else if (activeTab === 'user') {
      setUserTracksPage(1);
      setHasMoreUserTracks(false);
      fetchUserTracks();
    }
  }, [activeTab, currentUser]);

  const loadMore = () => {
    if (activeTab === 'all') {
      fetchAllTracks();
    } else if (activeTab === 'user') {
      fetchUserTracks();
    }
  };


  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!currentUser) {
      setUploadMessage('Please log in to upload a song.')
      return
    }

    if (!file || !title || !artist) {
      setUploadMessage('Please provide all required fields.')
      return
    }

    dispatch(uploadTrackStart())
    const storage = getStorage(app);
    const storageRef = ref(storage, `tracks/${currentUser.id}/${file.name}`)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setUploadProgress(progress)
      }, 
      (error) => {
        console.error('Error uploading file:', error)
        dispatch(uploadTrackFailure(error instanceof Error ? error.message : 'An unknown error occurred'))
        setUploadMessage('Error uploading file. Please try again.')
      }, 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          saveTrackToDatabase(downloadURL, `tracks/${currentUser.id}/${file.name}`)
        })
      }
    )
  }

  const saveTrackToDatabase = async (fileUrl, filePath) => {
    if (!currentUser) return
    try {
      const res = await fetch('/api/tracks/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({
          title,
          artist,
          fileUrl,
          filePath,
        })
      })

      if (res.ok) {
        const data = await res.json()
        dispatch(uploadTrackSuccess(data))
        setUploadMessage('Song uploaded successfully!')
        setFile(null)
        setTitle('')
        setArtist('')
        setUploadProgress(0)
        fetchUserTracks()
        fetchAllTracks()
      } else {
        dispatch(uploadTrackFailure('Error saving track information'))
        setUploadMessage('Error saving track information. Please try again.')
      }
    } catch (error) {
      dispatch(uploadTrackFailure(error instanceof Error ? error.message : 'An unknown error occurred'))
      setUploadMessage('Error saving track information. Please try again.')
    }
  }

  const handleDelete = async (trackId, filePath) => {
    if (!currentUser) return
    dispatch(deleteTrackStart())
    try {
      // Delete the file from Firebase Storage
     const storage = getStorage(app);
     const fileRef = ref(storage, filePath);
     await deleteObject(fileRef);

      const res = await fetch(`/api/tracks/delete/${trackId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        }
      })

      if (res.ok) {
        const data = await res.json();
        console.log('Server response:', data);
        dispatch(deleteTrackSuccess(trackId))
        setUploadMessage('Track deleted successfully!')
        
      } else {
        
        throw new Error('Failed to delete track')
      }
    } catch (error) {
      console.error('Error in handleDelete:', error);
      dispatch(deleteTrackFailure(error instanceof Error ? error.message : 'An unknown error occurred'))
      setUploadMessage('Error deleting track. Please try again.')
    }
  }

  const playTrack = (track) => {
    if (currentTrack && currentTrack._id === track._id) {
      // If it's the same track, just toggle play/pause
      togglePlayPause()
    } else {
      // If it's a new track, update currentTrack
      setCurrentTrack(track)
      setIsPlaying(true)
      setAudioReady(false)
    }
  }

  const togglePlayPause = () => {
    if (audioRef.current) {
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }}

  const handleTimeUpdate = () => {
    if (audioRef.current) {
     setCurrentTime(audioRef.current.currentTime)
     setDuration(audioRef.current.duration)
  }}

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0)
    }
  }

  const handleTrackEnded = () => {
    setIsPlaying(false)
    setCurrentTime(0)
  }

  const handleSeek = (newTime) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
    setCurrentTime(newTime)
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleSearch = (searchTerm) => {
    const filtered = allTracks.filter(
      (track) =>
        track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        track.artist.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredTracks(filtered)
  }

  const TrackList = ({ tracks, showDelete = false }) => (
    <div className="h-[200px] overflow-y-auto" id="trackListContainer">
    <InfiniteScroll
    dataLength={tracks.length}
    next={loadMore}
    hasMore={activeTab === 'all' ? hasMoreAllTracks : hasMoreUserTracks}
    loader={<h4>Loading...</h4>}
    scrollableTarget="trackListContainer"
    threshold={0.5}
    endMessage={
      <p style={{ textAlign: 'center' }}>
        <b>Yay! You have seen it all</b>
      </p>
    }
   >
    <ul className="space-y-4">
      {tracks.map((track) => (
        <li
          key={track._id}
          className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md mb-4 hover:shadow-lg transition-shadow duration-300"
        >
          <div className="flex items-center">
            <FileMusic className="text-indigo-500 mr-3" size={24} />
            <span className="font-medium">{track.title} - <span className="text-gray-600">{track.artist}</span></span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => playTrack(track)}
              className="p-2 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300"
            >
              {currentTrack && currentTrack._id === track._id && isPlaying ? (
                <CirclePause size={20} />
              ) : (
                <CirclePlay size={20} />
              )}
            </button>
            {showDelete && (
              <button
                onClick={() => handleDelete(track._id, track.filePath)}
                className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-300"
                aria-label="Delete"
              >
                <Trash size={20} />
              </button>
            )}
          </div>
        </li>
       ))}
     </ul>
     </InfiniteScroll>
     </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-indigo-900">Your Music Hub</h1>
         
        <SearchBar onSearch={handleSearch} />

        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden mb-8">
          <div className="flex border-b">
            {['all', 'user', 'upload'].map((tab) => (
              <button
                key={tab}
                className={`flex-1 py-4 px-6 text-center font-semibold transition-colors duration-300 ${
                  activeTab === tab ? 'bg-indigo-500 text-white' : 'text-gray-600 hover:bg-indigo-100'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'all' && <Music className="inline-block mr-2" size={20} />}
                {tab === 'user' && <User className="inline-block mr-2" size={20} />}
                {tab === 'upload' && <CloudUpload className="inline-block mr-2" size={20} />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)} Tracks
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'all' && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-indigo-900">All Tracks</h2>
                {filteredTracks.length > 0 ? (
                 <TrackList tracks={filteredTracks} />
                ) : allTracks.length > 0 ? (
                 <TrackList tracks={allTracks} />
                ) : (
                 <p className="text-gray-600">No tracks have been uploaded yet.</p>
                )}
              </div>
            )}

            {activeTab === 'user' && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-indigo-900">Your Tracks</h2>
                {currentUser ? (
                  userTracks.length > 0 ? (
                    <TrackList tracks={userTracks} showDelete={true} />
                  ) : (
                    <p className="text-gray-600">You haven't uploaded any tracks yet.</p>
                  )
                ) : (
                  <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md" role="alert">
                    <p className="font-bold">Not logged in</p>
                    <p>Please log in to view and manage your tracks.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'upload' && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-indigo-900">Upload a Track</h2>
                {currentUser ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Song Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 transition-colors duration-300"
                    />
                    <input
                      type="text"
                      placeholder="Artist"
                      value={artist}
                      onChange={(e) => setArtist(e.target.value)}
                      className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 transition-colors duration-300"
                    />
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept="audio/*"
                      className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 transition-colors duration-300"
                    />
                    <button
                      onClick={handleUpload}
                      disabled={loading || (uploadProgress > 0 && uploadProgress < 100)}
                      className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-50 transition-colors duration-300"
                    >
                      {loading ? 'Uploading...' : 'Upload Song'}
                    </button>
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className="bg-indigo-500 h-2.5 transition-all duration-300 ease-in-out"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    )}
                    {uploadMessage && (
                      <div
                        className={`mt-4 p-4 rounded-md ${uploadMessage.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} transition-opacity duration-300`}
                        role="alert"
                      >
                        <p>{uploadMessage}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md" role="alert">
                    <p className="font-bold">Not logged in</p>
                    <p>Please log in to upload tracks.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {currentTrack && (
          <div
            className="bg-white shadow-2xl rounded-2xl p-6 transition-all duration-300 ease-in-out"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-semibold text-indigo-900">{currentTrack.title}</h3>
                <p className="text-sm text-indigo-600">{currentTrack.artist}</p>
              </div>
              <button
                onClick={togglePlayPause}
                className="p-3 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <CirclePause size={24} /> : <CirclePlay size={24} />}
              </button>
            </div>

            <div className="flex justify-center items-center">
              <CircularSlider
                currentTime={currentTime}
                duration={duration}
                onSeek={handleSeek}
              />
            </div>

            <div className="flex justify-between text-sm text-indigo-600 mt-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <audio
              ref={audioRef}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
  
              className="hidden"
            />
          </div>
        )}
      </div>
    </div>
  )
}