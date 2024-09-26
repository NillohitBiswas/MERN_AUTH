import Track from '../models/tracks.model.js';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';



export const uploadTrack = async (req, res, next) => {
  if (!req.user) return next(errorHandler(401, 'You must be logged in to upload a track'));
  
  const { title, artist, fileUrl,filePath } = req.body;

  if (!title || !artist || !fileUrl) {
    return next(errorHandler(400, 'Please provide all required fields'));
  }

  try {
    const newTrack = new Track({
      title,
      artist,
      fileUrl,
      filePath,
      uploadedBy: req.user.id,
    });

    const savedTrack = await newTrack.save();

    await User.findByIdAndUpdate(req.user.id, {
      $push: { tracks: savedTrack._id }
    });

    res.status(201).json(savedTrack);
  } catch (error) {
    next(error);
  }
};

export const getUserTracks = async (req, res, next) => {
  if (!req.user) return next(errorHandler(401, 'You must be logged in to view your tracks'));

  try {
    const user = await User.findById(req.user.id).populate('tracks');
    res.status(200).json(user.tracks);
  } catch (error) {
    next(error);
  }
};

export const getAllTracks = async (req, res, next) => {
  try {
    const tracks = await Track.find().populate('uploadedBy', 'username');
    res.status(200).json(tracks);
  } catch (error) {
    next(error);
  }
};

export const deleteTrack = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; //  middleware that adds the user to the request

  try {
    // Find the track
    const track = await Track.findById(id);

    if (!track) {
      return res.status(404).json({ message: 'Track not found' });
    }

    // Check if the user is the owner of the track
    if (track.uploadedBy.toString() !== userId) {
      return res.status(403).json({ message: 'You do not have permission to delete this track' });
    }

    // Delete the track from the database
    await Track.findByIdAndDelete(id);

    await User.findByIdAndUpdate(userId, {
      $pull: { tracks: id }
    });

    res.status(200).json({ message: 'Track deleted successfully' });
  } catch (error) {
    console.error('Error deleting track:', error);
    res.status(500).json({ message: 'Error deleting track', error: error.message });
  }
};