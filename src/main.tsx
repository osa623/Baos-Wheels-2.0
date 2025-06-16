import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';
import { ThemeProvider } from './components/ThemeProvider';

// Add console log for debugging
console.log("Main entry point loaded");

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
    <AuthProvider>
        <App />
    </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
