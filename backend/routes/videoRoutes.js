const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const authenticate = require('../middleware/authenticate');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/videos'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/upload', authenticate(), upload.single('video'), videoController.uploadVideo);
router.get('/', videoController.getVideos);

module.exports = router;
