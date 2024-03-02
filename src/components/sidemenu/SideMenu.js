import React, { useState } from 'react';
import {
  Drawer, Button, List, ListItem, ListItemIcon, ListItemText, CssBaseline, ThemeProvider, createTheme,
  Avatar, Typography, Box, Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PharmacyIcon from '@mui/icons-material/LocalPharmacy'; 
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer'; 
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; 
import SettingsIcon from '@mui/icons-material/Settings'; 

// Create a dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const SideMenu = () => {
  const [state, setState] = useState({ left: false });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, [anchor]: open });
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
        <Typography variant="h6" color="white">
          Your Name
        </Typography>
      </Box>
      <List>
        {['My Prescriptions', 'Ask AI', 'Compatibility Checker'].map((text, index) => {
          const icons = [<PharmacyIcon />, <QuestionAnswerIcon />, <CheckCircleIcon />];
          return (
            <ListItem button key={text}>
              <ListItemIcon>{icons[index]}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          );
        })}
      </List>
      <Divider />
      <List>
        <ListItem button key="Settings">
          <ListItemIcon><SettingsIcon /></ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div>
        {(['left']).map((anchor) => (
          <React.Fragment key={anchor}>
            <Button onClick={toggleDrawer(anchor, true)} style={{ color: 'white', minHeight: '60px' }}>
              <MenuIcon />
            </Button>
            <Drawer
              anchor={anchor}
              open={state[anchor]}
              onClose={toggleDrawer(anchor, false)}
            >
              {list(anchor)}
            </Drawer>
          </React.Fragment>
        ))}
      </div>
    </ThemeProvider>
  );
};

export default SideMenu;
export {darkTheme};
