import React, { createContext, useState, useEffect } from 'react';
import { db } from './firebase';
import {
  collection,
  onSnapshot,
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

  // 1. Real-time listener: keeps 'categories' in sync with Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'categories'), (snapshot) => {
      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setCategories(data);
      console.log('Categories updated:', data);
    }, (error) => {
      console.error('Error fetching categories:', error);
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, []);

  // 2. Delete Title (removes from Firestore; listener updates local state)
  const deleteTitle = async (id) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
      console.log(`Deleted title with ID: ${id}`);
    } catch (error) {
      console.error('Error deleting title:', error);
    }
  };

  // 3. Add a subtitle (updates Firestore; listener updates local state)
  const addSubtitle = async (categoryId, newSubtitle) => {
    try {
      await updateDoc(doc(db, 'categories', categoryId), {
        subtitles: arrayUnion(newSubtitle),
      });
      console.log(`Added subtitle "${newSubtitle}" to ${categoryId}`);
    } catch (error) {
      console.error('Error adding subtitle:', error);
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
        setCategories,
        deleteTitle,
        addSubtitle,
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
