
// src/components/common/ThemeToggle.jsximport React, { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import useTextToSpeech from '../../hooks/useTextToSpeech';
import '../../styles/ThemeToggle.css';

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { speak } = useTextToSpeech();

  const handleToggle = () => {
    toggleTheme();
    speak(darkMode ? 'Switching to light mode' : 'Switching to dark mode');
  };

  return (
    <button 
      className={`theme-toggle-btn ${darkMode ? 'dark' : 'light'}`}
      onClick={handleToggle}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="theme-icon">{darkMode ? '☀️' : '🌙'}</span>
    </button>
  );
};

export default ThemeToggle;




























// import React, { useContext } from 'react';
// import { ThemeContext } from '../../contexts/ThemeContext';
// import '../../styles/ThemeToggle.css';

// import { useContext } from 'react';
// import { ThemeContext } from '../../contexts/ThemeContext';

// const ThemeToggle = () => {
//   const { theme, toggleTheme } = useContext(ThemeContext);

//   return (
//     <button 
//       className="theme-toggle-btn" 
//       onClick={toggleTheme}
//       aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
//     >
//       <span className="theme-icon">
//         {theme === 'light' ? '🌙' : '☀️'}
//       </span>
//     </button>
//   );
// };

// export default ThemeToggle;
