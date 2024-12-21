// src/AppContext.js

import React, { createContext, useState, useEffect } from 'react';
import { db } from './firebase';
import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  deleteDoc, 
  updateDoc, 
  arrayUnion, 
  onSnapshot 
} from 'firebase/firestore';

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

  // Real-time listener for categories
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "categories"), (snapshot) => {
      const categoriesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(categoriesList);
      console.log("Categories updated:", categoriesList);
    }, (error) => {
      console.error("Error fetching categories:", error);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  // Function to delete a title
  const deleteTitle = async (id) => {
    try {
      await deleteDoc(doc(db, "categories", id));
      // No need to manually update local state; listener will handle it
      console.log(`Title with ID ${id} deleted.`);
    } catch (error) {
      console.error("Error deleting title:", error);
    }
  };

  // Function to add a subtitle
  const addSubtitle = async (categoryId, subtitle) => {
    try {
      const categoryRef = doc(db, "categories", categoryId);
      await updateDoc(categoryRef, {
        subtitles: arrayUnion(subtitle)
      });
      console.log(`Subtitle "${subtitle}" added to category ${categoryId}.`);
      // No need to manually update local state; listener will handle it
    } catch (error) {
      console.error("Error adding subtitle:", error);
    }
  };

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
        deleteTitle,      // Exposed deleteTitle function
        addSubtitle,     // Exposed addSubtitle function
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
