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
  const userId = req.user.id;

  try {
    console.log(`Attempting to delete track with id: ${id}`);

    // Find the track
    const track = await Track.findById(id);

    if (!track) {
      console.log(`Track with id ${id} not found`);
      return res.status(404).json({ message: 'Track not found' });
    }

    console.log(`Track found: ${JSON.stringify(track)}`);

    // Check if the user is the owner of the track
    if (track.uploadedBy.toString() !== userId) {
      console.log(`User ${userId} does not have permission to delete track ${id}`);
      return res.status(403).json({ message: 'You do not have permission to delete this track' });
    }

    // Delete the track from the database
    const deletedTrack = await Track.findByIdAndDelete(id);
    console.log(`Deleted track: ${JSON.stringify(deletedTrack)}`);

    // Remove the track from the user's tracks array
    const updatedUser = await User.findByIdAndUpdate(userId, {
      $pull: { tracks: id }
    }, { new: true });
    console.log(`Updated user: ${JSON.stringify(updatedUser)}`);

    res.status(200).json({ message: 'Track deleted successfully' });
  } catch (error) {
    console.error('Error deleting track:', error);
    res.status(500).json({ message: 'Error deleting track', error: error.message });
  }
};

export const incrementPlayCount = async (req, res, next) => {
  const { id } = req.params;

  try {
    const track = await Track.findByIdAndUpdate(id, { $inc: { playCount: 1 } }, { new: true });
    if (!track) {
      return next(errorHandler(404, 'Track not found'));
    }
    res.status(200).json(track);
  } catch (error) {
    next(error);
  }
};

export const likeTrack = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const track = await Track.findById(id);
    if (!track) {
      return res.status(404).json({ message: 'Track not found' });
    }

    // Ensure likes and dislikes are arrays
    track.likes = Array.isArray(track.likes) ? track.likes : [];
    track.dislikes = Array.isArray(track.dislikes) ? track.dislikes : [];

    const userLikedIndex = track.likes.findIndex(id => id.toString() === userId);
    const userDislikedIndex = track.dislikes.findIndex(id => id.toString() === userId);

    if (userLikedIndex > -1) {
      // User already liked, so remove the like
      track.likes.splice(userLikedIndex, 1);
    } else {
      // Add like and remove dislike if exists
      track.likes.push(userId);
      if (userDislikedIndex > -1) {
        track.dislikes.splice(userDislikedIndex, 1);
      }
    }

    await track.save();

    res.status(200).json({
      trackId: track._id,
      likes: track.likes,
      dislikes: track.dislikes,
      liked: userLikedIndex === -1
    });
  } catch (error) {
    console.error('Error in likeTrack:', error);
    res.status(500).json({ 
      message: 'Server error while liking track',
      error: error.message 
    });
  }
};

export const dislikeTrack = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const track = await Track.findById(id);
    if (!track) {
      return res.status(404).json({ message: 'Track not found' });
    }

    // Ensure likes and dislikes are arrays
    track.likes = Array.isArray(track.likes) ? track.likes : [];
    track.dislikes = Array.isArray(track.dislikes) ? track.dislikes : [];

    const userLikedIndex = track.likes.findIndex(id => id.toString() === userId);
    const userDislikedIndex = track.dislikes.findIndex(id => id.toString() === userId);

    if (userDislikedIndex > -1) {
      // User already disliked, so remove the dislike
      track.dislikes.splice(userDislikedIndex, 1);
    } else {
      // Add dislike and remove like if exists
      track.dislikes.push(userId);
      if (userLikedIndex > -1) {
        track.likes.splice(userLikedIndex, 1);
      }
    }

    await track.save();

    res.status(200).json({
      trackId: track._id,
      likes: track.likes,
      dislikes: track.dislikes,
      disliked: userDislikedIndex === -1
    });
  } catch (error) {
    console.error('Error in dislikeTrack:', error);
    res.status(500).json({ 
      message: 'Server error while disliking track',
      error: error.message 
    });
  }
};

export const shareTrack = async (req, res, next) => {
  const { id } = req.params;

  try {
    const track = await Track.findByIdAndUpdate(id, { $inc: { shareCount: 1 } }, { new: true });
    if (!track) {
      return next(errorHandler(404, 'Track not found'));
    }
    res.status(200).json(track);
  } catch (error) {
    next(error);
  }
};

export const addComment = async (req, res, next) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text) {
    return next(errorHandler(400, 'Comment text is required'));
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    const newComment = {
      user: req.user.id,
      username: user.username,
      text: text,
      createdAt: new Date()
    };

    const track = await Track.findByIdAndUpdate(
      id,
      { $push: { comments: newComment } },
      { new: true }
    );

    if (!track) {
      return next(errorHandler(404, 'Track not found'));
    }

    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req, res, next) => {
  const { id } = req.params;

  try {
    const track = await Track.findById(id).populate('comments.user', 'username');
    if (!track) {
      return next(errorHandler(404, 'Track not found'));
    }
    const formattedComments = track.comments.map(comment => ({
      _id: comment._id,
      user: comment.user._id,
      username: comment.username || comment.user.username,
      text: comment.text,
      createdAt: comment.createdAt
    }));
    res.status(200).json(formattedComments);
  } catch (error) {
    next(error);
  }
};