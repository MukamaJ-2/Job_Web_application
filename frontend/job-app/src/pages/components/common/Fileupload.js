import React, { useRef } from 'react';
import { Button, Typography, Box } from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { formatFileSize } from '../../utils/helpers';

const FileUpload = ({ accept, onChange, maxSize }) => {
  const fileInputRef = useRef();
  
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    
    if (!file) return;
    
    // Check file size
    if (file.size > maxSize) {
      alert(`File size must be less than ${formatFileSize(maxSize)}`);
      return;
    }
    
    // Check file type
    const fileType = file.name.split('.').pop().toLowerCase();
    const acceptedTypes = accept.split(',').map(type => 
      type.trim().replace('.', '').toLowerCase()
    );
    
    if (!acceptedTypes.includes(fileType)) {
      alert(`Only ${accept} files are allowed`);
      return;
    }
    
    onChange(file);
  };

  return (
    <Box textAlign="center" p={2}>
      <input
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        ref={fileInputRef}
      />
      
      <Button
        variant="outlined"
        startIcon={<CloudUploadIcon />}
        onClick={() => fileInputRef.current.click()}
        sx={{ mb: 2 }}
      >
        Select CV
      </Button>
      
      <Typography variant="caption" display="block" color="textSecondary">
        Maximum file size: {formatFileSize(maxSize)}
        <br />
        Accepted formats: {accept}
      </Typography>
    </Box>
  );
};

export default FileUpload; 