// src/AppContext.js
import React, { createContext, useState, useEffect } from 'react';
import { db } from './firebase';
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  addDoc,
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

  // Real-time listener for categories
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'categories'),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(data);
        console.log('Data received from Firestore:', data); // Debug log
      },
      (error) => {
        console.error('Error fetching categories:', error);
        showSnackbar('Error fetching data from Firestore', 'error');
      }
    );

    return () => unsubscribe();
  }, []);

  // Enhanced addTitle function with error logging
  const addTitle = async (title, context = '') => {
    try {
      const newCategory = {
        title,
        context,
        subtitles: [],
        createdAt: new Date().toISOString(),
      };
      
      const docRef = await addDoc(collection(db, 'categories'), newCategory);
      console.log('Document written with ID: ', docRef.id); // Debug log
      showSnackbar('Category added successfully!', 'success');
    } catch (error) {
      console.error('Error adding new title:', error);
      showSnackbar(`Error adding category: ${error.message}`, 'error');
    }
  };

  // Enhanced deleteTitle function with error logging
  const deleteTitle = async (id) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
      showSnackbar('Category deleted successfully!', 'success');
    } catch (error) {
      console.error(`Error deleting title with ID ${id}:`, error);
      showSnackbar(`Error deleting category: ${error.message}`, 'error');
    }
  };

  // Enhanced updateCategoryContext function with error logging
  const updateCategoryContext = async (categoryId, newContext) => {
    try {
      const categoryRef = doc(db, 'categories', categoryId);
      await updateDoc(categoryRef, { context: newContext });
      showSnackbar('Category context updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating category context:', error);
      showSnackbar(`Error updating category: ${error.message}`, 'error');
    }
  };

  // Enhanced addSubtitle function with error logging
  const addSubtitle = async (categoryId, subtitleData) => {
    try {
      const categoryRef = doc(db, 'categories', categoryId);
      const newSubtitle = {
        id: Date.now().toString(),
        ...subtitleData,
        subSubtitles: [],
        createdAt: new Date().toISOString(),
      };

      await updateDoc(categoryRef, {
        subtitles: arrayUnion(newSubtitle)
      });
      
      showSnackbar('Subtitle added successfully!', 'success');
    } catch (error) {
      console.error('Error adding subtitle:', error);
      showSnackbar(`Error adding subtitle: ${error.message}`, 'error');
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
        deleteTitle,
        addSubtitle,
        addTitle,
        updateCategoryContext,
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