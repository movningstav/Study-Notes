// src/EditPanel.js

import React, { useContext, useState } from 'react';
import { AppContext } from './AppContext';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Tabs,
  Tab,
  Box,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import Draggable from 'react-draggable';
import { TabPanel, TabContext } from '@mui/lab';
import 'react-quill-new/dist/quill.snow.css';

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <div {...props} />
    </Draggable>
  );
}

const EditPanel = () => {
  const {
    categories,
    setCategories,
    isEditPanelOpen,
    toggleEditPanel,
    showSnackbar,
    deleteTitle,
  } = useContext(AppContext);
  const [tabValue, setTabValue] = useState('1');

  // States for Categories
  const [categoryTitle, setCategoryTitle] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);

  // States for Subtitles
  const [subtitleTitle, setSubtitleTitle] = useState('');
  const [selectedCategoryForSubtitle, setSelectedCategoryForSubtitle] = useState('');
  const [editingSubtitle, setEditingSubtitle] = useState(null);

  // States for Sub-Subtitles
  const [subSubtitleTitle, setSubSubtitleTitle] = useState('');
  const [selectedCategoryForSubSubtitle, setSelectedCategoryForSubSubtitle] = useState('');
  const [selectedSubtitleForSubSubtitle, setSelectedSubtitleForSubSubtitle] = useState('');
  const [editingSubSubtitle, setEditingSubSubtitle] = useState(null);

  // Handle Tab Change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle Close Dialog
  const handleClose = () => {
    toggleEditPanel();
    resetAllForms();
  };

  const resetAllForms = () => {
    // Reset Categories
    setCategoryTitle('');
    setEditingCategory(null);

    // Reset Subtitles
    setSubtitleTitle('');
    setSelectedCategoryForSubtitle('');
    setEditingSubtitle(null);

    // Reset Sub-Subtitles
    setSubSubtitleTitle('');
    setSelectedCategoryForSubSubtitle('');
    setSelectedSubtitleForSubSubtitle('');
    setEditingSubSubtitle(null);
  };

  // =======================
  // Categories Functionality
  // =======================

// Add or Update Category
const handleCategorySubmit = (e) => {
  e.preventDefault();
  if (categoryTitle.trim() === '') {
    showSnackbar('Category title is required.', 'error');
    return;
  }

  if (editingCategory) {
    // Update existing category
    const updatedCategories = categories.map((cat) =>
      cat.id === editingCategory.id
        ? { ...cat, title: categoryTitle }
        : cat
    );
    setCategories(updatedCategories);
    showSnackbar('Category updated successfully!', 'success');
  } else {
    // Add new category
    const newCategory = {
      id: Date.now(),
      title: categoryTitle,
      context: '',
      subtitles: [],
    };
    setCategories([...categories, newCategory]);
    showSnackbar('Category added successfully!', 'success');
  }

  // Reset form
  setCategoryTitle('');
  setEditingCategory(null);
};

// Edit Category
const handleEditCategory = (category) => {
  setEditingCategory(category);
  setCategoryTitle(category.title);
  setTabValue('1');
};

// Delete Category
const handleDeleteCategory = (categoryId) => {
  deleteTitle(categoryId);
  showSnackbar('Category deleted successfully!', 'success');

  // If currently editing this category, reset form
  if (editingCategory && editingCategory.id === categoryId) {
    setCategoryTitle('');
    setEditingCategory(null);
  }
};

// =======================
// Subtitles Functionality
// =======================

