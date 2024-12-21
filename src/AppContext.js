// src/AppContext.js

import React, { createContext, useState, useEffect } from 'react';
import { db } from './firebase';
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  addDoc,
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

  // Real-time listener
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'categories'),
      (snapshot) => {
        const data = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setCategories(data);
        console.log('Categories updated:', data);
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  const deleteTitle = async (id) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
      showSnackbar('Category deleted successfully!', 'success');
    } catch (error) {
      console.error(`Error deleting title with ID ${id}:`, error);
      showSnackbar('Error deleting category', 'error');
    }
  };

  const addSubtitle = async (categoryId, subtitleContext) => {
    try {
      const newSubtitle = {
        id: Date.now().toString(),
        context: subtitleContext,
        subSubtitles: [],
      };
      await updateDoc(doc(db, 'categories', categoryId), {
        subtitles: arrayUnion(newSubtitle),
      });
      showSnackbar('Subtitle added successfully!', 'success');
    } catch (error) {
      console.error(`Error adding subtitle to category ID ${categoryId}:`, error);
      showSnackbar('Error adding subtitle', 'error');
    }
  };

  const addTitle = async (title, context) => {
    try {
      const newCategory = {
        title,
        context,
        subtitles: [],
      };
      await addDoc(collection(db, 'categories'), newCategory);
      showSnackbar('Category added successfully!', 'success');
    } catch (error) {
      console.error('Error adding new title:', error);
      showSnackbar('Error adding category', 'error');
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