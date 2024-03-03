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

const endPrompt = "Analyze the compatibility of the given item/object with medicines given. For each prescription provided, respond with a single word: 'yes', 'no', or 'maybe', all in lowercase. Separate your responses for each prescription with a vertical bar '|'. If a given item isn't recognized as a prescription or food or if there's any uncertainty, respond with 'maybe', followed by a colon and a brief yet comprehensive explanation. In cases where the answer is 'no' or 'maybe', similarly provide a colon and then detail the reasoning in a concise manner. Do not include any additional information beyond these instructions. It's imperative to offer a response and an explanation for every drug or prescription mentioned. The prescriptions are as follows: ";

function CompatabilityChecker() {
  const genAI = new GoogleGenerativeAI("AIzaSyDilnhNZuB5EDltsTx2JgnnvsUg0mkPa1E");
  const [prescriptions, setPrescriptions] = useState([]);
  const [searchText, setSearchText] = useState("");
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
    let prompt = `Given item: ${searchText}.` + endPrompt + prescNames.join(", ");
    console.log(prompt);
    setSearchText("");
    let res = await CheckCompatibleGemini(genAI, prompt)
    let responses = res.replace(/[\r\n]+/g, '').split("|"); // NEED to trim
    console.log(responses);

    console.log(responses);
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