// src/AppContext.js

import React, { createContext, useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';

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

  // Fetch categories from Firestore on mount
  useEffect(() => {
    const fetchCategories = async () => {
      const querySnapshot = await getDocs(collection(db, "categories"));
      const categoriesList = [];
      querySnapshot.forEach((doc) => {
        categoriesList.push(doc.data());
      });
      setCategories(categoriesList);
    };
    fetchCategories();
  }, []);

  // Save categories to Firestore whenever they change
  useEffect(() => {
    const saveCategoriesToFirestore = async () => {
      categories.forEach(async (category) => {
        await setDoc(doc(db, "categories", category.id.toString()), category);
      });
    };
    saveCategoriesToFirestore();
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
