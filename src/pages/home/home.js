import * as React from 'react';
import { AppBar, Toolbar, Typography, Button, CssBaseline, IconButton, Drawer, List, ListItem, ListItemText, Grid, Card, CardContent } from '@mui/material'; 
import MenuIcon from '@mui/icons-material/Menu';
import { styled, Box } from '@mui/system';
import video from '../../videos/ocean2.mp4';
import logo from '../../images/PillPair.webp'; 
import { Link, animateScroll as scroll } from 'react-scroll';
import {useNavigate} from 'react-router-dom';
import pillPic from '../../images/pills.jpg';
import doctorPic from '../../images/doctor.jpg';
import heartPic from '../../images/run1.jpg';
import CircularProgress from '@mui/material/CircularProgress';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import './home.css';

import Carousel from 'react-material-ui-carousel'

// Define styles using MUI's styled helper
const StyledDiv = styled('div')({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#333',
  position: 'relative',
  zIndex: 1,
});

const ContentDiv = styled('div')({
  position: 'relative',
  zIndex: 2,
  // backgroundColor: 'yellow', // white background with some opacity
  padding: '20px',
  borderRadius: '10px', // rounded corners
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

const VideoBackground = styled('video')({
  position: 'absolute',
  right: 0,
  bottom: 0,
  width: '100%', // Ensure it covers the full width
  height: '100%', // Ensure it covers the full height
  objectFit: 'cover', // Cover the area without losing aspect ratio
  zIndex: 0, // Keep it behind all other content
});

const Home = () => {

  const [state, setState] = React.useState({
    mobileView: false,
    drawerOpen: false,
  });

  const { mobileView, drawerOpen } = state;

  const scrollToTop = () => {
    scroll.scrollToTop();
  };

  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const delay = (duration) => new Promise(resolve => setTimeout(resolve, duration));

  const handleGetStartedClick = async () => {
    setLoading(true);
    await delay(500); // Wait for .5 seconds
    setLoading(false);
    navigate('/signup');
  };
  
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
      backgroundColor: 'lightblue',
      color: 'white',
    },
  }));

  const displayDesktop = () => {
    return (
      <Toolbar>
        <HoverButton color="inherit" style={{ color: "black", fontSize: "1.1rem" }} onClick={scrollToTop}>Home</HoverButton>
        <Link to="about" smooth={true} duration={500}>
          <HoverButton color="inherit" style={{ color: "black", fontSize: "1.1rem" }}>About</HoverButton>
        </Link>
        <Link to="contact" smooth={true} duration={500}>
          <HoverButton color="inherit" style={{ color: "black", fontSize: "1.1rem" }}>Contact</HoverButton>
        </Link>
        <HoverButton color="inherit" style={{ color: "black", fontSize: "1.1rem" }} onClick={handleSignInClick}>Sign In</HoverButton>
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

  return (
    <React.Fragment>
      <div style={{backgroundColor: '#f5f5f5'}}>
        <CssBaseline />
        <div>
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.8)', zIndex: 9999 }}>
            <CircularProgress />
          </div>
        )}
          <AppBar position="sticky" style={{ backgroundColor: '#fff', boxShadow: 'none' }}>
            <Toolbar style={{ padding: '20px' }}>
              <img src={logo} alt="PillPair" style={{ height: '40px', marginRight: '10px' }} onClick={scrollToTop} />
              <Typography variant="h4" component="div" style={{ flexGrow: 1, color: '#000' }} onClick={scrollToTop}>
                PillPair
              </Typography>
              {mobileView ? displayMobile() : displayDesktop()}
            </Toolbar>
          </AppBar>
          <StyledDiv>
            <ContentDiv>
            <Typography variant="h2" component="h2" style={{ color: 'white', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(1.5px)' }}>
              WHERE HEALTHCARE MEETS HARMONY
            </Typography>
              <Button variant="contained" style={{ backgroundColor: '#add8e6', color: '#333', fontSize: '20px', padding: '10px 20px' }} onClick={handleGetStartedClick}>
                Get Started
              </Button>
            </ContentDiv>
            <VideoBackground autoPlay muted loop>
              <source src={video} type="video/mp4" />
            </VideoBackground>
          </StyledDiv>
          <div id="about" style={{ backgroundColor: '#f5f5f5', padding: '40px' }}>
            <Typography variant="h2" component="h2" gutterBottom style={{ color: '#000' }}>
              About
            </Typography>
            <Typography variant="body1" component="p" style={{ color: '#000' }}>
              Our platform not only provides information about potential drug interactions, but also offers personalized recommendations based on food and beverage consumption. By inputting your medications, PillPair can generate tailored suggestions to help you optimize your medication regimen and minimize potential risks. We believe that everyone deserves access to personalized healthcare, and our goal is to empower individuals to take control of their own well-being.
            </Typography>
            <br />
            <Typography variant="body1" component="p" style={{ color: '#000' }}>
              In addition to our drug interaction checker, PillPair also offers a medication reminder feature to help you stay on track with your prescribed regimen. With customizable reminders and notifications, you can ensure that you never miss a dose or accidentally take conflicting medications. Our user-friendly interface and intuitive design make it easy to manage your medications, so you can focus on what matters most – your health and well-being.
            </Typography>
          </div>
          <Carousel navButtonsAlwaysVisible>
            <img src={heartPic} alt="Pills" style={{ height: '700px', width: '100%', objectFit: 'cover'}} />
            <img src={doctorPic} alt="Doctor" style={{ height: '700px', width: '100%', objectFit: 'cover' }} />
            <img src={pillPic} alt="Sethoscope" style={{ height: '700px', width: '100%', objectFit: 'cover' }} />
          </Carousel>
          <div id="contact" style={{ backgroundColor: '#f5f5f5', padding: '40px' }}>
              <Typography variant="h2" component="h2" gutterBottom style={{ color: '#000' }}>
                Contact us
              </Typography>
              <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                  <Card sx={{ 
                    transition: '0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '5px 5px 15px rgba(0,0,0,0.3)',
                    },
                  }}>
                    <CardContent>
                      <Box display="flex" justifyContent="center" alignItems="center">
                        <HomeIcon fontSize="large" />
                        <Typography variant="body1" style={{ marginLeft: 8 }}>
                          123 Main St, Bethlehem, PA, 18015
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card sx={{ 
                    transition: '0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '5px 5px 15px rgba(0,0,0,0.3)',
                    },
                  }}>
                    <CardContent>
                      <Box display="flex" justifyContent="center" alignItems="center">
                        <PhoneIcon fontSize="large" />
                        <Typography variant="body1" style={{ marginLeft: 8 }}>
                          (570) 923-6782
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card sx={{ 
                    transition: '0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '5px 5px 15px rgba(0,0,0,0.3)',
                    },
                  }}>
                    <CardContent>
                      <Box display="flex" justifyContent="center" alignItems="center">
                        <EmailIcon fontSize="large" />
                        <Typography variant="body1" style={{ marginLeft: 8 }}>
                          PillPair@gmail.com
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </div>
        </div>
      </div>
    </React.Fragment>
  );
};


export default Home;
