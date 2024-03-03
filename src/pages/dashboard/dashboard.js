import React, { useEffect, useState } from 'react';
import {
  Container, Typography,
  Accordion, AccordionSummary,
  AccordionDetails, Grid, Button,
  Box, Dialog, DialogTitle,
  DialogActions, DialogContent, TextField
} from '@mui/material';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Custom Components
import './dashboard.css';
import SideMenu from '../../components/sidemenu/SideMenu';
import CheckCompatibleGemini from '../../functions/gemini_compatible_checker';

// Firebase
import { getDatabase, ref, set, push, onValue, off } from 'firebase/database';
import { auth } from '../../firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

// Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PharmacyIcon from '@mui/icons-material/LocalPharmacy';
import compatibleIcons from '../../components/compatibleIcon/compatibleIcon';
import DeleteIcon from '@mui/icons-material/Delete';


const endPrompt = `? Give a single response answer 'yes', 'no', 'maybe' in lowercase considering all the options. If the medicine isn't recognized, reply with 'maybe' and give a explanation as described in the next sentence. If 'no' or 'maybe', add colon, then a small, detailed explanation why. DON'T give anything else.`;

function Dashboard() {
  const genAI = new GoogleGenerativeAI("AIzaSyDilnhNZuB5EDltsTx2JgnnvsUg0mkPa1E");
  const [prescriptions, setPrescriptions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [userId, setUserId] = useState(null);
  const [newPrescription, setNewPrescription] = useState({ // State for the new prescription fields
    name: '',
    dosage: '',
    frequency: '',
    duration: '',
    dateAdded: '',
    expanded: false,
    compatible: 'pending',
    compatibleDesc: ''
  });

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  // User inputting new prescription...
  const handleChange = (prop) => (event) => {
    setNewPrescription({ ...newPrescription, [prop]: event.target.value });
  };

  // Expand/shrink panel
  const handlePanelClick = (prescID) => {
    let changedPrescriptions = [...prescriptions] // NEED spread operator (need to make copy)
    const prescToModify = changedPrescriptions.find(p => p.id === prescID);
    if (prescToModify) {
      prescToModify['expanded'] = !(prescToModify['expanded']); // Expand/shrink
    }
    setPrescriptions(changedPrescriptions);
  };

  // Handle adding new prescription
  // 1. Check compatability w/ Gemini
  // 2. Post to firebase
  // 3. Update prescriptions state
  const handleAddEntry = async () => {
    let res = await checkCompatability();
    handlePostFirebase(res[0], res[1] ?? "Nothing here...");
    updatePrescriptions();
  };

  // Check compatability w/ Gemini
  const checkCompatability = async () => {
    const currPrescNames = [...prescriptions.map(p => p.name)]
    let prompt = `Is medicine '${newPrescription.name}' compatible with ` + currPrescNames.join(", ") + endPrompt;
    console.log(prompt)
    const res = await CheckCompatibleGemini(genAI, prompt);
    const responses = res.replace(/[\r\n]+/g, '').split(":");
    return responses;
  }

  // POST prescription to Firebase
  const handlePostFirebase = (compatible, compatibleDesc) => {
    if (!userId) return; // Ensure we have a user ID
    const db = getDatabase();
    const userPrescriptionsRef = ref(db, `/users/${userId}/prescriptions`);
    const newPrescriptionRef = push(userPrescriptionsRef);
    set(newPrescriptionRef, {
      ...newPrescription,
      compatible: compatible,
      compatibleDesc: compatibleDesc,
      dateAdded: new Date().toISOString(),
    }).then(() => {
      console.log('New prescription added.');
      handleCloseDialog();
      setNewPrescription({
        name: '',
        dosage: '',
        frequency: '',
        duration: '',
        dateAdded: '',
        expanded: false,
        compatible: "pending",
        compatibleDesc: "Nothing here..."
      });
    }).catch((error) => {
      console.error("Could not add prescription: ", error);
    });
  }

  // Retrieve data from 
  const updatePrescriptions = () => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchPrescriptions(user.uid);
      } else {
        setUserId(null);
        setPrescriptions([]);
      }
    });

    return () => unsubscribe(); // Cleanup subscription
  }

  // Load data from Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchPrescriptions(user.uid);
      } else {
        setUserId(null);
        setPrescriptions([]);
      }
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []);

  // GET user prescriptions from Firebase
  const fetchPrescriptions = (uid) => {
    const db = getDatabase();
    const userPrescriptionsRef = ref(db, `/users/${uid}/prescriptions`);

    onValue(userPrescriptionsRef, (snapshot) => {
      const prescriptionsData = snapshot.val();
      if (prescriptionsData) {
        const formattedPrescriptions = Object.keys(prescriptionsData).map((key) => ({
          id: key,
          ...prescriptionsData[key],
        }));
        setPrescriptions(formattedPrescriptions);
      } else {
        setPrescriptions([]);
      }
    });
    return () => off(userPrescriptionsRef); // Unsubscribe from this ref's updates
  };


  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deletePrescriptionId, setDeletePrescriptionId] = useState(null);

  // Open the confirmation dialog
  const handleDeleteConfirmation = (prescID) => {
    setDeletePrescriptionId(prescID);
    setOpenDeleteDialog(true);
  };

  // Close the confirmation dialog without deleting
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setDeletePrescriptionId(null);
  };

  // Handle actual deletion
  const handleDeletePrescription = () => {
    if (!deletePrescriptionId) return;
    const db = getDatabase();
    const prescriptionRef = ref(db, `/users/${userId}/prescriptions/${deletePrescriptionId}`);
    set(prescriptionRef, null) // Deletes the prescription from Firebase
      .then(() => {
        console.log('Prescription deleted successfully.');
        handleCloseDeleteDialog(); // Close the dialog on success
      })
      .catch((error) => {
        console.error('Error deleting prescription: ', error);
      });
  };

  const isFormValid = () => {
    return newPrescription.name.trim() !== '' &&
      newPrescription.dosage.trim() !== '' &&
      newPrescription.frequency.trim() !== '' &&
      newPrescription.duration.trim() !== '';
  };





  return (
    <>
      <SideMenu />
      <Container maxWidth="md" sx={{ mt: 0 }}>
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
                    Dosage: {p.dosage}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    Frequency: {p.frequency}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    Duration: {p.duration}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    Compatability Details: {p.compatibleDesc ?? "Nothing here..."}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteConfirmation(p.id)}
                    color="error"
                  >
                    Delete
                  </Button>
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
            required // Make this field required
            value={newPrescription.name}
            onChange={handleChange('name')}
          />
          <TextField
            margin="dense"
            id="dosage"
            label="Dosage (mg)" // Added unit
            type="text"
            fullWidth
            variant="outlined"
            required
            value={newPrescription.dosage}
            onChange={handleChange('dosage')}
          />
          <TextField
            margin="dense"
            id="frequency"
            label="Frequency (per day)" // Clarified instruction
            type="text"
            fullWidth
            variant="outlined"
            required
            value={newPrescription.frequency}
            onChange={handleChange('frequency')}
          />
          <TextField
            margin="dense"
            id="duration"
            label="Duration (days)" // Clarified instruction
            type="text"
            fullWidth
            variant="outlined"
            required
            value={newPrescription.duration}
            onChange={handleChange('duration')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleAddEntry}
            variant="contained"
            color="primary"
            disabled={!isFormValid()} // Button is disabled if form is not valid
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>



      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this prescription?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeletePrescription} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Dashboard;
