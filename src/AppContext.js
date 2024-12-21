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
  arrayUnion 
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

  // Fetch categories from Firestore on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const categoriesList = [];
        querySnapshot.forEach((doc) => {
          categoriesList.push({ id: doc.id, ...doc.data() });
        });
        setCategories(categoriesList);
        console.log("Categories fetched:", categoriesList);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Function to delete a title
  const deleteTitle = async (id) => {
    try {
      await deleteDoc(doc(db, "categories", id));
      setCategories(prevCategories => prevCategories.filter(category => category.id !== id));
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

      setCategories(prevCategories => prevCategories.map(cat => 
        cat.id === categoryId 
          ? { ...cat, subtitles: [...(cat.subtitles || []), subtitle] } 
          : cat
      ));
      console.log(`Subtitle "${subtitle}" added to category ${categoryId}.`);
    } catch (error) {
      console.error("Error adding subtitle:", error);
    }
  };

  // Save categories to Firestore whenever they change
  useEffect(() => {
    const saveCategoriesToFirestore = async () => {
      try {
        for (const category of categories) {
          await setDoc(doc(db, "categories", category.id), category);
        }
        console.log("Categories saved to Firestore.");
      } catch (error) {
        console.error("Error saving categories:", error);
      }
    };
    if (categories.length > 0) { // Avoid initial empty save
      saveCategoriesToFirestore();
    }
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
