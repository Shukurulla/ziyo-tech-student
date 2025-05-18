// src/components/FileUploadProgress.jsx
import React from "react";
import { LinearProgress, Typography, Box } from "@mui/material";

const FileUploadProgress = ({ progress, fileName }) => {
  return (
    <Box className="mb-4">
      <div className="flex justify-between mb-1">
        <Typography variant="body2">{fileName}</Typography>
        <Typography variant="body2">{Math.round(progress)}%</Typography>
      </div>
      <LinearProgress
        variant="determinate"
        value={progress}
        className="h-2 rounded-full"
      />
    </Box>
  );
};

export default FileUploadProgress;
