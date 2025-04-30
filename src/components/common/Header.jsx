import "../../styles/Header.css";
import React, { useContext, useState } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { getAuth, signOut } from 'firebase/auth';

const Header = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const [searchQuery, setSearchQuery] = useState('');
  const auth = getAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className={`app-header ${darkMode ? 'dark' : 'light'}`}>
      <div className="header-left">
        <h1>Voice Mail</h1>
      </div>
      
      <div className="header-center">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search emails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>
      </div>
      
      <div className="header-right">
        <button 
          onClick={toggleTheme} 
          className="theme-toggle-btn"
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
        <button onClick={handleSignOut} className="sign-out-btn">
          Sign Out
        </button>
      </div>
    </header>
  );
};

export default Header;
