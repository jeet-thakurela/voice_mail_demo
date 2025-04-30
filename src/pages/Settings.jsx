// import React, { useState, useEffect } from 'react';
// import MainLayout from '../components/layouts/MainLayout';
// import ThemeToggle from '../components/common/ThemeToggle';
// import { useAuth } from '../contexts/AuthContext';
// import { useTextToSpeech } from '../hooks/useTextToSpeech';
// import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
// // import '../assets/styles/Settings.css';


import React, { useContext, useState } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import '../styles/Settings.css';

const Settings = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  
  // These would be stored in context or localStorage in a real app
  const [settings, setSettings] = useState({
    voiceEnabled: false,
    voiceSpeed: 1,
    voicePitch: 1,
    voiceCommands: true,
    notificationSound: true,
  });

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className={`settings-container ${darkMode ? 'dark' : 'light'}`}>
      <h2>Settings</h2>
      
      <div className="settings-section">
        <h3>Appearance</h3>
        <div className="settings-option">
          <label htmlFor="darkMode">Dark Mode</label>
          <div className="toggle-switch">
            <input
              type="checkbox"
              id="darkMode"
              checked={darkMode}
              onChange={toggleTheme}
            />
            <label htmlFor="darkMode" className="toggle-label"></label>
          </div>
        </div>
      </div>
      
      <div className="settings-section">
        <h3>Voice Control (Coming Soon)</h3>
        <p className="settings-note">
          Voice control features will be implemented in the next phase.
        </p>
        
        <div className="settings-option">
          <label htmlFor="voiceEnabled">Enable Voice Control</label>
          <div className="toggle-switch">
            <input
              type="checkbox"
              id="voiceEnabled"
              name="voiceEnabled"
              checked={settings.voiceEnabled}
              onChange={handleChange}
            />
            <label htmlFor="voiceEnabled" className="toggle-label"></label>
          </div>
        </div>
        
        <div className="settings-option">
          <label htmlFor="voiceSpeed">Voice Speed</label>
          <input
            type="range"
            id="voiceSpeed"
            name="voiceSpeed"
            min="0.5"
            max="2"
            step="0.1"
            value={settings.voiceSpeed}
            onChange={handleChange}
            disabled={!settings.voiceEnabled}
          />
          <span>{settings.voiceSpeed}x</span>
        </div>
        
        <div className="settings-option">
          <label htmlFor="voicePitch">Voice Pitch</label>
          <input
            type="range"
            id="voicePitch"
            name="voicePitch"
            min="0.5"
            max="1.5"
            step="0.1"
            value={settings.voicePitch}
            onChange={handleChange}
            disabled={!settings.voiceEnabled}
          />
          <span>{settings.voicePitch}x</span>
        </div>
        
        <div className="settings-option">
          <label htmlFor="voiceCommands">Enable Voice Commands</label>
          <div className="toggle-switch">
            <input
              type="checkbox"
              id="voiceCommands"
              name="voiceCommands"
              checked={settings.voiceCommands}
              onChange={handleChange}
              disabled={!settings.voiceEnabled}
            />
            <label htmlFor="voiceCommands" className="toggle-label"></label>
          </div>
        </div>
      </div>
      
      <div className="settings-section">
        <h3>Notifications</h3>
        <div className="settings-option">
          <label htmlFor="notificationSound">Play Sound for New Emails</label>
          <div className="toggle-switch">
            <input
              type="checkbox"
              id="notificationSound"
              name="notificationSound"
              checked={settings.notificationSound}
              onChange={handleChange}
            />
            <label htmlFor="notificationSound" className="toggle-label"></label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;