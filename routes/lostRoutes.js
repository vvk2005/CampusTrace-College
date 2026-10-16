const express = require('express');
const router = express.Router();

const {
  createLostItem,
  getLostItems,
  getLostItemById,
  updateLostItem,
  deleteLostItem,
  getMyLostItems,
} = require('../controllers/lostController');

const { protect } = require('../middleware/auth');

const {
  upload,
  uploadToCloudinary,
} = require('../middleware/upload');

router.get('/my', protect, getMyLostItems);

router
  .route('/')
  .get(getLostItems)
  .post(
    protect,
    upload.single('image'),
    uploadToCloudinary,
    createLostItem
  );

router
  .route('/:id')
  .get(getLostItemById)
  .put(
    protect,
    upload.single('image'),
    uploadToCloudinary,
    updateLostItem
  )
  .delete(protect, deleteLostItem);

module.exports = router;