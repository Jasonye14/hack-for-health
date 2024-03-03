import React, { useEffect, useState } from 'react';
import {
  Container,Typography,
  Accordion,AccordionSummary,
  AccordionDetails,Grid,
  Box,TextField
} from '@mui/material';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import PendingIcon from '@mui/icons-material/Pending';

// Custom Components
import '../dashboard/dashboard.css';
import SideMenu from '../../components/sidemenu/SideMenu';
import CheckCompatibleGemini from '../../functions/gemini_compatible_checker';

// Fake data
import fakePrescriptions from '../dashboard/fake_data';

// Compatability Icons
const compatibleIcons = {
  'yes': <CheckOutlinedIcon className='compatible-icon'/>,
  'no': <ClearOutlinedIcon className='noncompatible-icon'/>,
  'maybe': <ReportProblemOutlinedIcon className='mcompatible-icon'/>,
  'pending': <PendingIcon className='pcompatible-icon'/>
}

const endPrompt = "Analyze the compatibility of the following prescriptions with the given item/object. For each prescription provided, respond with a single word: 'yes', 'no', or 'maybe', all in lowercase. Separate your responses for each prescription with a vertical bar '|'. If a given item isn't recognized as a prescription or food or if there's any uncertainty, respond with 'maybe', followed by a colon and a brief yet comprehensive explanation. In cases where the answer is 'no' or 'maybe', similarly provide a colon and then detail the reasoning in a concise manner. Do not include any additional information beyond these instructions. It's imperative to offer a response and an explanation for every drug or prescription mentioned. The prescriptions are as follows: ";

function CompatabilityChecker() {
  const genAI = new GoogleGenerativeAI("AIzaSyDilnhNZuB5EDltsTx2JgnnvsUg0mkPa1E");
  const [prescriptions, setPrescriptions] = useState(fakePrescriptions);
  const [geminiResponse, setGeminiResponse] = useState(null);
  const [searchText, setSearchText] = useState("");

  // Function to update the state based on text field input
  const handleTextFieldChange = (event) => {
    setSearchText(event.target.value);
  };

  // Check compatability w/ Gemini
  const checkCompatability = async (prescNames) => {
    let prompt = `Given item: ${searchText}.` + endPrompt + prescNames.join(", ");
    console.log(prompt);
    setSearchText("");
    let res = await CheckCompatibleGemini(genAI, prompt)
    let responses = res.replace(/[\r\n]+/g, '').split("|"); // NEED to trim
    console.log(responses);
    setGeminiResponse(responses);
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

  useEffect(() => {
    console.log(prescriptions);
    if (geminiResponse) {
      console.log(geminiResponse);
      let changedPrescriptions = [...prescriptions] // NEED spread operator (need to make copy)
      setPrescriptions(changedPrescriptions.map((p, index) => {
        const responses = geminiResponse[index].trim().split(":");
        p.compatible = responses[0].trim();
        if (responses.length > 1) {
          p.compatibleDetails = responses[1];
        }
        return p;
      }));
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
                    Compatability Details: {p.compatibleDetails}
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