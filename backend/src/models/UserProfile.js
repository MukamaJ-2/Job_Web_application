import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

class UserProfile extends Model {}

UserProfile.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  phone: {
    type: DataTypes.STRING(20),
    validate: {
      is: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
    }
  },
  address: DataTypes.TEXT,
  resumeUrl: {
    type: DataTypes.STRING,
    field: 'resume_url'
  },
  companyName: {
    type: DataTypes.STRING,
    field: 'company_name'
  },
  companyWebsite: {
    type: DataTypes.STRING,
    field: 'company_website',
    validate: {
      isUrl: true
    }
  },
  companyDescription: {
    type: DataTypes.TEXT,
    field: 'company_description'
  },
  industry: DataTypes.STRING(100)
}, {
  sequelize,
  modelName: 'UserProfile',
  tableName: 'user_profiles',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default UserProfile; 