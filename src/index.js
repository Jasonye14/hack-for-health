import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider} from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { darkTheme } from './components/sidemenu/SideMenu';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
