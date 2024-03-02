import * as React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/system';


// Define styles using MUI's styled helper
const StyledDiv = styled('div')({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#333',
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
        
        <Button color="inherit">Home</Button>
        <Button color="inherit">About</Button>
        <Button color="inherit">Contact</Button>
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
    <div>
      <AppBar position="sticky" style={{ backgroundColor: '#333', boxShadow: 'none' }}> 
        <Toolbar style={{ padding: '20px' }}>
          <Typography variant="h4" component="div" style={{ flexGrow: 1, color: '#add8e6' }}> 
            Logo
          </Typography>
          {mobileView ? displayMobile() : displayDesktop()}
        </Toolbar>
      </AppBar>
      <StyledDiv>
        <Typography variant="h2" component="h1" gutterBottom style={{ color: '#add8e6' }}> 
          Welcome to Our Site
        </Typography>
        <Button variant="contained" style={{ backgroundColor: '#add8e6', color: '#333', fontSize: '20px', padding: '10px 20px' }}> 
          Get Started
        </Button>
      </StyledDiv>
    </div>
  );
};


export default Home;
