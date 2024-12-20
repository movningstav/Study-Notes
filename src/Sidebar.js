import React, { useContext, useState } from 'react';
import { AppContext } from './AppContext';
import { Box, Typography } from '@mui/material';
import './App.css';

const Sidebar = () => {
  const { categories, setSelectedContent } = useContext(AppContext);
  
  // State to track expanded categories and subtitles
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [expandedSubtitles, setExpandedSubtitles] = useState([]);

  // Handler to toggle category expansion
  const handleCategoryClick = (category) => {
    const isExpanded = expandedCategories.includes(category.id);
    if (isExpanded) {
      // Collapse the category
      setExpandedCategories(expandedCategories.filter(id => id !== category.id));
      
      // Close all subtitles under this category
      const subtitleIds = category.subtitles.map(sub => sub.id);
      setExpandedSubtitles(expandedSubtitles.filter(id => !subtitleIds.includes(id)));
    } else {
      // Expand the category
      setExpandedCategories([...expandedCategories, category.id]);
      // Do not auto-expand subtitles
    }

    // Set selected content
    setSelectedContent({
      id: category.id,
      title: category.title,
      context: category.context || '',
      type: 'category',
    });
  };

  // Handler to toggle subtitle expansion
  const handleSubtitleClick = (subtitle, category) => {
    const isExpanded = expandedSubtitles.includes(subtitle.id);
    if (isExpanded) {
      // Collapse the subtitle
      setExpandedSubtitles(expandedSubtitles.filter(id => id !== subtitle.id));
    } else {
      // Expand the subtitle
      setExpandedSubtitles([...expandedSubtitles, subtitle.id]);
      // Do not auto-expand sub-subtitles
    }

    // Set selected content
    setSelectedContent({
      id: subtitle.id,
      title: subtitle.title,
      context: subtitle.context || '',
      type: 'subtitle',
    });
  };

  // Handler for sub-subtitle click
  const handleSubSubtitleClick = (subSubtitle) => {
    setSelectedContent({
      id: subSubtitle.id,
      title: subSubtitle.title,
      context: subSubtitle.context || '',
      type: 'subsubtitle',
    });
  };

  return (
    <Box className="sidebar">
      {categories.map((category) => (
        <Box key={category.id}>
          {/* Category Header */}
          <Box
            className="sidebar-item title-box"
            onClick={() => handleCategoryClick(category)}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" component="span">
              {category.title}
            </Typography>
          </Box>

          {/* Subtitles */}
          {expandedCategories.includes(category.id) &&
            category.subtitles.map((subtitle) => (
              <Box key={subtitle.id}>
                {/* Subtitle Header */}
                <Box
                  className="sidebar-item subtitle-box"
                  onClick={() => handleSubtitleClick(subtitle, category)}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  ml={2} // Indent subtitles
                >
                  <Typography variant="subtitle1" component="span">
                    {subtitle.title}
                  </Typography>
                </Box>

                {/* Sub-Subtitles */}
                {expandedSubtitles.includes(subtitle.id) &&
                  subtitle.subSubtitles.map((subSubtitle) => (
                    <Box
                      key={subSubtitle.id}
                      className="sidebar-item subsubtitle-box"
                      onClick={() => handleSubSubtitleClick(subSubtitle)}
                      ml={4} // Indent sub-subtitles further
                    >
                      <Typography variant="body2">{subSubtitle.title}</Typography>
                    </Box>
                  ))}
              </Box>
            ))}
        </Box>
      ))}
    </Box>
  );
};

export default Sidebar;