// Add or Update Subtitle
const handleSubtitleSubmit = (e) => {
  e.preventDefault();
  if (
    subtitleTitle.trim() === '' ||
    selectedCategoryForSubtitle === ''
  ) {
    showSnackbar('All fields are required for Subtitle.', 'error');
    return;
  }

  if (editingSubtitle) {
    // Update existing subtitle
    const updatedCategories = categories.map((cat) => {
      if (cat.id === selectedCategoryForSubtitle) {
        const updatedSubtitles = cat.subtitles.map((sub) =>
          sub.id === editingSubtitle.id
            ? { ...sub, title: subtitleTitle }
            : sub
        );
        return { ...cat, subtitles: updatedSubtitles };
      }
      return cat;
    });
    setCategories(updatedCategories);
    showSnackbar('Subtitle updated successfully!', 'success');
  } else {
    // Add new subtitle
    const newSubtitle = {
      id: Date.now(),
      title: subtitleTitle,
      context: '',
      subSubtitles: [],
    };
    const updatedCategories = categories.map((cat) => {
      if (cat.id === selectedCategoryForSubtitle) {
        return { ...cat, subtitles: [...cat.subtitles, newSubtitle] };
      }
      return cat;
    });
    setCategories(updatedCategories);
    showSnackbar('Subtitle added successfully!', 'success');
  }

  // Reset form
  setSubtitleTitle('');
  setSelectedCategoryForSubtitle('');
  setEditingSubtitle(null);
};

// Edit Subtitle
const handleEditSubtitle = (categoryId, subtitle) => {
  setEditingSubtitle(subtitle);
  setSubtitleTitle(subtitle.title);
  setSelectedCategoryForSubtitle(categoryId);
  setTabValue('2');
};

// Delete Subtitle
const handleDeleteSubtitle = (categoryId, subtitleId) => {
  const updatedCategories = categories.map((cat) => {
    if (cat.id === categoryId) {
      const updatedSubtitles = cat.subtitles.filter((sub) => sub.id !== subtitleId);
      return { ...cat, subtitles: updatedSubtitles };
    }
    return cat;
  });
  setCategories(updatedCategories);
  showSnackbar('Subtitle deleted successfully!', 'success');

  // If currently editing this subtitle, reset form
  if (editingSubtitle && editingSubtitle.id === subtitleId) {
    setSubtitleTitle('');
    setSelectedCategoryForSubtitle('');
    setEditingSubtitle(null);
  }
};

// ================================
// Sub-Subtitles Functionality
// ================================

// Add or Update Sub-Subtitle
const handleSubSubtitleSubmit = (e) => {
  e.preventDefault();
  if (
    subSubtitleTitle.trim() === '' ||
    selectedCategoryForSubSubtitle === '' ||
    selectedSubtitleForSubSubtitle === ''
  ) {
    showSnackbar('All fields are required for Sub-Subtitle.', 'error');
    return;
  }

  if (editingSubSubtitle) {
    // Update existing sub-subtitle
    const updatedCategories = categories.map((cat) => {
      if (cat.id === selectedCategoryForSubSubtitle) {
        const updatedSubtitles = cat.subtitles.map((sub) => {
          if (sub.id === selectedSubtitleForSubSubtitle) {
            const updatedSubSubtitles = sub.subSubtitles.map((subSub) =>
              subSub.id === editingSubSubtitle.id
                ? { ...subSub, title: subSubtitleTitle }
                : subSub
            );
            return { ...sub, subSubtitles: updatedSubSubtitles };
          }
          return sub;
        });
        return { ...cat, subtitles: updatedSubtitles };
      }
      return cat;
    });
    setCategories(updatedCategories);
    showSnackbar('Sub-Subtitle updated successfully!', 'success');
  } else {
    // Add new sub-subtitle
    const newSubSubtitle = {
      id: Date.now(),
      title: subSubtitleTitle,
      context: '',
    };
    const updatedCategories = categories.map((cat) => {
      if (cat.id === selectedCategoryForSubSubtitle) {
        const updatedSubtitles = cat.subtitles.map((sub) => {
          if (sub.id === selectedSubtitleForSubSubtitle) {
            return { ...sub, subSubtitles: [...sub.subSubtitles, newSubSubtitle] };
          }
          return sub;
        });
        return { ...cat, subtitles: updatedSubtitles };
      }
      return cat;
    });
    setCategories(updatedCategories);
    showSnackbar('Sub-Subtitle added successfully!', 'success');
  }

  // Reset form
  setSubSubtitleTitle('');
  setSelectedCategoryForSubSubtitle('');
  setSelectedSubtitleForSubSubtitle('');
  setEditingSubSubtitle(null);
};

