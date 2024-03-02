import * as React from 'react';
import { AppBar, Toolbar, Typography, Button, CssBaseline, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material'; 
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/system';
import video from '../../videos/healthcareFootage.mp4';
import logo from '../../images/PillPair.webp'; 
import { GlobalStyles } from '@mui/system';


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
  backgroundColor: 'rgba(255, 255, 255, 0.7)', // white background with some opacity
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

  React.useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 600
        ? setState((prevState) => ({ ...prevState, mobileView: true }))
        : setState((prevState) => ({ ...prevState, mobileView: false }));
    };

    setResponsiveness();
    window.addEventListener("resize", () => setResponsiveness());
  }, []);

  const displayDesktop = () => {
    return (
      <Toolbar>
        
        <Button color="inherit" style={{ color: "black" }}>Home</Button>
        <Button color="inherit" style={{ color: "black" }}>About</Button>
        <Button color="inherit" style={{ color: "black" }}>Contact</Button>
        <Button color="inherit" style={{ color: "black" }}>Sign In </Button>

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
        <AppBar position="sticky" style={{ backgroundColor: '#fff', boxShadow: 'none' }}> 
          <Toolbar style={{ padding: '20px' }}>
            <img src={logo} alt="PillPair" style={{ height: '40px', marginRight: '10px' }} />
            <Typography variant="h4" component="div" style={{ flexGrow: 1, color: '#000' }}> 
              PillPair
            </Typography>
            {mobileView ? displayMobile() : displayDesktop()}
          </Toolbar>
        </AppBar>
        <StyledDiv>
          <ContentDiv>
            <Typography variant="h2" component="h1" gutterBottom style={{ color: '#000' }}> 
              Where Healthcare Meets Harmony
            </Typography>
            <Button variant="contained" style={{ backgroundColor: '#add8e6', color: '#333', fontSize: '20px', padding: '10px 20px' }}> 
              Get Started
            </Button>
          </ContentDiv>
          <VideoBackground autoPlay muted loop>
            <source src={video} type="video/mp4" />
          </VideoBackground>
        </StyledDiv>
      </div>
    </React.Fragment>
  );
};


export default Home;
