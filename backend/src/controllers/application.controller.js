import Application from '../models/Application.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import Message from '../models/Message.js';
import { Op } from 'sequelize';
import multer from 'multer';
import path from 'path';

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/resumes');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({
  storage: storage,
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
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
}).single('resume');

// Get user's applications with filtering and pagination
export const getMyApplications = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    const where = { userId: req.user.id };
    if (status) where.status = status;
    
    const applications = await Application.findAndCountAll({
      where,
      include: [
        {
          model: Job,
          attributes: ['id', 'title', 'company', 'location', 'type', 'salary'],
          where: search ? {
            [Op.or]: [
              { title: { [Op.like]: `%${search}%` } },
              { company: { [Op.like]: `%${search}%` } }
            ]
          } : undefined
        },
        {
          model: User,
          attributes: ['id', 'name', 'email']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      applications: applications.rows,
      total: applications.count,
      totalPages: Math.ceil(applications.count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Apply for a job with resume upload
export const applyForJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.jobId);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user has already applied
    const existingApplication = await Application.findOne({
      where: {
        userId: req.user.id,
        jobId: req.params.jobId
      }
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    let resumePath = null;
    if (req.file) {
      resumePath = req.file.path;
    }

    const application = await Application.create({
      userId: req.user.id,
      jobId: req.params.jobId,
      status: 'pending',
      coverLetter: req.body.coverLetter,
      resume: resumePath
    });

    const populatedApplication = await Application.findByPk(application.id, {
      include: [
        {
          model: Job,
          attributes: ['id', 'title', 'company', 'location', 'type', 'salary']
        },
        {
          model: User,
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.status(201).json(populatedApplication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update application status with notification
export const updateApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findByPk(req.params.id, {
      include: [{ model: Job }, { model: User }]
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Only employer of the job can update status
    if (application.Job.employerId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    const oldStatus = application.status;
    await application.update({ status: req.body.status });

    // Create a system message for status change
    await Message.create({
      applicationId: application.id,
      senderId: req.user.id,
      content: `Application status updated from ${oldStatus} to ${req.body.status}`,
      isSystemMessage: true
    });

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send message on application
export const sendMessage = async (req, res) => {
  try {
    const application = await Application.findByPk(req.params.id, {
      include: [{ model: Job }, { model: User }]
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Only the applicant and employer can send messages
    if (req.user.id !== application.userId && req.user.id !== application.Job.employerId) {
      return res.status(403).json({ message: 'Not authorized to send messages on this application' });
    }

    const message = await Message.create({
      applicationId: application.id,
      senderId: req.user.id,
      content: req.body.content
    });

    const populatedMessage = await Message.findByPk(message.id, {
      include: [{
        model: User,
        attributes: ['id', 'name', 'email']
      }]
    });

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get messages for an application
export const getMessages = async (req, res) => {
  try {
    const application = await Application.findByPk(req.params.id);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Only the applicant and employer can view messages
    if (req.user.id !== application.userId && req.user.id !== application.Job.employerId) {
      return res.status(403).json({ message: 'Not authorized to view messages for this application' });
    }

    const messages = await Message.findAll({
      where: { applicationId: req.params.id },
      include: [{
        model: User,
        attributes: ['id', 'name', 'email']
      }],
      order: [['createdAt', 'ASC']]
    });

    // Mark messages as read
    await Message.update(
      { isRead: true },
      {
        where: {
          applicationId: req.params.id,
          senderId: { [Op.ne]: req.user.id },
          isRead: false
        }
      }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get application statistics
export const getApplicationStats = async (req, res) => {
  try {
    const stats = await Application.findAll({
      where: { userId: req.user.id },
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    const recentActivity = await Application.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Job,
          attributes: ['id', 'title', 'company']
        }
      ],
      order: [['updatedAt', 'DESC']],
      limit: 5
    });

    res.json({
      stats,
      recentActivity
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 