// Edit Sub-Subtitle
const handleEditSubSubtitle = (categoryId, subtitleId, subSubtitle) => {
  setEditingSubSubtitle(subSubtitle);
  setSubSubtitleTitle(subSubtitle.title);
  setSelectedCategoryForSubSubtitle(categoryId);
  setSelectedSubtitleForSubSubtitle(subtitleId);
  setTabValue('3');
};

// Delete Sub-Subtitle
const handleDeleteSubSubtitle = (categoryId, subtitleId, subSubtitleId) => {
  const updatedCategories = categories.map((cat) => {
    if (cat.id === categoryId) {
      const updatedSubtitles = cat.subtitles.map((sub) => {
        if (sub.id === subtitleId) {
          const updatedSubSubtitles = sub.subSubtitles.filter(
            (subSub) => subSub.id !== subSubtitleId
          );
          return { ...sub, subSubtitles: updatedSubSubtitles };
        }
        return sub;
      });
      return { ...cat, subtitles: updatedSubtitles };
    }
    return cat;
  });
  setCategories(updatedCategories);
  showSnackbar('Sub-Subtitle deleted successfully!', 'success');

  // If currently editing this sub-subtitle, reset form
  if (editingSubSubtitle && editingSubSubtitle.id === subSubtitleId) {
    setSubSubtitleTitle('');
    setSelectedCategoryForSubSubtitle('');
    setSelectedSubtitleForSubSubtitle('');
    setEditingSubSubtitle(null);
  }
};

