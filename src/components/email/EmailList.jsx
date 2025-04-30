// import React from 'react';
// import EmailItem from './EmailItem';
import '../../styles/EmailList.css';



import React, { useContext } from 'react';
import EmailItem from './EmailItem';
import { EmailContext } from '../../contexts/EmailContext';
import { ThemeContext } from '../../contexts/ThemeContext';


const EmailList = () => {
  const { 
    emails, 
    currentFolder, 
    setSelectedEmail, 
    deleteEmail,
    loading,
    error
  } = useContext(EmailContext);
  
  const { darkMode } = useContext(ThemeContext);

  const handleEmailClick = (email) => {
    setSelectedEmail(email);
  };

  const handleEmailDelete = (emailId) => {
    deleteEmail(emailId);
  };

  if (loading) {
    return <div className="email-list-message">Loading emails...</div>;
  }

  if (error) {
    return <div className="email-list-message error">{error}</div>;
  }

  if (emails.length === 0) {
    return (
      <div className={`email-list-empty ${darkMode ? 'dark' : 'light'}`}>
        <div className="empty-icon">📭</div>
        <p>This folder is empty</p>
      </div>
    );
  }

  return (
    <div className={`email-list ${darkMode ? 'dark' : 'light'}`}>
      <div className="email-list-header">
        <h2>{currentFolder.charAt(0).toUpperCase() + currentFolder.slice(1)}</h2>
        <span className="email-count">{emails.length} emails</span>
      </div>
      
      <div className="email-items">
        {emails.map(email => (
          <EmailItem 
            key={email.id}
            email={email}
            onClick={handleEmailClick}
            onDelete={handleEmailDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default EmailList;