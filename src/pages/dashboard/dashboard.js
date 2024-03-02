import React, { useEffect, useState } from 'react';
import {
  Container,Typography,
  Accordion,AccordionSummary,
  AccordionDetails,Grid,Avatar,
  CssBaseline,ThemeProvider,
  createTheme,Drawer,Button,
  List,ListItem,ListItemIcon,
  ListItemText,Box,Divider, Dialog, DialogTitle,
  DialogActions, DialogContent, TextField
} from '@mui/material';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { v4 as uuidv4 } from 'uuid';


// Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import PharmacyIcon from '@mui/icons-material/LocalPharmacy';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import PendingIcon from '@mui/icons-material/Pending';

// Custom Components
import './dashboard.css';
import SideMenu from '../../components/sidemenu/SideMenu';
import CheckCompatibleGemini from '../../functions/gemini_compatible_checker';

// Images
import Amox from '../../images/amoxicillin-nobg.png';
import Aceto from '../../images/aceto_nobg.png';

// Fake data
import fakePrescriptions from './fake_data';

const compatibleIcons = {
  'yes': <CheckOutlinedIcon className='compatible-icon'/>,
  'no': <ClearOutlinedIcon className='compatible-icon'/>,
  'maybe': <ReportProblemOutlinedIcon className='compatible-icon'/>,
  'pending': <PendingIcon className='compatible-icon'/>
}

const endPrompt = `? Give a single response answer 'yes', 'no', 'maybe' in lowercase considering all the options. If the medicine isn't recognized, reply with 'maybe' and give a explanation as described in the next sentence. If 'no' or 'maybe', add colon, then a small description why. DON'T give anything else.`;

function Dashboard() {
  const genAI = new GoogleGenerativeAI("AIzaSyDilnhNZuB5EDltsTx2JgnnvsUg0mkPa1E");
  const [prescriptions, setPrescriptions] = useState(fakePrescriptions);
  const [openDialog, setOpenDialog] = useState(false);
  const [geminiResponse, setGeminiResponse] = useState(null);
  const [newPrescription, setNewPrescription] = useState({ // State for the new prescription fields
    name: '',
    dosage: '',
    frequency: '',
    duration: '',
    dateAdded:'',
    expanded: false,
    compatible: 'pending',
    compatibleDetails: ''
  });

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  // Update the state as the user types in the fields
  const handleChange = (prop) => (event) => {
    setNewPrescription({ ...newPrescription, [prop]: event.target.value });
  };

  // Handle the action of adding a new prescription (placeholder functionality)
  const handleAddEntry = () => {
    const newPrescName = newPrescription['name'];
    const newPrescID = uuidv4();

    const oldPresc = []
    for (let i = 0; i < prescriptions.length; i++) {
      oldPresc.push(prescriptions[i].name)
    }
    // Add in ID and dateAdded fields
    setPrescriptions([...prescriptions,
      {...newPrescription, dateAdded: new Date().toLocaleTimeString(), id: newPrescID}
    ]);
    console.log('Adding new prescription:', newPrescription);
    // Here you would typically add the prescription to your application's state or backend
    handleCloseDialog(); // Close the dialog after adding
    checkCompatability(newPrescID, newPrescName, oldPresc);
    setNewPrescription({
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      dateAdded:'',
      expanded: false,
      compatible: 'pending',
      compatibleDetails: 'Nothing so far...'
    });
  };

  // Check compatability w/ Gemini
  const checkCompatability = (newPrescID, newPrescName, oldPrescArray) => {
    let prompt = `Is medicine ${newPrescName} compatible with ` + oldPrescArray.join(", ") + endPrompt;
    console.log(prompt)
    CheckCompatibleGemini(genAI, prompt).then((res) => {
      let responses = res.split(":");
      setGeminiResponse([newPrescID, ...responses]);
    });
  }

  useEffect(() => {
    console.log(prescriptions);
    if (geminiResponse) {
      console.log(geminiResponse);
      let changedPrescriptions = [...prescriptions] // NEED spread operator (need to make copy)
      const prescToModify = changedPrescriptions.find(p => p.id === geminiResponse[0]);
      if (prescToModify) {
        prescToModify['compatible'] = geminiResponse[1]; // 'yes', 'no', 'maybe'
      }

      if (geminiResponse.length > 2) {
        prescToModify['comptatibleDetails'] = geminiResponse[2]; // detailed explanation of compatability
      }
      
      setPrescriptions(changedPrescriptions);
      setGeminiResponse(null);
    }
  }, [prescriptions, geminiResponse]);

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
        <Button variant="contained"
          startIcon={<PharmacyIcon />}
          sx={{ mb: 2 }}
          onClick={handleOpenDialog}
        >
          Add Prescription
        </Button>
        {prescriptions.map((p) => (
          <Accordion
            key={p.id}
            expanded={p.expanded}
            onChange={() => handlePanelClick(p.id)}
            className='panel'
          >
            {/* Unexpanded panel info */}
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel${p.id}bh-content`} id={p.id}>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Box className='compatible-icon-wrapper'>
                    {compatibleIcons[p.compatible]}
                  </Box>
                </Grid>
                <Grid item>
                  <Box component="img" alt={p.name} src={p.imageUrl} className='panel-image'></Box>
                </Grid>
                <Grid item xs>
                  <Typography variant="h6" sx={{ width: '90%', flexShrink: 0 }}>
                    {p.name}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>Added: {p.dateAdded}</Typography>
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
                <Grid item xs={12}>
                  <Typography>
                    Compatability Details:<br/> {p.compatibleDetails}
                  </Typography>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add New Prescription</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Drug Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newPrescription.name}
            onChange={handleChange('name')}
          />
          <TextField
            margin="dense"
            id="dosage"
            label="Dosage"
            type="text"
            fullWidth
            variant="outlined"
            value={newPrescription.dosage}
            onChange={handleChange('dosage')}
          />
          <TextField
            margin="dense"
            id="frequency"
            label="Frequency"
            type="text"
            fullWidth
            variant="outlined"
            value={newPrescription.frequency}
            onChange={handleChange('frequency')}
          />
          <TextField
            margin="dense"
            id="duration"
            label="Duration"
            type="text"
            fullWidth
            variant="outlined"
            value={newPrescription.duration}
            onChange={handleChange('duration')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAddEntry}>Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Dashboard;