return (
  <Dialog
    open={isEditPanelOpen}
    onClose={handleClose}
    PaperComponent={PaperComponent}
    aria-labelledby="draggable-dialog-title"
    maxWidth="md"
    fullWidth
    BackdropProps={{
      style: { backgroundColor: 'rgba(0, 0, 0, 0.1)' }, // Lighter backdrop
    }}
    PaperProps={{
      sx: {
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
      },
    }}
  >
    <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
      Edit Panel
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{ position: 'absolute', right: 8, top: 8 }}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
    <DialogContent dividers>
      <TabContext value={tabValue}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="edit panel tabs"
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Categories" value="1" />
          <Tab label="Subtitles" value="2" />
          <Tab label="Sub-Subtitles" value="3" />
        </Tabs>
        {/* Tab Panels */}
        {/* Categories Tab */}
        <TabPanel value="1">
          {/* List of Categories */}
          <List>
            {categories.map((cat) => (
              <ListItem
                key={cat.id}
                button
                onClick={() => handleEditCategory(cat)}
              >
                <ListItemText primary={cat.title} />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteCategory(cat.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>

          {/* Category Form */}
          <Box
            component="form"
            onSubmit={handleCategorySubmit}
            sx={{ mt: 2 }}
          >
            <TextField
              label="Category Title"
              value={categoryTitle}
              onChange={(e) => setCategoryTitle(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              {editingCategory ? 'Update Category' : 'Add Category'}
            </Button>
            {editingCategory && (
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={() => {
                  setEditingCategory(null);
                  setCategoryTitle('');
                }}
                sx={{ mt: 1 }}
              >
                Cancel Editing
              </Button>
            )}
          </Box>
        </TabPanel>

        {/* Subtitles Tab */}
        <TabPanel value="2">
          {/* List of Subtitles */}
          <List>
            {categories.map((cat) =>
              cat.subtitles.map((sub) => (
                <ListItem
                  key={sub.id}
                  button
                  onClick={() => handleEditSubtitle(cat.id, sub)}
                >
                  <ListItemText
                    primary={`${sub.title} (Category: ${cat.title})`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteSubtitle(cat.id, sub.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))
            )}
          </List>

          {/* Subtitle Form */}
          <Box
            component="form"
            onSubmit={handleSubtitleSubmit}
            sx={{ mt: 2 }}
          >
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Select Category</InputLabel>
              <Select
                value={selectedCategoryForSubtitle}
                onChange={(e) => setSelectedCategoryForSubtitle(e.target.value)}
                label="Select Category"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Subtitle Title"
              value={subtitleTitle}
              onChange={(e) => setSubtitleTitle(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              {editingSubtitle ? 'Update Subtitle' : 'Add Subtitle'}
            </Button>
            {editingSubtitle && (
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={() => {
                  setEditingSubtitle(null);
                  setSubtitleTitle('');
                  setSelectedCategoryForSubtitle('');
                }}
                sx={{ mt: 1 }}
              >
                Cancel Editing
              </Button>
            )}
          </Box>
        </TabPanel>

        {/* Sub-Subtitles Tab */}
        <TabPanel value="3">
          {/* List of Sub-Subtitles */}
          <List>
            {categories.map((cat) =>
              cat.subtitles.map((sub) =>
                sub.subSubtitles.map((subSub) => (
                  <ListItem
                    key={subSub.id}
                    button
                    onClick={() => handleEditSubSubtitle(cat.id, sub.id, subSub)}
                  >
                    <ListItemText
                      primary={`${subSub.title} (Subtitle: ${sub.title}, Category: ${cat.title})`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() =>
                          handleDeleteSubSubtitle(cat.id, sub.id, subSub.id)
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))
              )
            )}
          </List>

          {/* Sub-Subtitle Form */}
          <Box
            component="form"
            onSubmit={handleSubSubtitleSubmit}
            sx={{ mt: 2 }}
          >
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Select Category</InputLabel>
              <Select
                value={selectedCategoryForSubSubtitle}
                onChange={(e) => {
                  setSelectedCategoryForSubSubtitle(e.target.value);
                  setSelectedSubtitleForSubSubtitle('');
                }}
                label="Select Category"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {selectedCategoryForSubSubtitle && (
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Select Subtitle</InputLabel>
                <Select
                  value={selectedSubtitleForSubSubtitle}
                  onChange={(e) => setSelectedSubtitleForSubSubtitle(e.target.value)}
                  label="Select Subtitle"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {categories
                    .find((cat) => cat.id === selectedCategoryForSubSubtitle)
                    .subtitles.map((sub) => (
                      <MenuItem key={sub.id} value={sub.id}>
                        {sub.title}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}
            <TextField
              label="Sub-Subtitle Title"
              value={subSubtitleTitle}
              onChange={(e) => setSubSubtitleTitle(e.target.value)}
              fullWidth
              margin="normal"
              required
              disabled={
                selectedCategoryForSubSubtitle === '' ||
                selectedSubtitleForSubSubtitle === ''
              }
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={
                selectedCategoryForSubSubtitle === '' ||
                selectedSubtitleForSubSubtitle === ''
              }
            >
              {editingSubSubtitle ? 'Update Sub-Subtitle' : 'Add Sub-Subtitle'}
            </Button>
            {editingSubSubtitle && (
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={() => {
                  setEditingSubSubtitle(null);
                  setSubSubtitleTitle('');
                  setSelectedCategoryForSubSubtitle('');
                  setSelectedSubtitleForSubSubtitle('');
                }}
                sx={{ mt: 1 }}
              >
                Cancel Editing
		<Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={
                  selectedCategoryForSubSubtitle === '' ||
                  selectedSubtitleForSubSubtitle === ''
                }
              >
                {editingSubSubtitle ? 'Update Sub-Subtitle' : 'Add Sub-Subtitle'}
              </Button>
              {editingSubSubtitle && (
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  onClick={() => {
                    setEditingSubSubtitle(null);
                    setSubSubtitleTitle('');
                    setSelectedCategoryForSubSubtitle('');
                    setSelectedSubtitleForSubSubtitle('');
                  }}
                  sx={{ mt: 1 }}
                >
                  Cancel Editing
                </Button>
              )}
            </Box>
          </TabPanel>
        </TabContext>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPanel;