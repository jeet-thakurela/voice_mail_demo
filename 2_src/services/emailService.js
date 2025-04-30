// // This is a minimal service that will be expanded later when integrating with MongoDB
// // For now, it simulates working with emails using localStorage

// const STORAGE_KEY = 'voice_mail_emails';

// // Helper to get emails from localStorage
// const getStoredEmails = () => {
//   const storedEmails = localStorage.getItem(STORAGE_KEY);
//   return storedEmails ? JSON.parse(storedEmails) : {
//     inbox: [],
//     sent: [],
//     drafts: [],
//     trash: [],
//     spam: []
//   };
// };

// // Helper to save emails to localStorage
// const saveEmails = (emails) => {
//   localStorage.setItem(STORAGE_KEY, JSON.stringify(emails));
// };

// // Get emails for a specific folder
// export const getEmails = async (folder) => {
//   const emails = getStoredEmails();
//   return emails[folder] || [];
// };

// // Send a new email
// export const sendEmail = async (email) => {
//   const emails = getStoredEmails();
  
//   // Add to sent folder with metadata
//   const sentEmail = {
//     ...email,
//     id: Date.now().toString(),
//     date: new Date().toISOString(),
//     read: true,
//     folder: 'sent'
//   };
  
//   emails.sent.unshift(sentEmail);
//   saveEmails(emails);
  
//   return sentEmail;
// };

// // Save email as draft
// export const saveDraft = async (email) => {
//   const emails = getStoredEmails();
  
//   // Check if it's an existing draft being updated
//   const existingIndex = email.id ? emails.drafts.findIndex(d => d.id === email.id) : -1;
  
//   const draftEmail = {
//     ...email,
//     id: email.id || Date.now().toString(),
//     date: new Date().toISOString(),
//     folder: 'drafts'
//   };
  
//   if (existingIndex !== -1) {
//     emails.drafts[existingIndex] = draftEmail;
//   } else {
//     emails.drafts.unshift(draftEmail);
//   }
  
//   saveEmails(emails);
//   return draftEmail;
// };

// // Move email to a different folder
// export const moveEmail = async (emailId, fromFolder, toFolder) => {
//   const emails = getStoredEmails();
  
//   const emailIndex = emails[fromFolder].findIndex(e => e.id === emailId);
//   if (emailIndex === -1) return false;
  
//   const email = emails[fromFolder][emailIndex];
//   emails[fromFolder].splice(emailIndex, 1);
  
//   // Update folder property
//   const updatedEmail = {
//     ...email,
//     folder: toFolder
//   };
  
//   emails[toFolder].unshift(updatedEmail);
//   saveEmails(emails);
  
//   return updatedEmail;
// };

// // Delete email (move to trash or permanently delete if already in trash)
// export const deleteEmail = async (emailId, folder) => {
//   const emails = getStoredEmails();
  
//   const emailIndex = emails[folder].findIndex(e => e.id === emailId);
//   if (emailIndex === -1) return false;
  
//   if (folder === 'trash') {
//     // Permanently delete
//     emails.trash.splice(emailIndex, 1);
//   } else {
//     // Move to trash
//     const email = emails[folder][emailIndex];
//     emails[folder].splice(emailIndex, 1);
    
//     emails.trash.unshift({
//       ...email,
//       folder: 'trash'
//     });
//   }
  
//   saveEmails(emails);
//   return true;
// };

// // Mark email as read/unread
// export const markEmailAs = async (emailId, folder, isRead) => {
//   const emails = getStoredEmails();
  
//   const emailIndex = emails[folder].findIndex(e => e.id === emailId);
//   if (emailIndex === -1) return false;
  
//   emails[folder][emailIndex].read = isRead;
//   saveEmails(emails);
  
//   return emails[folder][emailIndex];
// };

// // Empty trash folder
// export const emptyTrash = async () => {
//   const emails = getStoredEmails();
//   emails.trash = [];
//   saveEmails(emails);
//   return true;
// };


