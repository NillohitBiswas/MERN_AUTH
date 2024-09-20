import Tracks from "../models/tracks.model.js";
import { errorHandler } from "../utils/error.js";


export const getDefaultTracks = async (req, res, next) => {
  try {
    const tracks = await Tracks.find({ isDefault: true }).limit(5);
    res.json(tracks);
  } catch (error) {
    next(error);
  }
};

export const getUserTracks = async (req, res, next) => {
  try {
    const tracks = await Tracks.find({ user: req.params.userId });
    res.json(tracks);
  } catch (error) {
    next(error);
  }
};

export const addTrack = async (req, res, next) => {
  try {
    const { title } = req.body;
    const { file } = req;
    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const newTrack = new Tracks({
      title,
      url: `/uploads/${file.filename}`,
      user: req.user.id,
    });
    await newTrack.save();
    res.json({ success: true, track: newTrack });
  } catch (error) {
    next(error);
  }
};

export const deleteTrack = async (req, res, next) => {
  try {
    const track = await Tracks.findById(req.params.id);
    if (!track) {
      return next(errorHandler(404, "Track not found"));
    }
    await track.remove();
    res.status(200).json({ message: "Track deleted successfully" });
  } catch (error) {
    next(error);
  }
};