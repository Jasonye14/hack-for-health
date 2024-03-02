import React, { useState } from 'react';
import { Container, Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Avatar, CssBaseline, ThemeProvider, createTheme, Drawer, Button, List, ListItem, ListItemIcon, ListItemText, Box, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import PharmacyIcon from '@mui/icons-material/LocalPharmacy';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import SideMenu from '../../components/sidemenu/SideMenu';

const initialPrescriptions = [
  { id: 1, name: 'Drug A', details: 'Details about Drug A', dateTime: '2023-03-02 10:00', schedule: 'Every 8 hours', imageUrl: 'https://via.placeholder.com/40', expanded: false},
  { id: 2, name: 'Drug B', details: 'Details about Drug B', dateTime: '2023-03-03 10:00', schedule: 'Every 12 hours', imageUrl: 'https://via.placeholder.com/40', expanded: false},
  // Add more prescriptions here, each with their own imageUrl
];

function Dashboard() {
  const [prescriptions, setPrescriptions] = useState(initialPrescriptions);

  const handleChange = (pID) => {
    const prescToModify = prescriptions.find(p => p.id === pID);
    if (prescToModify) {
      prescToModify['expanded'] = !prescToModify['expanded'];
      // setExpandedPanels([...prescriptions]); // This triggers a re-render with the updated state
    }
  };

  return (
    <>
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
    </>
  );
}

export default Dashboard;
