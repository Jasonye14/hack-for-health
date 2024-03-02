import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider} from '@emotion/react';
import { CssBaseline, createTheme } from '@mui/material';

// Create theme here
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
