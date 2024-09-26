import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { uploadTrack, getUserTracks, getAllTracks, deleteTrack } from '../controllers/tracks.controller.js';

const router = express.Router();

router.post('/upload', verifyToken, uploadTrack);
router.get('/user', verifyToken, getUserTracks);
router.get('/all', getAllTracks);
router.get('/delete/:id', verifyToken, deleteTrack);


export default router;