import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth} from '../../firebase/firebaseConfig'; // Adjust this path as needed
import { getDatabase, ref, set} from "firebase/database";
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { Button, TextField, Container, Typography, Box, Grid, Link, useTheme, Toolbar, IconButton, Drawer, AppBar } from '@mui/material';
import { styled} from '@mui/system';
import MenuIcon from '@mui/icons-material/Menu';



const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const database = getDatabase();

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

      // Extract name and photo URL
      const fullName = user.displayName || "";
      const names = fullName.split(' ');
      const firstName = names[0] || "";
      const lastName = names.slice(1).join(' ') || "";

      // Save user info in Realtime Database
      const usersRef = ref(database, 'users/' + user.uid);
      await set(usersRef, {
        email: user.email,
        firstName: firstName,
        lastName: lastName,
        profilePicture: user.photoURL,
      });

      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      setError('Google sign-in failed. Please try again.');
    }
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
      <Box sx={{ marginTop: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Grid container>
          <Grid item xs>
          </Grid>
        </Grid>
      </Box>
      <Container maxWidth="xs">
        <Box sx={{ marginTop: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h4">
            LOGIN
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
            <Box display="flex" justifyContent="center">
              <Typography variant="body1">
                <Link href='\'> 
                Forgot password?
                </Link>
              </Typography>
            </Box>
            <Box display="flex" justifyContent="center">
              <Typography variant="body1">
                <Link href='\signup'> 
                  No account? Sign up here.
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Container>
  );
};

export default Login;
