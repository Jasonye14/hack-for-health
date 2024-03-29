import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/firebaseConfig';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Button, TextField, Container, Typography, Box, Snackbar, Alert, Grid, Link, AppBar, Toolbar, Drawer, IconButton, useTheme } from '@mui/material';
import { getDatabase, ref, set, get } from "firebase/database";
import { styled} from '@mui/system';
import MenuIcon from '@mui/icons-material/Menu';


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


  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  //THIS SECTION IS KEVIN CODE. IT IS FOR THE BAR MENU AND THE SCROLL TO TOP FUNCTION
  const theme = useTheme();

  const [state, setState] = React.useState({
    mobileView: false,
    drawerOpen: false,
  });

  const { mobileView, drawerOpen } = state;

  React.useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 600
        ? setState((prevState) => ({ ...prevState, mobileView: true }))
        : setState((prevState) => ({ ...prevState, mobileView: false }));
    };

    setResponsiveness();
    window.addEventListener("resize", () => setResponsiveness());
  }, []);

  const HoverButton = styled(Button)(({ theme }) => ({
    '&:hover': {
      backgroundColor: '#90caf9',
      color: 'white',
    },
  }));

  const handleHomeClick = async () => {
    navigate('/');
  };

  const displayDesktop = () => {
    return (
      <Toolbar>
        <HoverButton color="inherit" style={{ color: "white", fontSize: "1.2rem" }} onClick={handleHomeClick}>
          Home
        </HoverButton>
      </Toolbar>
    );
  };

  const displayMobile = () => {
    const handleDrawerOpen = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: true }));
    const handleDrawerClose = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: false }));

    return (
      <Toolbar>
        <IconButton
          {...{
            edge: "start",
            color: "inherit",
            "aria-label": "menu",
            "aria-haspopup": "true",
            onClick: handleDrawerOpen,
          }}
        >
          <MenuIcon />
        </IconButton>

        <Drawer
          {...{
            anchor: "left",
            open: drawerOpen,
            onClose: handleDrawerClose,
          }}
        >
        </Drawer>

        
      </Toolbar>
    );
  };

  return (
    <Container style={{ width: '100%', height: '100vh' }}>
        <AppBar position="static" style={{ backgroundColor: theme.palette.background.default }} elevation={0}>
          <Toolbar style={{ padding: '20px' }}>
            <Typography variant="h3" component="div" style={{ flexGrow: 1, color: 'white' }} >
              PillPair
            </Typography>
            {mobileView ? displayMobile() : displayDesktop()}
          </Toolbar>
        </AppBar>
      <Box sx={{ marginTop: -3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Grid container>
            <Grid item xs>
            </Grid>
          </Grid>
        </Box>
        <Container sx={{ marginTop: -7, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <Box sx={{ width: '100%', maxWidth: 450, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ mb: 2 }}>SIGN UP</Typography>         
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
