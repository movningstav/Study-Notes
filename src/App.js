// src/App.js

import React, { useContext, useEffect } from 'react';
import { AppProvider, AppContext } from './AppContext';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import EditPanel from './EditPanel';
import { Snackbar, Alert } from '@mui/material';
import './App.css';

function AppContent() {
  const { toggleEditPanel, snackbar, closeSnackbar } = useContext(AppContext);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        toggleEditPanel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleEditPanel]);

  return (
    <div className="App">
      <header className="header">
        <h2 className="change-header">English Drama (1660-1950)</h2>
      </header>
      <div className="container">
        <Sidebar />
        <MainContent />
      </div>
      <EditPanel />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;