import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/firebaseConfig';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Button, TextField, Container, Typography, Box, Snackbar, Alert, Grid, Link } from '@mui/material';
import { getDatabase, ref, set, get } from "firebase/database";

const Signup = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();
  const database = getDatabase();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // User is signed up
    // Now, save user info in Realtime Database
    const user = userCredential.user;
    const usersRef = ref(database, 'users/' + user.uid);
    await set(usersRef, {
      email: user.email,
      firstName: name, // Store the first name
      lastName: lastName,   // Store the last name
      //more user info here
    });

      setSnackbarMessage('Signup successful. Welcome!');
      setOpenSnackbar(true);
      navigate('/dashboard'); // Navigate to home or dashboard as needed

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
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Get the display name and attempt to split it into first and last names
      const fullName = user.displayName || "";
      const names = fullName.split(' ');
      const firstName = names[0] || "";
      const lastName = names.slice(1).join(' ') || ""; // Join the remaining parts as the last name

      // Now, save user info in Realtime Database including the names
      const usersRef = ref(database, 'users/' + user.uid);
      await set(usersRef, {
        email: user.email,
        firstName: firstName, // Store the first name
        lastName: lastName,   // Store the last name
        profilePicture: user.photoURL, // You can also store the profile picture URL
      });

      setSnackbarMessage('Google sign-in successful. Welcome!');
      setOpenSnackbar(true);
      navigate('/dashboard');
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
    <Container>
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Grid container>
          <Grid item xs>
            <Link href='/' variant="body10">
              Go back 
            </Link>
          </Grid>
        </Grid>
      </Box>
      <Container sx={{ marginTop: -7, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <Box sx={{ width: '100%', maxWidth: 450, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ mb: 2 }}>Sign Up</Typography>         
          <Box component="form" onSubmit={handleSignup} noValidate>
            <TextField
              fullWidth
              variant="outlined"
              margin="normal"
              required
              label="First Name"
              type="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              fullWidth
              variant="outlined"
              margin="normal"
              required
              label="Last Name"
              type="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
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
    </Container>
  );
};

export default Signup;
