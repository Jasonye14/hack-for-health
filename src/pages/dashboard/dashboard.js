
import React, { useState } from 'react';
import { Container, Paper, Avatar, Typography, Accordion, AccordionSummary, AccordionDetails, Grid } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Custom Components
import SideMenu from '../../components/sidemenu/SideMenu';


const prescriptions = [
  { id: 1, name: 'Drug A', details: 'Details about Drug A', dateTime: '2023-03-02 10:00', schedule: 'Every 8 hours', imageUrl: 'https://via.placeholder.com/40', expanded: false},
  { id: 2, name: 'Drug B', details: 'Details about Drug B', dateTime: '2023-03-03 10:00', schedule: 'Every 12 hours', imageUrl: 'https://via.placeholder.com/40', expanded: false},
  // Add more prescriptions here, each with their own imageUrl
];

function Dashboard() {
  const [expandedPanels, setExpandedPanels] = useState([]);

  const handleChange = (pID) => {
    const prescToModify = prescriptions.find(p => p.id === pID)
    if (prescToModify) {
      // Change the field in the object
      prescToModify['expanded'] = !(prescToModify['expanded']);
      console.log('Object after modification:', prescToModify);
    } else {
      console.log('Object not found');
    }
  };

  return (
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
  );
}


export default Dashboard;
