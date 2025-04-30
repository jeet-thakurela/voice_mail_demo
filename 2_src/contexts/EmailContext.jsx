


































// src/contexts/EmailContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import emailService from '../services/emailService';

export const EmailContext = createContext();

export const EmailProvider = ({ children }) => {
  const [emails, setEmails] = useState([]);
  const [currentEmail, setCurrentEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentFolder, setCurrentFolder] = useState('inbox');

  // Load emails for the current folder
  useEffect(() => {
    loadEmails(currentFolder);
  }, [currentFolder]);

  const loadEmails = async (folder) => {
    setLoading(true);
    try {
      const fetchedEmails = await emailService.getEmails(folder);
      setEmails(fetchedEmails);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const selectEmail = (emailId) => {
    const selected = emails.find(email => email.id === emailId);
    setCurrentEmail(selected);
    
    // Mark as read when selecting
    if (selected && !selected.read) {
      markAsRead(emailId);
    }
  };

  const deleteEmail = async (emailId) => {
    try {
      await emailService.deleteEmail(emailId, currentFolder);
      setEmails(emails.filter(email => email.id !== emailId));
      if (currentEmail && currentEmail.id === emailId) {
        setCurrentEmail(null);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const markAsRead = async (emailId) => {
    try {
      await emailService.markAsRead(emailId, currentFolder);
      setEmails(emails.map(email => 
        email.id === emailId ? { ...email, read: true } : email
      ));
      if (currentEmail && currentEmail.id === emailId) {
        setCurrentEmail({ ...currentEmail, read: true });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const markAsUnread = async (emailId) => {
    try {
      await emailService.markAsUnread(emailId, currentFolder);
      setEmails(emails.map(email => 
        email.id === emailId ? { ...email, read: false } : email
      ));
      if (currentEmail && currentEmail.id === emailId) {
        setCurrentEmail({ ...currentEmail, read: false });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const sendEmail = async (email) => {
    try {
      const sentEmail = await emailService.sendEmail(email);
      return sentEmail;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const changeFolder = (folder) => {
    setCurrentFolder(folder);
    setCurrentEmail(null);
  };

  return (
    <EmailContext.Provider
      value={{
        emails,
        currentEmail,
        loading,
        error,
        currentFolder,
        selectEmail,
        deleteEmail,
        markAsRead,
        markAsUnread,
        sendEmail,
        changeFolder,
        refreshEmails: () => loadEmails(currentFolder)
      }}
    >
      {children}
    </EmailContext.Provider>
  );
};

























// import React, { createContext, useState, useEffect } from 'react';
// import { getAuth } from 'firebase/auth';

// export const EmailContext = createContext();

// export const EmailProvider = ({ children }) => {
//   const [emails, setEmails] = useState([]);
//   const [currentFolder, setCurrentFolder] = useState('inbox');
//   const [selectedEmail, setSelectedEmail] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   const auth = getAuth();

//   useEffect(() => {
//     const fetchEmails = async () => {
//       try {
//         setLoading(true);
//         // This would normally fetch from your backend
//         // For now, we're using an empty array
//         setEmails([]);
//         setLoading(false);
//       } catch (err) {
//         setError('Failed to fetch emails');
//         setLoading(false);
//       }
//     };

//     if (auth.currentUser) {
//       fetchEmails();
//     }
//   }, [currentFolder, auth.currentUser]);

//   const changeFolder = (folder) => {
//     setCurrentFolder(folder);
//     setSelectedEmail(null);
//   };

//   const deleteEmail = async (emailId) => {
//     try {
//       // This would normally delete via your backend
//       // For now, just remove from local state
//       setEmails(emails.filter(email => email.id !== emailId));
//       if (selectedEmail && selectedEmail.id === emailId) {
//         setSelectedEmail(null);
//       }
//       return true;
//     } catch (err) {
//       setError('Failed to delete email');
//       return false;
//     }
//   };

//   const markAsRead = async (emailId) => {
//     try {
//       // This would normally update via your backend
//       setEmails(emails.map(email => 
//         email.id === emailId ? { ...email, read: true } : email
//       ));
//       return true;
//     } catch (err) {
//       setError('Failed to mark email as read');
//       return false;
//     }
//   };

//   return (
//     <EmailContext.Provider value={{
//       emails,
//       currentFolder,
//       selectedEmail,
//       loading,
//       error,
//       changeFolder,
//       setSelectedEmail,
//       deleteEmail,
//       markAsRead
//     }}>
//       {children}
//     </EmailContext.Provider>
//   );
// };
