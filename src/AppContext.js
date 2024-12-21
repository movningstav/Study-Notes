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

  // 1. Real-time listener: Keeps 'categories' in sync with Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'categories'),
      (snapshot) => {
        const data = snapshot.docs.map((docSnap) => ({
          id: docSnap.id, // Firestore's auto-generated document ID
          ...docSnap.data(),
        }));
        setCategories(data);
        console.log('Categories updated:', data);
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  // 2. Delete Title (removes from Firestore; listener updates local state)
  const deleteTitle = async (id) => {
    try {
      console.log(`Attempting to delete title with ID: ${id}`);
      await deleteDoc(doc(db, 'categories', id));
      console.log(`Deleted title with ID: ${id}`);
      // No need to manually update local state; listener handles it
    } catch (error) {
      console.error(`Error deleting title with ID ${id}:`, error);
    }
  };

  // 3. Add Subtitle (adds a subtitle object to Firestore; listener updates local state)
  const addSubtitle = async (categoryId, subtitleContext) => {
    try {
      console.log(`Attempting to add subtitle "${subtitleContext}" to category ID: ${categoryId}`);
      const newSubtitle = {
        id: Date.now().toString(), // Generates a unique ID based on the current timestamp
        context: subtitleContext,
        subSubtitles: [], // Initialize with an empty array if needed
      };
      await updateDoc(doc(db, 'categories', categoryId), {
        subtitles: arrayUnion(newSubtitle),
      });
      console.log(`Added subtitle "${subtitleContext}" to category ID: ${categoryId}`);
      // Listener will update the local state
    } catch (error) {
      console.error(`Error adding subtitle "${subtitleContext}" to category ID ${categoryId}:`, error);
    }
  };

  // Optional: Function to add a new title/category
  const addTitle = async (title, context) => {
    try {
      console.log(`Attempting to add new title "${title}" with context "${context}"`);
      const newCategory = {
        title,
        context,
        subtitles: [],
      };
      const docRef = await addDoc(collection(db, 'categories'), newCategory);
      console.log(`Added new title "${title}" with ID: ${docRef.id}`);
      // Listener will update the local state
    } catch (error) {
      console.error('Error adding new title:', error);
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
        setCategories, // Optional: If you need to manually set categories
        deleteTitle,
        addSubtitle,
        addTitle, // Optional: If you incorporated addTitle
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
