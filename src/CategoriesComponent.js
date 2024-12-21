// src/CategoriesComponent.js

import React, { useContext, useState } from 'react';
import { AppContext } from './AppContext';

const CategoriesComponent = () => {
  const { categories, deleteTitle, addSubtitle } = useContext(AppContext);
  const [newSubtitles, setNewSubtitles] = useState({});

  const handleAddSubtitle = (categoryId) => {
    const subtitle = newSubtitles[categoryId];
    if (subtitle && subtitle.trim() !== "") {
      addSubtitle(categoryId, subtitle.trim());
      setNewSubtitles(prev => ({ ...prev, [categoryId]: '' }));
    }
  };

  const handleSubtitleChange = (categoryId, value) => {
    setNewSubtitles(prev => ({ ...prev, [categoryId]: value }));
  };

  return (
    <div>
      <h2>Categories</h2>
      <ul>
        {categories.map(cat => (
          <li key={cat.id}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span>{cat.name}</span>
              <button onClick={() => deleteTitle(cat.id)} style={{ marginLeft: '10px' }}>Delete</button>
            </div>
            <div style={{ marginLeft: '20px', marginTop: '5px' }}>
              <input
                type="text"
                value={newSubtitles[cat.id] || ''}
                onChange={(e) => handleSubtitleChange(cat.id, e.target.value)}
                placeholder="Add Subtitle"
              />
              <button onClick={() => handleAddSubtitle(cat.id)} style={{ marginLeft: '5px' }}>
                Add Subtitle
              </button>
            </div>
            {cat.subtitles && cat.subtitles.length > 0 && (
              <ul>
                {cat.subtitles.map((sub, index) => (
                  <li key={index}>{sub}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesComponent;
