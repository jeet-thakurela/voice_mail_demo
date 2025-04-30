



// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import useTextToSpeech from '../../hooks/useTextToSpeech';
///Users/jeetthakurela/Desktop/voice_email/frontend/src/components/email/EmailView.jsx
import '../../styles/EmailView.css';



import React, { useContext, useEffect } from 'react';
import { EmailContext } from '../../contexts/EmailContext';
import { ThemeContext } from '../../contexts/ThemeContext';


const EmailView = () => {
  const { selectedEmail, markAsRead, deleteEmail } = useContext(EmailContext);
  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    if (selectedEmail && !selectedEmail.read) {
      markAsRead(selectedEmail.id);
    }
  }, [selectedEmail, markAsRead]);

  const handleDelete = () => {
    if (selectedEmail) {
      deleteEmail(selectedEmail.id);
    }
  };

  const handleReply = () => {
    // Would navigate to compose page with reply info pre-filled
    console.log('Reply to:', selectedEmail?.id);
  };

  const handleForward = () => {
    // Would navigate to compose page with forward info pre-filled
    console.log('Forward:', selectedEmail?.id);
  };

  if (!selectedEmail) {
    return (
      <div className={`email-view-empty ${darkMode ? 'dark' : 'light'}`}>
        <p>Select an email to view its contents</p>
      </div>
    );
  }

  return (
    <div className={`email-view ${darkMode ? 'dark' : 'light'}`}>
      <div className="email-view-header">
        <h2 className="email-view-subject">{selectedEmail.subject}</h2>
        <div className="email-view-actions">
          <button 
            className="email-action-btn" 
            onClick={handleReply}
            aria-label="Reply"
          >
            ↩️ Reply
          </button>
          <button 
            className="email-action-btn" 
            onClick={handleForward}
            aria-label="Forward"
          >
            ↪️ Forward
          </button>
          <button 
            className="email-action-btn delete" 
            onClick={handleDelete}
            aria-label="Delete"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
      
      <div className="email-view-meta">
        <div className="email-view-sender">
          <strong>From:</strong> {selectedEmail.sender} {selectedEmail.senderEmail && `<${selectedEmail.senderEmail}>`}
        </div>
        <div className="email-view-recipients">
          <strong>To:</strong> {selectedEmail.recipients?.join(', ') || 'me'}
        </div>
        {selectedEmail.date && (
          <div className="email-view-date">
            <strong>Date:</strong> {new Date(selectedEmail.date).toLocaleString()}
          </div>
        )}
      </div>
      
      <div className="email-view-body">
        <div 
          dangerouslySetInnerHTML={{ __html: selectedEmail.body || selectedEmail.preview }} 
        />
      </div>
    </div>
  );
};

export default EmailView;