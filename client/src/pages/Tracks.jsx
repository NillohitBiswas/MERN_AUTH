'use client'

import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ref, getStorage, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage"
import { app } from '../Firebase'
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

export default function Tracks() {
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [uploadMessage, setUploadMessage] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const dispatch = useDispatch()
  const { currentUser } = useSelector((state) => state.user)
  const { userTracks, allTracks, loading, error } = useSelector((state) => state.tracks)

  useEffect(() => {
    fetchAllTracks()
    if (currentUser) {
      fetchUserTracks()
    }
  }, [currentUser])

  const fetchAllTracks = async () => {
    dispatch(fetchTracksStart())
    try {
      const res = await fetch('/api/tracks/all')
      const data = await res.json()
      dispatch(fetchAllTracksSuccess(data))
    } catch (error) {
      dispatch(fetchTracksFailure(error instanceof Error ? error.message : 'An unknown error occurred'))
    }
  }

  const fetchUserTracks = async () => {
    if (!currentUser) return
    dispatch(fetchTracksStart())
    try {
      const res = await fetch('/api/tracks/user', {
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        }
      })
      const data = await res.json()
      dispatch(fetchUserTracksSuccess(data))
    } catch (error) {
      dispatch(fetchTracksFailure(error instanceof Error ? error.message : 'An unknown error occurred'))
    }
  }

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
        dispatch(deleteTrackSuccess(trackId))
        setUploadMessage('Track deleted successfully!')
        fetchUserTracks()
        fetchAllTracks()
      } else {
        throw new Error('Failed to delete track')
      }
    } catch (error) {
      dispatch(deleteTrackFailure(error instanceof Error ? error.message : 'An unknown error occurred'))
      setUploadMessage('Error deleting track. Please try again.')
    }
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto mb-8 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4">
          <h2 className="text-3xl font-bold mb-2">Make Your Favorite Playlist</h2>
          <p className="text-gray-700 text-base mb-4">Upload your favorite songs and create amazing playlists!</p>
          <p className="text-lg mb-4">Discover new music, share your favorites, and connect with other music lovers.</p>
          {currentUser ? (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Song Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
              />
              <input
                type="text"
                placeholder="Artist"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
              />
              <input
                type="file"
                onChange={handleFileChange}
                accept="audio/*"
                className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
              />
              <button
                onClick={handleUpload}
                disabled={loading || (uploadProgress > 0 && uploadProgress < 100)}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-50"
              >
                {loading ? 'Uploading...' : 'Upload Song'}
              </button>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-indigo-600 h-2.5 rounded-full" style={{width: `${uploadProgress}%`}}></div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
              <p className="font-bold">Not logged in</p>
              <p>Please log in to upload and manage your tracks.</p>
            </div>
          )}
          {uploadMessage && (
            <div className={`mt-4 p-4 ${uploadMessage.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`} role="alert">
              <p>{uploadMessage}</p>
            </div>
          )}
          {error && (
            <div className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>

      {currentUser && (
        <div className="max-w-4xl mx-auto mb-8 bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4">
            <h2 className="text-2xl font-bold mb-4">Your Tracks</h2>
            {userTracks.length > 0 ? (
              userTracks.map((track) => (
                <div key={track._id} className="mb-4">
                  <p className="font-semibold">{track.title} - {track.artist}</p>
                  <audio controls src={track.fileUrl} className="w-full mt-2" />
                  <button
                    onClick={() => handleDelete(track._id, track.filePath)}
                    className="mt-2 bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p>You haven't uploaded any tracks yet.</p>
            )}
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4">
          <h2 className="text-2xl font-bold mb-4">All Tracks</h2>
          {allTracks.length > 0 ? (
            allTracks.map((track) => (
              <div key={track._id} className="mb-4">
                <p className="font-semibold">{track.title} - {track.artist}  {track.uploadedBy ? ` (Uploaded by: ${track.uploadedBy.username})` : ''}</p>
                <audio controls src={track.fileUrl} className="w-full mt-2" />
               
              </div>
            ))
          ) : (
            <p>No tracks have been uploaded yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}