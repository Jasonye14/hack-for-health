import React, { useEffect, useState } from 'react';
import {
  Container,Typography,
  Accordion,AccordionSummary,
  AccordionDetails,Grid,
  Box,TextField
} from '@mui/material';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Firebase
import { getDatabase, ref, onValue, off } from 'firebase/database';
import { auth } from '../../firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

// Custom Components
import '../dashboard/dashboard.css';
import SideMenu from '../../components/sidemenu/SideMenu';
import CheckCompatibleGemini from '../../functions/gemini_compatible_checker';

// Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import compatibleIcons from '../../components/compatibleIcon/compatibleIcon';

const endPrompt = `? Give a single response answer 'yes', 'no', 'maybe' in lowercase considering all the options. If the item/food/medicine isn't recognized, reply with 'maybe' and give a explanation as described in the next sentence. If 'no' or 'maybe', add colon, then a small, detailed explanation why. DON'T give anything else.`;

function CompatabilityChecker() {
  const genAI = new GoogleGenerativeAI("AIzaSyDilnhNZuB5EDltsTx2JgnnvsUg0mkPa1E");
  const [prescriptions, setPrescriptions] = useState([]);
  const [searchText, setSearchText] = useState("");
  // eslint-disable-next-line
  const [userId, setUserId] = useState(null);

  // Function to update the state based on text field input
  const handleTextFieldChange = (event) => {
    setSearchText(event.target.value);
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

  // Check compatability w/ Gemini
  const checkCompatability = async (prescNames) => {
    let responses = []
    for (let i = 0; i < prescNames.length; i++) {
      let prompt = `Is item/food/medicine '${searchText}' compatible with '${prescNames[i]}'` + endPrompt;
      console.log(prompt);
      setSearchText("");
      let res = await CheckCompatibleGemini(genAI, prompt)
      responses.push(res.replace(/[\r\n]+/g, '')); // NEED to trim
      console.log(responses);
    }

    let changedPrescriptions = [...prescriptions] // NEED spread operator (need to make copy)
    setPrescriptions(changedPrescriptions.map((p, index) => {
      const vals = responses[index].trim().split(":");
      p.compatible = vals[0]
      if (vals.length > 1) {
        p.compatibleDesc = vals[1];
      }
      return p;
    }));
  }

  // Handle compatability search
  const handleSearch = (event) => {
    event.preventDefault();
    const prescNames = []
    for (let i = 0; i < prescriptions.length; i++) {
      prescNames.push(prescriptions[i].name)
    }
    let changedPrescriptions = [...prescriptions] // NEED spread operator (need to make copy)
    setPrescriptions(changedPrescriptions.map(p => ({
      ...p,
      compatible: 'pending'
    })));
    console.log(prescNames)
    checkCompatability(prescNames);
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
        console.log(formattedPrescriptions)
        setPrescriptions(formattedPrescriptions);
      } else {
        setPrescriptions([]);
      }
    });
    return () => off(userPrescriptionsRef); // Unsubscribe from this ref's updates
  };

  return (
    <>
      <SideMenu />
      <Container maxWidth="md" sx={{ mt: 0}}>
        <Typography variant="h2" gutterBottom>
          Compatability Checker 
        </Typography>
        <form onSubmit={handleSearch} noValidate>
          <TextField
            id="outlined-search"
            label="Search Here..."
            type="search"
            fullWidth
            sx={{mb: 4}}
            value={searchText}
            onChange={handleTextFieldChange}
          />
        </form>

        <Typography variant="h4" gutterBottom>
          Compatible with Current Prescriptions?
        </Typography>
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
                      Compatability Details: {p.compatibleDesc}
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

export default CompatabilityChecker;