import express from 'express';
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { auth, checkRole } = require('../middleware/auth.middleware');
const {
  updateProfile,
  uploadResume,
  getUsers,
  updateUserStatus,
  deleteUser
} = require('../controllers/user.controller');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/resumes');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Protected routes
router.put('/profile', auth, updateProfile);
router.post('/resume', auth, upload.single('resume'), uploadResume);

// Admin routes
router.get('/', auth, checkRole(['admin']), getUsers);
router.put('/:userId/status', auth, checkRole(['admin']), updateUserStatus);
router.delete('/:userId', auth, checkRole(['admin']), deleteUser);

router.get('/', (req, res) => {
  res.json({ message: 'Users API endpoint' });
});

router.put('/profile', (req, res) => {
  res.json({ message: 'Update profile endpoint' });
});

router.post('/resume', (req, res) => {
  res.json({ message: 'Upload resume endpoint' });
});

export default router; 