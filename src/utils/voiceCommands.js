// src/utils/voiceCommands.js
const COMMANDS = {
  NAVIGATION: {
    INBOX: ['go to inbox', 'open inbox', 'show inbox', 'inbox'],
    SENT: ['go to sent', 'open sent', 'show sent', 'sent mail', 'sent'],
    DRAFTS: ['go to drafts', 'open draft', 'show drafts', 'drafts'],
    TRASH: ['go to trash', 'open trash', 'show trash', 'trash'],
    SPAM: ['go to spam', 'open spam', 'show spam', 'spam'],
    COMPOSE: ['compose', 'new email', 'new message', 'write email', 'create email']
  },
  EMAIL_ACTIONS: {
    OPEN: ['open email', 'read email', 'view email', 'read message', 'open message'],
    DELETE: ['delete', 'delete email', 'trash email', 'move to trash', 'remove email'],
    REPLY: ['reply', 'reply to email', 'answer email'],
    FORWARD: ['forward', 'forward email', 'send forward'],
    MARK_READ: ['mark as read', 'mark read', 'set as read'],
    MARK_UNREAD: ['mark as unread', 'mark unread', 'set as unread'],
    ARCHIVE: ['archive', 'archive email', 'save email']
  },
  COMPOSE_ACTIONS: {
    RECIPIENT: ['set recipient to', 'send to', 'recipient', 'to'],
    SUBJECT: ['set subject to', 'subject', 'about'],
    BODY: ['set body to', 'message', 'content', 'body'],
    SEND: ['send email', 'send message', 'send', 'deliver email'],
    DISCARD: ['discard email', 'discard message', 'discard draft', 'cancel', 'clear email']
  },
  GENERAL: {
    HELP: ['help', 'what can i say', 'commands', 'voice commands', 'available commands'],
    STOP_LISTENING: ['stop listening', 'stop', 'pause', 'turn off voice', 'disable voice'],
    START_LISTENING: ['start listening', 'listen', 'resume', 'enable voice'],
    LOGOUT: ['log out', 'logout', 'sign out', 'exit']
  }
};

// Improved matching that's more forgiving of partial phrases
const matchCommand = (transcript, commandArray) => {
  const lowerTranscript = transcript.toLowerCase().trim();
  
  // First check for exact matches or contains
  for (const command of commandArray) {
    // Exact match
    if (lowerTranscript === command) {
      return true;
    }
    
    // Contains match
    if (lowerTranscript.includes(command)) {
      return true;
    }
  }
  
  // Then check for words in the command appearing in the same order
  for (const command of commandArray) {
    const commandWords = command.split(' ');
    if (commandWords.length > 1) {
      let lastIndex = -1;
      let allWordsFound = true;
      
      for (const word of commandWords) {
        // Skip very short words (less than 3 chars) for this matching approach
        if (word.length < 3) continue;
        
        const index = lowerTranscript.indexOf(word, lastIndex + 1);
        if (index === -1) {
          allWordsFound = false;
          break;
        }
        lastIndex = index;
      }
      
      if (allWordsFound) {
        return true;
      }
    }
  }
  
  return false;
};

const getCommandType = (transcript) => {
  // Check each category of commands
  for (const [category, categoryCommands] of Object.entries(COMMANDS)) {
    for (const [action, actionCommands] of Object.entries(categoryCommands)) {
      if (matchCommand(transcript, actionCommands)) {
        return { category, action, matched: true };
      }
    }
  }
  
  return { matched: false };
};

const extractParameter = (transcript, command) => {
  const lowerTranscript = transcript.toLowerCase();
  for (const cmd of command) {
    if (lowerTranscript.includes(cmd)) {
      // Get everything after the command
      const parameter = transcript.substring(lowerTranscript.indexOf(cmd) + cmd.length).trim();
      return parameter || null;
    }
  }
  return null;
};

export { COMMANDS, matchCommand, getCommandType, extractParameter };