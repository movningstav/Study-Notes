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

  // Save categories to Firestore whenever they change
  useEffect(() => {
    const saveCategoriesToFirestore = async () => {
      try {
        categories.forEach(async (category) => {
          await setDoc(doc(db, "categories", category.id), category);
        });
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
