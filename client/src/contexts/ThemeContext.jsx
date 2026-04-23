import React, { createContext, useContext, useState } from 'react';

// Create theme context
const ThemeContext = createContext();

// Available color palettes
const colorPalettes = {
  default: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    background: '#ffffff',
    text: '#1f2937',
    accent: '#f59e0b'
  },
  dark: {
    primary: '#1e40af',
    secondary: '#374151',
    background: '#111827',
    text: '#f9fafb',
    accent: '#10b981'
  },
  blue: {
    primary: '#2563eb',
    secondary: '#3b82f6',
    background: '#eff6ff',
    text: '#1e293b',
    accent: '#06b6d4'
  },
  green: {
    primary: '#10b981',
    secondary: '#059669',
    background: '#ecfdf5',
    text: '#064e3b',
    accent: '#84cc16'
  }
};

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('default');
  const [lightMode, setLightMode] = useState(true);

  const toggleLightMode = () => {
    setLightMode(!lightMode);
  };

  const updateColorPalette = (paletteName) => {
    setCurrentTheme(paletteName);
  };

  const allPalettes = Object.keys(colorPalettes);

  const value = {
    currentTheme,
    lightMode,
    toggleLightMode,
    updateColorPalette,
    allPalettes,
    colors: colorPalettes[currentTheme] || colorPalettes.default
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;