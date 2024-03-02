import * as React from 'react';
import { AppBar, Toolbar, Typography, Button, CssBaseline, IconButton, Drawer, List, ListItem, ListItemText, Grid, Card, CardContent } from '@mui/material'; 
import MenuIcon from '@mui/icons-material/Menu';
import { styled, Box } from '@mui/system';
import video from '../../videos/ocean2.mp4';
import logo from '../../images/PillPair.webp'; 
import { Link, animateScroll as scroll } from 'react-scroll';
import {useNavigate} from 'react-router-dom';
import image from '../../images/meds.jpg';
import CircularProgress from '@mui/material/CircularProgress';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';



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
  minWidth: '100%',
  minHeight: '100%',
  zIndex: 0,
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
        <HoverButton color="inherit" style={{ color: "black" }} onClick={scrollToTop}>Home</HoverButton>
        <Link to="about" smooth={true} duration={500}>
          <HoverButton color="inherit" style={{ color: "black" }}>About</HoverButton>
        </Link>
        <Link to="contact" smooth={true} duration={500}>
          <HoverButton color="inherit" style={{ color: "black" }}>Contact</HoverButton>
        </Link>
        <HoverButton color="inherit" style={{ color: "black" }} onClick={handleSignInClick}>Sign In</HoverButton>
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
          <Typography variant="h2" component="h2" style={{ color: '#fff', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
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
            At PillPair, we're dedicated to empowering individuals with the knowledge they need to make informed decisions about their medications. Our innovative platform provides a comprehensive drug interaction checker designed to highlight potential risks and interactions between medications, supplements, and even food. By leveraging cutting-edge technology and up-to-date medical information, we aim to reduce the complexity of medication management, making it easier for everyone to understand how different substances interact within their bodies. Whether you're managing multiple prescriptions or simply looking to optimize your health regimen, PillPair is your trusted partner in navigating the intricate world of medication safety and efficacy. Join us in our mission to promote better health outcomes through informed medication management.          </Typography>
        </div>
        <div id="image" style={{ position: 'relative', zIndex: -1 }}>
          <img src={image} alt="Background Image" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div id="contact" style={{ backgroundColor: '#f5f5f5', padding: '40px' }}>
            <Typography variant="h2" component="h2" gutterBottom style={{ color: '#000' }}>
              Contact
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
                        Address: 123 Main St, Anytown, USA
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
    </React.Fragment>
  );
};


export default Home;
