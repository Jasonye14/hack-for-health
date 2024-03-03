import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth} from '../../firebase/firebaseConfig'; // Adjust this path as needed
import { getDatabase, ref, set, get} from "firebase/database";
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { Button, TextField, Container, Typography, Box, Grid, Link } from '@mui/material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const database = getDatabase();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard'); // Adjust this as needed
    } catch (error) {
      setError('');
      switch (error.code) {
        case 'auth/user-not-found':
          setError('Account not found. Please check your email address.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.');
          break;
        default:
          setError('Failed to log in. Please try again later.');
          break;
      }
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Reference to the user in the Realtime Database
        const usersRef = ref(database, 'users/' + user.uid);

        // Check if the user already exists
        const snapshot = await get(usersRef);
        if (!snapshot.exists()) {
            // If user does not exist, save their info in the Realtime Database
            const fullName = user.displayName || "";
            const names = fullName.split(' ');
            const firstName = names[0] || "";
            const lastName = names.slice(1).join(' ') || ""; // Join the remaining parts as the last name

            await set(usersRef, {
                email: user.email,
                firstName: firstName, // Store the first name
                lastName: lastName,   // Store the last name
                profilePicture: user.photoURL, // Store the profile picture URL
            });
        }

        // Whether new or existing user, navigate to dashboard and show success message
        setSnackbarMessage('Google sign-in successful. Welcome!');
        setOpenSnackbar(true);
        navigate('/dashboard');
    } catch (error) {
        console.error(error);
        setSnackbarMessage('Google sign-in failed. Please try again.');
        setOpenSnackbar(true);
    }
};


  return (
    <Container>
      <Box sx={{ marginTop: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Grid container>
          <Grid item xs>
            <Link href='/' variant="body10">
              Go back 
            </Link>
          </Grid>
        </Grid>
      </Box>
      <Container maxWidth="xs">
        <Box sx={{ marginTop: 14, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <Typography color="error" textAlign="center">
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>

            <Button
              fullWidth
              variant="outlined"
              sx={{ mt: 1, mb: 2 }}
              onClick={signInWithGoogle}
            >
              Sign in with Google
            </Button>

            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs>
                <Link href='\signup' variant="body2">
                  Do not have an account?
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Container>
  );
};

export default Login;
