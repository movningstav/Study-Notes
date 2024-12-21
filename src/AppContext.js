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

  // 1. Real-time listener: keeps 'categories' in sync with Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'categories'),
      (snapshot) => {
        const data = snapshot.docs.map((docSnap) => ({
          id: docSnap.id, // Firestore's document ID
          ...docSnap.data(),
        }));
        setCategories(data);
        console.log('Categories updated:', data);
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // 2. Delete Title (removes from Firestore; listener updates local state)
  const deleteTitle = async (id) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
      console.log(`Deleted title with ID: ${id}`);
      // No need to manually update local state; listener handles it
    } catch (error) {
      console.error('Error deleting title:', error);
    }
  };

  // 3. Add a Subtitle (adds a subtitle object to Firestore; listener updates local state)
  const addSubtitle = async (categoryId, subtitleContext) => {
    try {
      const newSubtitle = {
        id: Date.now().toString(), // Generate a unique ID for the subtitle
        context: subtitleContext,
        subSubtitles: [], // Initialize with an empty array if needed
      };
      await updateDoc(doc(db, 'categories', categoryId), {
        subtitles: arrayUnion(newSubtitle),
      });
      console.log(`Added subtitle "${subtitleContext}" to category ID: ${categoryId}`);
      // Listener will update the local state
    } catch (error) {
      console.error('Error adding subtitle:', error);
    }
  };

  // 4. Add a New Title (Optional: If you need to add new titles dynamically)
  const addTitle = async (title, context) => {
    try {
      const newCategory = {
        title,
        context,
        subtitles: [],
      };
      const docRef = await addDoc(collection(db, 'categories'), newCategory);
      console.log(`Added new title "${title}" with ID: ${docRef.id}`);
      // Listener will update the local state
    } catch (error) {
      console.error('Error adding title:', error);
    }
  };

  const toggleEditPanel = () => {
    setIsEditPanelOpen((prev) => !prev);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
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
