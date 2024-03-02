import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/firebaseConfig'; // Adjust this path as needed
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Button, TextField, Container, Typography, Box, Snackbar, Alert, Grid, Link } from '@mui/material';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSnackbarMessage('Signup successful. Welcome!');
      setOpenSnackbar(true);
      navigate('/'); // Navigate to home or dashboard as needed
    } catch (error) {
      console.error(error);
      // Reset previous message
      setSnackbarMessage('');

      // Check error code and set the message accordingly
      switch (error.code) {
        case 'auth/invalid-email':
          setSnackbarMessage('Invalid email format.');
          break;
        case 'auth/weak-password':
          setSnackbarMessage('Password is too weak. Please use at least 6 characters.');
          break;
        case 'auth/email-already-in-use':
          setSnackbarMessage('Email is already in use. Please use a different email.');
          break;
        default:
          setSnackbarMessage('Signup failed. Please try again later.');
          break;
      }

      setOpenSnackbar(true);
    }
  };


  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setSnackbarMessage('Google sign-in successful. Welcome!');
      setOpenSnackbar(true);
      navigate('/');
    } catch (error) {
      console.error(error);
      setSnackbarMessage('Google sign-in failed. Please try again.');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Box sx={{ width: '100%', maxWidth: 450, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Sign Up</Typography>
        <Box component="form" onSubmit={handleSignup} noValidate>
          <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            required
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            required
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign Up
          </Button>

          <Button fullWidth variant="outlined" sx={{ mt: 1, mb: 2 }} onClick={signInWithGoogle}>
            Sign up with Google
          </Button>

          <Grid container>
            <Grid item xs>
              <Link href='\login' variant="body2">
                Already have an account?
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </Container>
  );
};

export default Signup;
