const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads folder if not exists
// Storage location & name
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/'),
  filename: (req, file, cb) => {
    const name = 'profile_' + Date.now() + path.extname(file.originalname);
    cb(null, name);
  }
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  const isImage = file.mimetype.startsWith('image/');
  if (isImage) cb(null, true);
  else cb(new Error('Only image files are allowed'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1 * 1024 * 1024 // 1MB max
  }
});

module.exports = upload;