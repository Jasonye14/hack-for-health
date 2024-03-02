import React, { useState } from 'react';
import { Container, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import SideMenu from '../../components/sidemenu/SideMenu';

const MyHistoryPage = () => {
  const [historyEntries, setHistoryEntries] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newEntry, setNewEntry] = useState('');
  const [newNote, setNewNote] = useState('');

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewNote(''); // Reset the note input when closing dialog
  };

  const handleAddEntry = () => {
    if (newEntry.trim() !== '') {
      setHistoryEntries([...historyEntries, { id: Date.now(), text: newEntry, notes: [] }]);
      setNewEntry('');
      handleCloseDialog();
    }
  };

  const handleDeleteEntry = (id) => {
    setHistoryEntries(historyEntries.filter(entry => entry.id !== id));
  };

  const handleAddNote = (id) => {
    setHistoryEntries(historyEntries.map(entry => {
      if (entry.id === id && newNote.trim() !== '') {
        return { ...entry, notes: [...entry.notes, newNote] };
      }
      return entry;
    }));
    setNewNote('');
  };

  return (
  <>
    <SideMenu/>
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        My Medical History
      </Typography>
      <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={handleOpenDialog} sx={{ mb: 2 }}>
        Add Entry
      </Button>
      {historyEntries.map((entry) => (
        <Accordion key={entry.id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{entry.text} - Added on {new Date(entry.id).toLocaleDateString()}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle1">Notes:</Typography>
            <List>
              {entry.notes.map((note, index) => (
                <ListItem key={index}>
                  <ListItemText primary={note} />
                </ListItem>
              ))}
            </List>
            <TextField
              margin="dense"
              id={`note-${entry.id}`}
              label="Add Note"
              type="text"
              fullWidth
              variant="outlined"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddNote(entry.id)}
            />
            <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteEntry(entry.id)}>
              <DeleteIcon />
            </IconButton>
          </AccordionDetails>
        </Accordion>
      ))}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add New History Entry</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Medical History Entry"
            type="text"
            fullWidth
            variant="outlined"
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAddEntry}>Add</Button>
        </DialogActions>
      </Dialog>
    </Container>
  </>
  );
};

export default MyHistoryPage;
