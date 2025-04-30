///Users/jeetthakurela/Desktop/voice_email/frontend/src/components/email/EmailItem.jsx
import '../../styles/EmailItem.css';

import React from 'react';
// import './EmailItem.css';

const EmailItem = ({ email, onClick, onDelete }) => {
  const handleClick = (e) => {
    onClick(email);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(email.id);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      // Today, just show time
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      // Not today, show date
      return date.toLocaleDateString();
    }
  };

  return (
    <div 
      className={`email-item ${email.read ? 'read' : 'unread'}`}
      onClick={handleClick}
    >
      <div className="email-sender">{email.sender}</div>
      <div className="email-subject">{email.subject}</div>
      <div className="email-preview">{email.preview}</div>
      <div className="email-date">{email.date ? formatDate(email.date) : ''}</div>
      <button 
        className="email-delete-btn" 
        onClick={handleDelete}
        aria-label="Delete email"
      >
        🗑️
      </button>
    </div>
  );
};

export default EmailItem;