import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { updateProfile, updateResume } from '../../store/slices/userSlice';
import { toast } from 'react-toastify';

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  title: Yup.string().required('Professional title is required'),
  summary: Yup.string()
    .min(100, 'Summary must be at least 100 characters')
    .required('Professional summary is required'),
  skills: Yup.array().min(1, 'At least one skill is required'),
  experience: Yup.array().of(
    Yup.object().shape({
      title: Yup.string().required('Job title is required'),
      company: Yup.string().required('Company name is required'),
      startDate: Yup.date().required('Start date is required'),
      endDate: Yup.date().nullable(),
      current: Yup.boolean(),
      description: Yup.string().required('Job description is required'),
    })
  ),
  education: Yup.array().of(
    Yup.object().shape({
      degree: Yup.string().required('Degree is required'),
      institution: Yup.string().required('Institution is required'),
      graduationYear: Yup.number().required('Graduation year is required'),
    })
  ),
});

const Profile = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.user);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      await dispatch(updateProfile(values));
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        // Here you would typically upload the file to your server
        // and get back a URL
        const formData = new FormData();
        formData.append('resume', file);
        
        // Mock URL for now
        const resumeUrl = URL.createObjectURL(file);
        await dispatch(updateResume(resumeUrl));
        toast.success('Resume uploaded successfully');
      } catch (error) {
        toast.error('Failed to upload resume');
      }
    }
  };

  return (
    <div className="profile-container">
      <h1>My Profile</h1>

      <Formik
        initialValues={profile || {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          title: '',
          summary: '',
          skills: [],
          experience: [],
          education: [],
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, values, setFieldValue }) => (
          <Form className="profile-form">
            <div className="form-section">
              <h2>Personal Information</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name*</label>
                  <Field
                    type="text"
                    name="firstName"
                    className={errors.firstName && touched.firstName ? 'error' : ''}
                  />
                  {errors.firstName && touched.firstName && (
                    <div className="error-message">{errors.firstName}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name*</label>
                  <Field
                    type="text"
                    name="lastName"
                    className={errors.lastName && touched.lastName ? 'error' : ''}
                  />
                  {errors.lastName && touched.lastName && (
                    <div className="error-message">{errors.lastName}</div>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email*</label>
                  <Field
                    type="email"
                    name="email"
                    className={errors.email && touched.email ? 'error' : ''}
                  />
                  {errors.email && touched.email && (
                    <div className="error-message">{errors.email}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone*</label>
                  <Field
                    type="tel"
                    name="phone"
                    className={errors.phone && touched.phone ? 'error' : ''}
                  />
                  {errors.phone && touched.phone && (
                    <div className="error-message">{errors.phone}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Professional Information</h2>
              
              <div className="form-group">
                <label htmlFor="title">Professional Title*</label>
                <Field
                  type="text"
                  name="title"
                  className={errors.title && touched.title ? 'error' : ''}
                />
                {errors.title && touched.title && (
                  <div className="error-message">{errors.title}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="summary">Professional Summary*</label>
                <Field
                  as="textarea"
                  name="summary"
                  rows="4"
                  className={errors.summary && touched.summary ? 'error' : ''}
                />
                {errors.summary && touched.summary && (
                  <div className="error-message">{errors.summary}</div>
                )}
              </div>

              <div className="form-group">
                <label>Resume</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="file-input"
                />
                <p className="help-text">
                  Accepted formats: PDF, DOC, DOCX. Max size: 5MB
                </p>
              </div>
            </div>

            <div className="form-section">
              <h2>Skills</h2>
              {/* Add skill input with tags */}
            </div>

            <div className="form-section">
              <h2>Experience</h2>
              {/* Add experience form array */}
            </div>

            <div className="form-section">
              <h2>Education</h2>
              {/* Add education form array */}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Profile; 