// src/services/emailService.js
// This is a minimal service that will be expanded later when integrating with MongoDB
// For now, it simulates working with emails using localStorage

const STORAGE_KEY = 'voice_mail_emails';

// Helper to get emails from localStorage
const getStoredEmails = () => {
  const storedEmails = localStorage.getItem(STORAGE_KEY);
  return storedEmails ? JSON.parse(storedEmails) : {
    inbox: [],
    sent: [],
    drafts: [],
    trash: [],
    spam: []
  };
};

// Helper to save emails to localStorage
const saveEmails = (emails) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(emails));
};

// Create the emailService object with all the exported functions
const emailService = {
  // Get emails for a specific folder
  getEmails: async (folder) => {
    const emails = getStoredEmails();
    return emails[folder] || [];
  },

  // Send a new email
  sendEmail: async (email) => {
    const emails = getStoredEmails();
    
    // Add to sent folder with metadata
    const sentEmail = {
      ...email,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      read: true,
      folder: 'sent'
    };
    
    emails.sent.unshift(sentEmail);
    saveEmails(emails);
    
    return sentEmail;
  },

  // Save email as draft
  saveDraft: async (email) => {
    const emails = getStoredEmails();
    
    // Check if it's an existing draft being updated
    const existingIndex = email.id ? emails.drafts.findIndex(d => d.id === email.id) : -1;
    
    const draftEmail = {
      ...email,
      id: email.id || Date.now().toString(),
      date: new Date().toISOString(),
      folder: 'drafts'
    };
    
    if (existingIndex !== -1) {
      emails.drafts[existingIndex] = draftEmail;
    } else {
      emails.drafts.unshift(draftEmail);
    }
    
    saveEmails(emails);
    return draftEmail;
  },

  // Move email to a different folder
  moveEmail: async (emailId, fromFolder, toFolder) => {
    const emails = getStoredEmails();
    
    const emailIndex = emails[fromFolder].findIndex(e => e.id === emailId);
    if (emailIndex === -1) return false;
    
    const email = emails[fromFolder][emailIndex];
    emails[fromFolder].splice(emailIndex, 1);
    
    // Update folder property
    const updatedEmail = {
      ...email,
      folder: toFolder
    };
    
    emails[toFolder].unshift(updatedEmail);
    saveEmails(emails);
    
    return updatedEmail;
  },

  // Delete email (move to trash or permanently delete if already in trash)
  deleteEmail: async (emailId, folder) => {
    const emails = getStoredEmails();
    
    const emailIndex = emails[folder].findIndex(e => e.id === emailId);
    if (emailIndex === -1) return false;
    
    if (folder === 'trash') {
      // Permanently delete
      emails.trash.splice(emailIndex, 1);
    } else {
      // Move to trash
      const email = emails[folder][emailIndex];
      emails[folder].splice(emailIndex, 1);
      
      emails.trash.unshift({
        ...email,
        folder: 'trash'
      });
    }
    
    saveEmails(emails);
    return true;
  },

  // Mark email as read
  markAsRead: async (emailId, folder) => {
    return emailService.markEmailAs(emailId, folder, true);
  },

  // Mark email as unread
  markAsUnread: async (emailId, folder) => {
    return emailService.markEmailAs(emailId, folder, false);
  },

  // Mark email as read/unread
  markEmailAs: async (emailId, folder, isRead) => {
    const emails = getStoredEmails();
    
    const emailIndex = emails[folder].findIndex(e => e.id === emailId);
    if (emailIndex === -1) return false;
    
    emails[folder][emailIndex].read = isRead;
    saveEmails(emails);
    
    return emails[folder][emailIndex];
  },

  // Empty trash folder
  emptyTrash: async () => {
    const emails = getStoredEmails();
    emails.trash = [];
    saveEmails(emails);
    return true;
  }
};

export default emailService;
