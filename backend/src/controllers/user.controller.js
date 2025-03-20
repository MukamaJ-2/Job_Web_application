const { User, UserProfile } = require('../models');

const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const {
    phone,
    address,
    company_name,
    company_website,
    company_description,
    industry
  } = req.body;

  try {
    const [profile, created] = await UserProfile.findOrCreate({
      where: { userId },
      defaults: {
        phone,
        address,
        companyName: company_name,
        companyWebsite: company_website,
        companyDescription: company_description,
        industry
      }
    });

    if (!created) {
      await profile.update({
        phone,
        address,
        companyName: company_name,
        companyWebsite: company_website,
        companyDescription: company_description,
        industry
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const uploadResume = async (req, res) => {
  const userId = req.user.id;
  const resumeUrl = req.file?.path;

  if (!resumeUrl) {
    return res.status(400).json({
      success: false,
      message: 'No resume file provided'
    });
  }

  try {
    const [profile, created] = await UserProfile.findOrCreate({
      where: { userId },
      defaults: { resumeUrl }
    });

    if (!created) {
      await profile.update({ resumeUrl });
    }

    res.json({
      success: true,
      message: 'Resume uploaded successfully',
      resumeUrl: profile.resumeUrl
    });
  } catch (error) {
    console.error('Upload resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload resume',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        role: ['jobseeker', 'employer']
      },
      include: [{
        model: UserProfile,
        as: 'profile'
      }],
      attributes: { exclude: ['password'] }
    });

    res.json({
      success: true,
      users: users.map(user => ({
        ...user.toJSON(),
        isEmployer: user.role === 'employer'
      }))
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const updateUserStatus = async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;

  try {
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.update({ status });

    res.json({
      success: true,
      message: 'User status updated successfully'
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.destroy();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  updateProfile,
  uploadResume,
  getUsers,
  updateUserStatus,
  deleteUser
};
