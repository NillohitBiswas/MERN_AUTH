import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { getDefaultTracks, getUserTracks, addTrack } from '../controllers/tracks.controller.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/default', getDefaultTracks);
router.get('/user', verifyToken, getUserTracks);
router.post('/add', verifyToken, upload.single('track'), addTrack);

export default router;