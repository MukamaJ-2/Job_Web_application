import Application from '../models/Application.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import Message from '../models/Message.js';
import { Op } from 'sequelize';
import multer from 'multer';
import path from 'path';

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: 'uploads/resumes',
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowedTypes.includes(ext) ? true : new Error('Invalid file type. Only PDF and Word documents are allowed.'));
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
}).single('resume');

// Helper function to handle errors
const handleError = (res, error) => res.status(500).json({ success: false, message: error.message });

// Get user's applications with filtering and pagination
export const getMyApplications = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const where = { userId: req.user.id, ...(status && { status }) };

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
        { model: User, attributes: ['id', 'name', 'email'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        applications: applications.rows,
        total: applications.count,
        totalPages: Math.ceil(applications.count / limit),
        currentPage: parseInt(page)
      }
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Get specific application
export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findByPk(req.params.id, {
      include: [
        { model: Job, attributes: ['id', 'title', 'company', 'location', 'type', 'salary', 'employerId'] },
        { model: User, attributes: ['id', 'name', 'email'] }
      ]
    });

    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

    const isAuthorized = [application.userId, application.Job.employerId].includes(req.user.id) || req.user.role === 'admin';
    if (!isAuthorized) return res.status(403).json({ success: false, message: 'Not authorized to view this application' });

    res.json({ success: true, data: application });
  } catch (error) {
    handleError(res, error);
  }
};

// Apply for a job with resume upload
export const applyForJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    const existingApplication = await Application.findOne({ where: { userId: req.user.id, jobId: req.params.jobId } });
    if (existingApplication) return res.status(400).json({ success: false, message: 'You have already applied for this job' });

    const application = await Application.create({
      userId: req.user.id,
      jobId: req.params.jobId,
      status: 'pending',
      coverLetter: req.body.coverLetter,
      resume: req.file ? req.file.path : null
    });

    const populatedApplication = await Application.findByPk(application.id, {
      include: [
        { model: Job, attributes: ['id', 'title', 'company', 'location', 'type', 'salary'] },
        { model: User, attributes: ['id', 'name', 'email'] }
      ]
    });

    res.status(201).json({ success: true, data: populatedApplication });
  } catch (error) {
    handleError(res, error);
  }
};

// Update application status
export const updateApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findByPk(req.params.id, { include: [{ model: Job }] });
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

    const isAuthorized = application.Job.employerId === req.user.id || req.user.role === 'admin';
    if (!isAuthorized) return res.status(403).json({ success: false, message: 'Not authorized to update this application' });

    const oldStatus = application.status;
    await application.update({ status: req.body.status });

    await Message.create({
      applicationId: application.id,
      senderId: req.user.id,
      content: `Application status updated from ${oldStatus} to ${req.body.status}`,
      isSystemMessage: true
    });

    res.json({ success: true, data: application });
  } catch (error) {
    handleError(res, error);
  }
};

// Send message on application
export const sendMessage = async (req, res) => {
  try {
    const application = await Application.findByPk(req.params.id, { include: [{ model: Job }, { model: User }] });
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

    const isAuthorized = [application.userId, application.Job.employerId].includes(req.user.id) || req.user.role === 'admin';
    if (!isAuthorized) return res.status(403).json({ success: false, message: 'Not authorized to send messages on this application' });

    const message = await Message.create({
      applicationId: application.id,
      senderId: req.user.id,
      content: req.body.content
    });

    const populatedMessage = await Message.findByPk(message.id, {
      include: [{ model: User, attributes: ['id', 'name', 'email'] }]
    });

    res.status(201).json({ success: true, data: populatedMessage });
  } catch (error) {
    handleError(res, error);
  }
};

// Get messages for an application
export const getMessages = async (req, res) => {
  try {
    const application = await Application.findByPk(req.params.id, { include: [{ model: Job }] });
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

    const isAuthorized = [application.userId, application.Job.employerId].includes(req.user.id) || req.user.role === 'admin';
    if (!isAuthorized) return res.status(403).json({ success: false, message: 'Not authorized to view messages for this application' });

    const messages = await Message.findAll({
      where: { applicationId: req.params.id },
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
      order: [['createdAt', 'ASC']]
    });

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

    res.json({ success: true, data: messages });
  } catch (error) {
    handleError(res, error);
  }
};

// Get application statistics
export const getApplicationStats = async (req, res) => {
  try {
    const stats = await Application.findAll({
      where: { userId: req.user.id },
      attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['status']
    });

    const recentActivity = await Application.findAll({
      where: { userId: req.user.id },
      include: [{ model: Job, attributes: ['id', 'title', 'company'] }],
      order: [['updatedAt', 'DESC']],
      limit: 5
    });

    res.json({ success: true, data: { stats, recentActivity } });
  } catch (error) {
    handleError(res, error);
  }
};
