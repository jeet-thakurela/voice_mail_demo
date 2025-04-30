import React, { useContext, useState } from 'react';
import EmailList from '../components/email/EmailList';
import EmailView from '../components/email/EmailView';
import { EmailContext } from '../contexts/EmailContext';
import { ThemeContext } from '../contexts/ThemeContext';
import '../styles/Inbox.css';

const Inbox = () => {
  const { selectedEmail } = useContext(EmailContext);
  const { darkMode } = useContext(ThemeContext);
  
  return (
    <div className={`inbox-container ${darkMode ? 'dark' : 'light'}`}>
      <div className="inbox-split-view">
        <div className="inbox-list-panel">
          <EmailList />
        </div>
        
        {selectedEmail && (
          <div className="inbox-view-panel">
            <EmailView />
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;