import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  getMyApplications,
  applyForJob,
  updateApplicationStatus,
  sendMessage,
  getMessages,
  getApplicationStats,
  upload
} from '../controllers/application.controller.js';
import multer from 'multer';

const router = express.Router();

// Get user's applications with filtering and pagination
router.get('/me', authenticate, getMyApplications);

// Get application statistics
router.get('/stats', authenticate, getApplicationStats);

// Apply for a job with resume upload
router.post('/jobs/:jobId/apply', authenticate, upload, applyForJob);

// Update application status
router.put('/:id/status', authenticate, updateApplicationStatus);

// Message routes
router.post('/:id/messages', authenticate, sendMessage);
router.get('/:id/messages', authenticate, getMessages);

// Error handling for file uploads
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ message: 'File upload error.' });
  }
  next(err);
});

export default router; 