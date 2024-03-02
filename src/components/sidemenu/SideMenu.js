import React, { useState } from 'react';
import { Drawer, Button, List, ListItem, ListItemIcon, ListItemText, Avatar, Typography, Box, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PharmacyIcon from '@mui/icons-material/LocalPharmacy'; 
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer'; 
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; 
import SettingsIcon from '@mui/icons-material/Settings'; 
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const SideMenu = () => {
  const [state, setState] = useState({ left: false });
  const navigate = useNavigate(); // Hook for navigation

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const handleNavigation = (path) => {
    // Navigate to the specified path
    navigate(path);
  };

  const list = (anchor) => (
    <Box
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
      sx={{ width: 250, backgroundColor: '#171717', height: '100%' }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
        <Avatar src="profile_pic_url_here" sx={{ marginRight: 2 }} />
        <Typography variant="h6" color="white">Your Name</Typography>
      </Box>
      <List>
        {/* Update the paths array to reflect the specific routes */}
        {['My Prescriptions', 'Ask AI', 'Compatibility Checker', 'My History'].map((text, index) => {
          const icons = [<PharmacyIcon />, <QuestionAnswerIcon />, <CheckCircleIcon />, <HistoryIcon/>];
          const paths = ['/my-prescriptions', '/gemini-chat-bot', '/compatability-checker', '/history'];
          return (
            <ListItem button key={text} onClick={() => handleNavigation(paths[index])}>
              <ListItemIcon>{icons[index]}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          );
        })}
      </List>
      <Divider />
      <List>
        <ListItem button key="Settings" onClick={() => handleNavigation('/settings')}>
          <ListItemIcon><SettingsIcon /></ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
        <ListItem button key="Log Out" onClick={() => handleNavigation('/')}>
          <ListItemIcon><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Log Out" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div>
      {(['left']).map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)} style={{ color: 'white', minHeight: '60px' }}>
            <MenuIcon />
          </Button>
          <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
};

export default SideMenu;
