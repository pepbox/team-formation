import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

interface SoundPermissionModalProps {
  needsPermission: boolean;
  onPermissionGranted: () => void;
  onPermissionDenied: () => void;
}

const SoundPermissionModal: React.FC<SoundPermissionModalProps> = ({
  needsPermission,
  onPermissionGranted,
  onPermissionDenied
}) => {
  const handleGrantPermission = () => {
    console.log("Audio permission granted");
    onPermissionGranted();
  };

  const handleDeny = () => {
    onPermissionDenied();
  };

  return (
    <Dialog 
      open={needsPermission} 
      maxWidth="sm" 
      fullWidth 
      disableEscapeKeyDown
    >
      <DialogTitle>Audio Permission Required</DialogTitle>
      <DialogContent>
        <Typography>
          This app would like to play background music and sound effects to enhance your experience. 
          Click "Allow Audio" to enable sounds, or "Continue Without Sound" to proceed silently.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button 
          variant='outlined' 
          onClick={handleDeny} 
          sx={{color:"#fff"}}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleGrantPermission} // Use handleGrantPermissionSimple for simpler approach
          variant="contained" 
          color="primary"
        >
          Allow Audio
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SoundPermissionModal;