// src/AppContext.js

import React, { createContext, useState, useEffect } from 'react';
import { getCategories, saveCategories } from './db'; // Ensure correct import path

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Load data from IndexedDB on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedCategories = await getCategories();
        if (storedCategories.length > 0) {
          setCategories(storedCategories);
          console.log('Data loaded from IndexedDB:', storedCategories);
        } else {
          console.log('No data found in IndexedDB.');
        }
      } catch (error) {
        console.error('Failed to load data from IndexedDB:', error);
      }
    };
    fetchData();
  }, []);

  // Save data to IndexedDB whenever categories change
  useEffect(() => {
    const saveData = async () => {
      try {
        await saveCategories(categories);
      } catch (error) {
        console.error('Failed to save data to IndexedDB:', error);
      }
    };
    saveData();
  }, [categories]);

  const toggleEditPanel = () => {
    setIsEditPanelOpen((prev) => !prev);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <AppContext.Provider
      value={{
        categories,
        setCategories,
        selectedContent,
        setSelectedContent,
        isEditPanelOpen,
        toggleEditPanel,
        snackbar,
        showSnackbar,
        closeSnackbar,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};