import React, { useEffect, useState } from 'react';
import {
  Container,Typography,
  Accordion,AccordionSummary,
  AccordionDetails,Grid,
  Box,TextField
} from '@mui/material';
// import { GoogleGenerativeAI } from "@google/generative-ai";

// Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import PendingIcon from '@mui/icons-material/Pending';

// Custom Components
import '../dashboard/dashboard.css';
import SideMenu from '../../components/sidemenu/SideMenu';
// import CheckCompatibleGemini from '../../functions/gemini_compatible_checker';

// Fake data
import fakePrescriptions from '../dashboard/fake_data';

// Compatability Icons
const compatibleIcons = {
  'yes': <CheckOutlinedIcon className='compatible-icon'/>,
  'no': <ClearOutlinedIcon className='noncompatible-icon'/>,
  'maybe': <ReportProblemOutlinedIcon className='mcompatible-icon'/>,
  'pending': <PendingIcon className='pcompatible-icon'/>
}

// const endPrompt = "? Give a single response answer 'yes', 'no', 'maybe' in lowercase."
//                 + "If the object given isn't recognized, reply with 'maybe' and give a "
//                 + "explanation as described in the next sentence. If 'no' or 'maybe', "
//                 + "add colon, then a small description why. DON'T give anything else.";

function CompatabilityChecker() {
  // const genAI = new GoogleGenerativeAI("AIzaSyDilnhNZuB5EDltsTx2JgnnvsUg0mkPa1E");
  const [prescriptions, setPrescriptions] = useState(fakePrescriptions);
  const [geminiResponse, setGeminiResponse] = useState(null);

  // Check compatability w/ Gemini
  // const checkCompatability = (newPrescID, newPrescName, oldPrescArray) => {
  //   let prompt = `Is medicine ${newPrescName} compatible with ` + oldPrescArray.join(", ") + endPrompt;
  //   console.log(prompt)
  //   CheckCompatibleGemini(genAI, prompt).then((res) => {
  //     let responses = res.split(":");
  //     setGeminiResponse([newPrescID, ...responses]);
  //   });
  // }

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
          Compatability Checker 
        </Typography>
        <Typography variant="h4" gutterBottom>
          Current Prescriptions
        </Typography>
        <TextField
          id="outlined-search"
          label=""
          type="search"
          fullWidth
        />
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
                    Compatability Details: {p.compatibleDetails ?? "Nothing here..."}
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