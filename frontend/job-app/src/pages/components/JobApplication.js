import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Stack
} from '@mui/material';
import { applyForJob } from '../store/slices/jobSlice';

const JobApplication = ({ open, handleClose, jobId, jobTitle }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.jobs);
  
  const [formData, setFormData] = useState({
    coverLetter: '',
    experience: '',
    portfolio: '',
    resume: ''
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(applyForJob({ jobId, applicationData: formData })).unwrap();
      setSuccess(true);
      setTimeout(() => {
        handleClose();
        setSuccess(false);
        setFormData({
          coverLetter: '',
          experience: '',
          portfolio: '',
          resume: ''
        });
      }, 2000);
    } catch (err) {
      console.error('Application failed:', err);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="div" gutterBottom>
          Apply for {jobTitle}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Application submitted successfully!
            </Alert>
          )}

          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Resume Link"
              name="resume"
              value={formData.resume}
              onChange={handleChange}
              placeholder="Link to your resume (Google Drive, Dropbox, etc.)"
              required
              helperText="Please provide a link to your resume"
            />

            <TextField
              fullWidth
              label="Portfolio"
              name="portfolio"
              value={formData.portfolio}
              onChange={handleChange}
              placeholder="Link to your portfolio or GitHub profile"
              helperText="Optional: Share your work samples"
            />

            <TextField
              fullWidth
              label="Experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              multiline
              rows={3}
              required
              placeholder="Briefly describe your relevant experience"
              helperText="Highlight your key achievements and skills"
            />

            <TextField
              fullWidth
              label="Cover Letter"
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleChange}
              multiline
              rows={5}
              required
              placeholder="Write your cover letter"
              helperText="Explain why you're the perfect candidate for this position"
            />
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} variant="outlined" disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? 'Submitting...' : 'Submit Application'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JobApplication; 