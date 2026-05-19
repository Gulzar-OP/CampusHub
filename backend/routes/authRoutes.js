import express from 'express'
import { register ,login, logout, getAllUsers, myProfile, getUserById, verifyOTP} from '../controllers/auth.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../utils/multer.js';

const router = express.Router();
router.post(
  '/register',
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'image', maxCount: 1 },
  ]),
  register
)
router.post('/login', login);
router.post("/verify-otp", verifyOTP);
router.post('/logout', logout);
router.get('/users', protect, getAllUsers);
router.get('/me', protect, myProfile);
router.get('/users/:id', protect, getUserById);

export default router;