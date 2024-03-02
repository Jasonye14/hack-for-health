import React, { useState } from 'react';
import { Container, Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Avatar, CssBaseline, ThemeProvider, createTheme, Drawer, Button, List, ListItem, ListItemIcon, ListItemText, Box, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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

const prescriptions = [
  { id: 1, name: 'Drug A', details: 'Details about Drug A', dateTime: '2023-03-02 10:00', schedule: 'Every 8 hours', imageUrl: 'https://via.placeholder.com/40', expanded: false},
  { id: 2, name: 'Drug B', details: 'Details about Drug B', dateTime: '2023-03-03 10:00', schedule: 'Every 12 hours', imageUrl: 'https://via.placeholder.com/40', expanded: false},
  // Add more prescriptions here, each with their own imageUrl
];

function Dashboard() {
  const [expandedPanels, setExpandedPanels] = useState([]);

  const handleChange = (pID) => {
    const prescToModify = prescriptions.find(p => p.id === pID);
    if (prescToModify) {
      prescToModify['expanded'] = !prescToModify['expanded'];
      setExpandedPanels([...prescriptions]); // This triggers a re-render with the updated state
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <SideMenu />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Prescription Tracker
        </Typography>
        {prescriptions.map((p) => (
          <Accordion key={p.id} expanded={p.expanded} onChange={() => handleChange(p.id)}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel${p.id}bh-content`} id={`panel${p.id}bh-header`}>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Avatar alt={p.name} src={p.imageUrl} />
                </Grid>
                <Grid item xs>
                  <Typography sx={{ width: '33%', flexShrink: 0 }}>
                    {p.name}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>Purchased: {p.dateTime}</Typography>
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography>
                    Details: {p.details}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    Schedule: {p.schedule}
                  </Typography>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
    </ThemeProvider>
  );
}

export default Dashboard;
