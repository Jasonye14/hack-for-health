import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography, Avatar } from '@mui/material';
import SideMenu from '../../components/sidemenu/SideMenu';

const SettingsPage = () => {
  const [name, setName] = useState('');
  const [profilePic, setProfilePic] = useState('');

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Create a URL for the file: this URL will be used to preview the image
      const fileUrl = URL.createObjectURL(file);
      setProfilePic(fileUrl);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Process form data here (e.g., update user profile)
    console.log('Name:', name);
    console.log('Profile Picture:', profilePic);
    //handle actual file upload logic => firebase
  };

  return (
    <>
    <SideMenu></SideMenu>
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Settings
      </Typography>
      <Box
        component="form"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
        onSubmit={handleSubmit}
      >
        <TextField
          fullWidth
          label="Name"
          variant="outlined"
          value={name}
          onChange={handleNameChange}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'primary.main',
              },
              '&:hover fieldset': {
                borderColor: 'primary.light',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'secondary.main',
              },
            },
          }}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={profilePic}
            alt="Profile Picture"
            sx={{ width: 100, height: 100 }}
          />
          <Button
            variant="contained"
            component="label"
            sx={{ mt: 2 }}
          >
            Upload Profile Picture
            <input
              type="file"
              hidden
              onChange={handleProfilePicChange}
            />
          </Button>
        </Box>
        <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
          Save Changes
        </Button>
      </Box>
    </Container>
    </>
  );
};

export default SettingsPage;
