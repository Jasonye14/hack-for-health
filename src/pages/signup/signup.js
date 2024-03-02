import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/firebaseConfig'; // Adjust this path as needed
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Button, TextField, Container, Typography, Box, Snackbar, Alert, Grid, Link, AppBar, Toolbar, Drawer, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { getDatabase, ref, set } from "firebase/database";
import { styled} from '@mui/system';
import logo from '../../images/PillPair.webp'; 
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
      // add any other user info you'd like to store
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

  //THIS SECTION IS KEVIN CODE. IT IS FOR THE BAR MENU AND THE SCROLL TO TOP FUNCTION
  const [loading, setLoading] = React.useState(false);

  const delay = (duration) => new Promise(resolve => setTimeout(resolve, duration));


  const [state, setState] = React.useState({
    mobileView: false,
    drawerOpen: false,
  });

  const { mobileView, drawerOpen } = state;
  
  const handleSignInClick = async () => {
    setLoading(true);
    await delay(500); // Wait for .5 seconds
    setLoading(false);
    navigate('/login');
  };

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

  const displayDesktop = () => {
    return (
      <Toolbar>
        <HoverButton color="inherit" style={{ color: "white" }} >Home</HoverButton>
        <HoverButton color="inherit" style={{ color: "white" }} >Sign In</HoverButton>
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
          <List>
            {['Home', 'About', 'Contact', 'Credits'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Drawer>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Logo
        </Typography>
      </Toolbar>
    );
  };



  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Container>
      <AppBar position="sticky" style={{ backgroundColor: '#121212', boxShadow: 'none' }}>
          <Toolbar style={{ padding: '20px' }}>
            <img src={logo} alt="PillPair" style={{ height: '40px', marginRight: '10px' }}  />
            <Typography variant="h4" component="div" style={{ flexGrow: 1, color: 'white' }} >
              PillPair
            </Typography>
            {mobileView ? displayMobile() : displayDesktop()}
          </Toolbar>
        </AppBar>
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
