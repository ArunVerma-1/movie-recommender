import { useState, useEffect } from 'react';

export const useColorMode = () => {
  const [colorMode, setColorMode] = useState('light');

  useEffect(() => {
    const stored = localStorage.getItem('color-mode');
    if (stored) {
      setColorMode(stored);
    }
  }, []);

  const toggleColorMode = () => {
    const newMode = colorMode === 'light' ? 'dark' : 'light';
    setColorMode(newMode);
    localStorage.setItem('color-mode', newMode);
  };

  return { colorMode, toggleColorMode };
};

export const useColorModeValue = (lightValue, darkValue) => {
  const { colorMode } = useColorMode();
  return colorMode === 'light' ? lightValue : darkValue;
};
