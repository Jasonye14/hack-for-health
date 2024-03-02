import React, { useState } from 'react';
import {
  Container,Typography,
  Accordion,AccordionSummary,
  AccordionDetails,Grid,Avatar,
  CssBaseline,ThemeProvider,
  createTheme,Drawer,Button,
  List,ListItem,ListItemIcon,
  ListItemText,Box,Divider
} from '@mui/material';

// Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import PharmacyIcon from '@mui/icons-material/LocalPharmacy';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';

// Custom Components
import './dashboard.css';
import SideMenu from '../../components/sidemenu/SideMenu';

// Images
import Amox from '../../images/amoxicillin-nobg.png';
import Aceto from '../../images/aceto_nobg.png';

// Fake data
const initialPrescriptions = [
  { id: 1, name: 'Amoxicillin', details: 'Details about Drug A',
    dateTime: '2023-03-02 10:00', schedule: 'Every 8 hours',
    imageUrl: Amox, expanded: false
  },
  { id: 2, name: 'Acetominaphen', details: 'Details about Drug B',
    dateTime: '2023-03-03 10:00', schedule: 'Every 12 hours',
    imageUrl: Aceto, expanded: false
  },
];

function Dashboard() {
  const [prescriptions, setPrescriptions] = useState(initialPrescriptions);

  const handlePanelClick = (prescID) => {    
    let changedPrescriptions = [...prescriptions] // NEED spread operator (need to make copy)
    const prescToModify = changedPrescriptions.find(p => p.id === prescID);
    if (prescToModify) {
      prescToModify['expanded'] = !(prescToModify['expanded']); // Expand/shrink
    }
    setPrescriptions(changedPrescriptions);
  };

  return (
    <>
      <SideMenu />
      <Container maxWidth="md" sx={{ mt: 0}}>
        <Typography variant="h2" gutterBottom>
          Prescription Tracker
        </Typography>
        {prescriptions.map((p) => (
          <Accordion
            key={p.id}
            expanded={p.expanded}
            onChange={() => handlePanelClick(p.id)}
            className='panel'
          >
            {/* Unexpanded panel info */}
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel${p.id}bh-content`} id={`panel${p.id}bh-header`}>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Box component="img" alt={p.name} src={p.imageUrl} className='panel-image'></Box>
                </Grid>
                <Grid item xs>
                  <Typography sx={{ width: '33%', flexShrink: 0 }}>
                    {p.name}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>Purchased: {p.dateTime}</Typography>
                </Grid>
              </Grid>
            </AccordionSummary>

            {/* Drug Details */}
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
