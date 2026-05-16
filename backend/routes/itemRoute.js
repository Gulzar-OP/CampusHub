import express from 'express'
import { addItem, getAllItems, getItemById, deleteItem, updateItem, buyItem,sellItem, getMyPosts, getClaimedPosts, claimItem, getMarketplaceItems } from '../controllers/itemController.js';
import upload from '../utils/multer.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// router.post('/add', upload.single("image"),addItem);
router.post("/add", protect, upload.single("image"), addItem);
router.get('/marketplace', protect, getMarketplaceItems);
router.get('/items', getAllItems);

router.get("/my-posts", protect, getMyPosts);

router.get("/:id", protect, getItemById);

router.put("/claim/:id", protect, claimItem);
router.get('/claimed-posts', protect, getClaimedPosts);
router.put('/items/:id', protect, updateItem);
router.delete('/items/:id', protect, deleteItem);
router.post('/items/:id/buy', protect, buyItem);
router.post('/sell/:id', protect, sellItem);


export default router;