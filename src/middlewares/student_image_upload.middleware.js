const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the upload folder exists
const uploadDir = 'public/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Custom storage configuration for multiple fields
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Distinguish files based on fieldname
    let prefix = '';
    if (file.fieldname === 'profile_image') {
      prefix = 'profile_';
    } else if (file.fieldname === 'signature_image') {
      prefix = 'signature_';
    } else {
      prefix = 'file_';
    }

    const uniqueName = prefix + Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

// Allow only image files
const fileFilter = (req, file, cb) => {
  const isImage = file.mimetype.startsWith('image/');
  if (isImage) cb(null, true);
  else cb(new Error('Only image files are allowed'));
};

// Initialize multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1 * 1024 * 1024 // 1MB limit per file
  }
});

module.exports = upload;


module.exports = upload;