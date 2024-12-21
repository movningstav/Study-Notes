import React, { useContext, useState } from 'react';
import { AppContext } from './AppContext';
import DOMPurify from 'dompurify';
import { Box, Typography, IconButton, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ReactQuill from 'react-quill-new';
import 'react-quill/dist/quill.snow.css';

const MainContent = () => {
  const { selectedContent, setCategories, categories, showSnackbar } = useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContext, setEditedContext] = useState('');

  const handleEditClick = () => {
    if (selectedContent) {
      setEditedContext(selectedContent.context);
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (!selectedContent) return;

    const updatedCategories = categories.map((cat) => {
      // Check if selected content is Category
      if (selectedContent.type === 'category' && cat.id === selectedContent.id) {
        return { ...cat, context: editedContext };
      }

      // Check if selected content is Subtitle
      if (selectedContent.type === 'subtitle') {
        const updatedSubtitles = cat.subtitles.map((sub) =>
          sub.id === selectedContent.id ? { ...sub, subcontext: editedContext } : sub
        );
        return { ...cat, subtitles: updatedSubtitles };
      }

      // Check if selected content is Sub-Subtitle
      if (selectedContent.type === 'subsubtitle') {
        const updatedSubtitles = cat.subtitles.map((sub) => {
          const updatedSubSubtitles = sub.subSubtitles.map((subSub) =>
            subSub.id === selectedContent.id ? { ...subSub, context: editedContext } : subSub
          );
          return { ...sub, subSubtitles: updatedSubSubtitles };
        });
        return { ...cat, subtitles: updatedSubtitles };
      }

      return cat;
    });

    setCategories(updatedCategories);
    setIsEditing(false);
    showSnackbar('Context updated successfully!', 'success');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedContext('');
  };

  return (
    <div className="main-content">
      {selectedContent ? (
        <>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" className="content-title">
              {selectedContent.title}
            </Typography>
            {!isEditing && (
              <IconButton onClick={handleEditClick} aria-label="edit context">
                <EditIcon />
              </IconButton>
            )}
          </Box>
          <Box className="context-container">
            {isEditing ? (
              <>
                <ReactQuill
                  theme="snow"
                  value={editedContext}
                  onChange={setEditedContext}
                  style={{ height: '300px', marginBottom: '20px' }}
                />
                <Box display="flex" justifyContent="flex-end" gap={2}>
                  <Button variant="contained" color="primary" onClick={handleSave}>
                    Save
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                </Box>
              </>
            ) : (
              <div
                className="context-text"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(selectedContent.context),
                }}
              ></div>
            )}
          </Box>
        </>
      ) : (
        <>
          <Box></Box>
          {/* Empty Box after removing the placeholder message */}
        </>
      )}
    </div>
  );
};

export default MainContent;