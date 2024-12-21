// src/AppContext.js
import React, { createContext, useState, useEffect } from 'react';
import { db } from './firebase';
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  setDoc,
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
      showSnackbar('Error adding category', 'error');
    }
  };

  const deleteTitle = async (id) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
      showSnackbar('Category deleted successfully!', 'success');
    } catch (error) {
      console.error(`Error deleting title with ID ${id}:`, error);
      showSnackbar('Error deleting category', 'error');
    }
  };

  const updateCategory = async (categoryId, updatedData) => {
    try {
      const categoryRef = doc(db, 'categories', categoryId);
      await updateDoc(categoryRef, updatedData);
      showSnackbar('Category updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating category:', error);
      showSnackbar('Error updating category', 'error');
    }
  };

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
      showSnackbar('Error adding subtitle', 'error');
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
        updateCategory,
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