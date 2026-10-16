const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const streamifier = require('streamifier');

console.log("UPLOAD CLOUD:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("UPLOAD KEY:", process.env.CLOUDINARY_API_KEY);
console.log("UPLOAD SECRET PRESENT:", !!process.env.CLOUDINARY_API_SECRET);


// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Store uploaded file temporarily in memory
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// Upload file buffer to Cloudinary
const uploadToCloudinary = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const stream = cloudinary.uploader.upload_stream(
    {
      folder: 'campustrace/items',
      transformation: [
        {
          width: 800,
          height: 800,
          crop: 'limit',
          quality: 'auto',
        },
      ],
    },
    (error, result) => {
      if (error) {
        return next(error);
      }

      // Make req.file compatible with existing controller
      req.file.path = result.secure_url;
      req.file.filename = result.public_id;

      next();
    }
  );

  streamifier.createReadStream(req.file.buffer).pipe(stream);
};

module.exports = {
  upload,
  uploadToCloudinary,
  cloudinary,
};