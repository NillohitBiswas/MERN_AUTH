import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { 
      uploadTrack,
      getUserTracks, 
      getAllTracks, 
      deleteTrack,
      incrementPlayCount,
      likeTrack,
      dislikeTrack,
      shareTrack,
      addComment,
      getComments,
      deleteComment } from '../controllers/tracks.controller.js';

const router = express.Router();

router.post('/upload', verifyToken, uploadTrack);
router.get('/user', verifyToken, getUserTracks);
router.get('/all', getAllTracks);
router.delete('/delete/:id', verifyToken, deleteTrack);
router.post('/:id/play', incrementPlayCount);
router.post('/:id/like', verifyToken, likeTrack);
router.post('/:id/dislike', verifyToken, dislikeTrack);
router.post('/:id/share', shareTrack);
router.post('/:id/comment', verifyToken, addComment);
router.get('/:id/comments', getComments);
router.delete('/:id/comments/:commentId', verifyToken, deleteComment);


export default router;