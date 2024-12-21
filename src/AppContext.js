import React, { createContext, useState, useEffect } from 'react';
import { db } from './firebase';
import {
  collection,
  getDocs,
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

// ...existing code...

// 1. Fetch categories from Firestore on mount (no auto-save to Firestore here)
useEffect(() => {
  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'categories'));
      const fetchedCategories = [];
      querySnapshot.forEach((docSnap) => {
        fetchedCategories.push({ id: docSnap.id, ...docSnap.data() });
      });
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  fetchCategories();
}, []);

// 2. Delete a title (remove from Firestore + local state)
const deleteTitle = async (id) => {
  try {
    await deleteDoc(doc(db, 'categories', id));
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  } catch (error) {
    console.error('Error deleting title:', error);
  }
};

// 3. Add a subtitle (update Firestore + local state)
const addSubtitle = async (categoryId, newSubtitle) => {
  try {
    const categoryRef = doc(db, 'categories', categoryId);
    await updateDoc(categoryRef, {
      subtitles: arrayUnion(newSubtitle),
    });
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              subtitles: [...(cat.subtitles || []), newSubtitle],
            }
          : cat
      )
    );
  } catch (error) {
    console.error('Error adding subtitle:', error);
  }
};

// ...existing code...

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
