'use client'


import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ref, getStorage, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage"
import { app } from '../Firebase.js'
import { CirclePlay, CirclePause,  CloudUpload, User, Music, SkipBack, SkipForward } from 'lucide-react'
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

import  TracksList from '../components/TracksList.jsx'
import { SearchBar } from '../components/Searchbar.jsx'
import CircularSlider from '../components/CircularSlider.jsx'
import { CommentSection } from '../components/CommentSection.jsx'
import { ShareTrack } from '../components/ShareTrack.jsx'
import { TrackStats } from '../components/TrackStats.jsx'
import { incrementPlayCount } from '../Redux/trackAPI.js'

import bgimage from '../assets/bgimage.png' 
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
  const [playlist, setPlaylist] = useState([])
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)

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
      togglePlayPause()
    } else {
      const newPlaylist = activeTab === 'all' ? allTracks : 
                          activeTab === 'user' ? userTracks : 
                          filteredTracks.length > 0 ? filteredTracks : [track]
      
      const trackIndex = newPlaylist.findIndex(t => t._id === track._id)
      setPlaylist(newPlaylist)
      setCurrentTrackIndex(trackIndex)
      setCurrentTrack(track)
      setIsPlaying(true)
      setAudioReady(false)
      dispatch(incrementPlayCount(track._id))
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
    playNextTrack()
  }

  const playNextTrack = () => {
    if (playlist.length > 0) {
      const nextIndex = (currentTrackIndex + 1) % playlist.length
      const nextTrack = playlist[nextIndex]
      setCurrentTrackIndex(nextIndex)
      setCurrentTrack(nextTrack)
      setIsPlaying(true)
      setAudioReady(false)
      dispatch(incrementPlayCount(nextTrack._id))
    }
  }

  const playPreviousTrack = () => {
    if (playlist.length > 0) {
      const previousIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length
      const previousTrack = playlist[previousIndex]
      setCurrentTrackIndex(previousIndex)
      setCurrentTrack(previousTrack)
      setIsPlaying(true)
      setAudioReady(false)
      dispatch(incrementPlayCount(previousTrack._id))
    }
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


  const safeCurrentTime = isNaN(currentTime) ? 0 : currentTime
  const safeDuration = isNaN(duration) || duration === 0 ? 1 : duration
  
 


  return (
  <div className="relative min-h-screen">
    <div className="absolute inset-0 z-0">
      <img
        src={bgimage}
        alt="Music Background"
        layout="fill"
        quality={100}
        className="w-full h-full object-cover opacity-70"
      />
    </div>
    <div className="relative z-10 min-h-screen py-4 px-4 sm:px-6 lg:px-8">
    <div className="max-w-6xl mx-auto">
     <div className="flex flex-col rounded-2xl border-2 border-lime-400 bg-gradient-to-r from-lime-400 to-lime-300-200 md:flex-row justify-between items-center px-8 mt-7 mb-5">

       <h1 className="text-9xl md:text-8xl font-authappfont mb-5 md:mb-0 text-left text-black">Audiq</h1>
       <div className="w-full md:w-2/3 mt-5">
        <SearchBar onSearch={handleSearch} />
       </div>
     </div>
      <div className="flex flex-col lg:flex-row gap-8 mt-8 h-auto">
        {/* Tracks List Card */}
        <div className="w-full rounded-tl-[40px] rounded-br-[40px] rounded-tr-none rounded-bl-none lg:w-1/2 bg-gray-900/90 backdrop-blur-none shadow-2xl rounded-3xl overflow-hidden border-4 border-lime-400">
          <div className="flex border-b border-lime-400">
            {['all', 'user', 'upload'].map((tab) => (
              <button
                key={tab}
                className={`flex-1 py-3 px-4 text-center font-authappfont text-xl transition-colors duration-500 ${
                  activeTab === tab ? 'bg-lime-400 text-black' : 'text-lime-300 hover:bg-gray-700'
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

          <div className="p-4">
              {activeTab === 'all' && (
                <div>
                  <h2 className="text-2xl  font-authappfont font-light mb-4 text-lime-400">All Tracks</h2>
                  {filteredTracks.length > 0 ? (
                    <TracksList 
                      tracks={filteredTracks} 
                      playTrack={playTrack}
                      currentTrack={currentTrack}
                      isPlaying={isPlaying}
                      loadMore={loadMore}
                      hasMore={hasMoreAllTracks}
                    />
                  ) : allTracks.length > 0 ? (
                    <TracksList 
                      tracks={allTracks} 
                      playTrack={playTrack}
                      currentTrack={currentTrack}
                      isPlaying={isPlaying}
                      loadMore={loadMore}
                      hasMore={hasMoreAllTracks}
                    />
                  ) : (
                    <p className="text-lime-500">No tracks have been uploaded yet.</p>
                  )}
                </div>
              )}

              {activeTab === 'user' && (
                <div>
                  <h2 className="text-2xl font-authappfont font-light mb-4 text-lime-400">Your Tracks</h2>
                  {currentUser ? (
                    userTracks.length > 0 ? (
                      <TracksList 
                        tracks={userTracks} 
                        showDelete={true} 
                        playTrack={playTrack}
                        currentTrack={currentTrack}
                        isPlaying={isPlaying}
                        handleDelete={handleDelete}
                        loadMore={loadMore}
                        hasMore={hasMoreUserTracks}
                      />
                  ) : (
                    <p className="text-lime-500">You haven't uploaded any tracks yet.</p>
                  )
                ) : (
                  <div className="bg-yellow-900/90 backdrop-blur-sm border-l-4 border-yellow-500 text-yellow-300 p-4 rounded-md" role="alert">
                    <p className="font-bold">Not logged in</p>
                    <p>Please log in to view and manage your tracks.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'upload' && (
              <div>
                <h2 className="text-2xl font-authappfont font-light mb-4 text-lime-400">Upload a Track</h2>
                {currentUser ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Song Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 font-mono placeholder-gray-500 bg-gray-800/90 backdrop-blur-sm border border-lime-500 rounded-md focus:outline-none focus:ring focus:ring-lime-400 focus:border-lime-500 text-white transition-colors duration-300"
                    />
                    <input
                      type="text"
                      placeholder="Artist"
                      value={artist}
                      onChange={(e) => setArtist(e.target.value)}
                      className="w-full px-3 py-2 font-mono placeholder-gray-500 bg-gray-800/90 backdrop-blur-sm border border-lime-500 rounded-md focus:outline-none focus:ring focus:ring-lime-400 focus:border-lime-500 text-white transition-colors duration-300"
                    />
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept="audio/*"
                      className="w-full px-3 py-2 font-mono text-lime-500 bg-gray-800/90 backdrop-blur-sm border border-lime-500 rounded-md focus:outline-none focus:ring focus:ring-lime-400 focus:border-lime-600 transition-colors duration-300"
                    />
                    <button
                      onClick={handleUpload}
                      disabled={loading || (uploadProgress > 0 && uploadProgress < 100)}
                      className="w-full bg-lime-500 font-authappfont text-lg text-black py-2 px-4 rounded-md hover:bg-lime-300 focus:outline-none focus:ring-2 focus:ring-lime-600 focus:ring-opacity-50 disabled:opacity-50 transition-colors duration-300"
                    >
                      {loading ? 'Uploading...' : 'Upload Song'}
                    </button>
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className="bg-lime-400 h-2.5 transition-all duration-300 ease-in-out"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    )}
                    {uploadMessage && (
                      <div
                        className={`mt-4 p-4 rounded-md ${uploadMessage.includes('Error') ? 'bg-red-900/90 backdrop-blur-sm text-red-300' : 'bg-lime-700/90 backdrop-blur-sm text-lime-400'} transition-opacity duration-300`}
                        role="alert"
                      >
                        <p>{uploadMessage}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-yellow-900/90 backdrop-blur-sm border-l-4 border-yellow-500 text-yellow-300 p-4 rounded-md" role="alert">
                    <p className="font-bold">Not logged in</p>
                    <p>Please log in to upload tracks.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Player Section Card */}
        <div className="w-full rounded-tl-none rounded-br-none rounded-tr-[40px] rounded-bl-[40px] lg:w-1/2 bg-gray-900/90 backdrop-blur-none shadow-2xl rounded-3xl overflow-hidden border-4 border-lime-400 p-6">
          {currentTrack ? (
            <>
              <div className="flex justify-between items-center mb-1">
                <div>
                  <h3 className="text-2xl font-authappfont font-extralight text-lime-300">{currentTrack.title}</h3>
                  <p className="text-sm text-white">{currentTrack.artist}</p>
                </div>

               
                <div className="pr-8 pt-10">
                <CircularSlider
                  currentTime={safeCurrentTime}
                  duration={safeDuration}
                  onSeek={handleSeek}
                />
                </div>
              </div>

              <div className="flex space-x-2 items-center mb-6">
              <button
                onClick={playPreviousTrack}
                className="p-3 rounded-full bg-lime-500 text-black hover:bg-lime-300 focus:outline-none focus:ring-2 focus:ring-lime-600 focus:ring-opacity-50 transition-colors duration-300"
                aria-label="Previous Track"
              >
                <SkipBack size={15} />
              </button>
              <button
                onClick={togglePlayPause}
                className="p-3 rounded-full bg-lime-400 text-black hover:bg-lime-300 focus:outline-none focus:ring-2 focus:ring-lime-600 focus:ring-opacity-50 transition-colors duration-300"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <CirclePause size={24} /> : <CirclePlay size={24} />}
              </button>
              <button
                onClick={playNextTrack}
                className="p-3  rounded-full bg-lime-500 text-black hover:bg-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-600 focus:ring-opacity-50 transition-colors duration-300"
                aria-label="Next Track"
              >
                <SkipForward size={15} />
              </button>
            </div>

              <div className="flex justify-start space-x-24 text-sm text-lime-400 mb-6">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>

              <div className="flex justify-between items-center mb-6">
                <TrackStats track={currentTrack} />
                <ShareTrack track={currentTrack} />
              </div>

              <CommentSection trackId={currentTrack._id} />

              <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleTrackEnded}
                className="hidden"
              />
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-lime-400 font-mono text-lg">Select a track to play</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
</div>
)
}