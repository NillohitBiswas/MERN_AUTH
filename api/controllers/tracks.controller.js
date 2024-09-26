import Track from '../models/tracks.model.js';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

export const uploadTrack = async (req, res, next) => {
  if (!req.user) return next(errorHandler(401, 'You must be logged in to upload a track'));
  
  const { title, artist, fileUrl } = req.body;

  if (!title || !artist || !fileUrl) {
    return next(errorHandler(400, 'Please provide all required fields'));
  }

  try {
    const newTrack = new Track({
      title,
      artist,
      fileUrl,
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