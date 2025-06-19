import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';
import { ThemeProvider } from './components/ThemeProvider';
import { HelmetProvider } from 'react-helmet-async';


// Add console log for debugging
console.log("Main entry point loaded");

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <HelmetProvider>
    <AuthProvider>
        <App />
    </AuthProvider>
    </HelmetProvider>
    </ThemeProvider>
  </React.StrictMode>
);
