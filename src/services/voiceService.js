// src/services/voiceService.js
import { getCommandType, extractParameter, COMMANDS } from '../utils/voiceCommands';

class VoiceService {
  constructor(textToSpeech) {
    this.tts = textToSpeech;
  }

  announceEmailList(emails) {
    if (!emails || emails.length === 0) {
      this.tts.speak('No emails found in this folder');
      return;
    }

    this.tts.speak(`You have ${emails.length} emails. I'll read the first 5.`);
    
    // Read the first 5 emails
    emails.slice(0, 5).forEach((email, index) => {
      setTimeout(() => {
        this.tts.speak(`Email ${index + 1}: From ${email.from}, Subject: ${email.subject}`);
      }, 2000 * (index + 1)); // Space out the announcements
    });
  }

  announceEmailDetails(email) {
    if (!email) {
      this.tts.speak('No email selected');
      return;
    }

    this.tts.speak(`Email from ${email.from}. Subject: ${email.subject}.`);
    setTimeout(() => {
      this.tts.speak(`Message: ${email.body}`);
    }, 1500);
  }

  announceNavigation(location) {
    const announcements = {
      '/inbox': 'Inbox opened',
      '/sent': 'Sent mail opened',
      '/drafts': 'Drafts opened',
      '/trash': 'Trash opened',
      '/spam': 'Spam folder opened',
      '/compose': 'New email composition opened',
      '/settings': 'Settings opened'
    };

    this.tts.speak(announcements[location] || 'Page navigation complete');
  }

  announceHelpCommands() {
    this.tts.speak('Here are some available commands:');
    
    setTimeout(() => {
      this.tts.speak('For navigation, you can say: Go to inbox, Go to sent, Go to drafts, Go to trash, Go to spam, or Compose.');
    }, 2000);
    
    setTimeout(() => {
      this.tts.speak('For email actions, you can say: Open email, Delete email, Mark as read, or Mark as unread.');
    }, 5000);
    
    setTimeout(() => {
      this.tts.speak('For general actions, you can say: Help, Stop listening, Start listening, or Logout.');
    }, 8000);
  }

  processComposeCommand(transcript, setRecipient, setSubject, setBody, sendEmail) {
    const { action } = getCommandType(transcript);
    
    if (action === 'RECIPIENT') {
      const recipient = extractParameter(transcript, COMMANDS.COMPOSE_ACTIONS.RECIPIENT);
      if (recipient) {
        setRecipient(recipient);
        this.tts.speak(`Recipient set to ${recipient}`);
      }
      return true;
    }
    
    if (action === 'SUBJECT') {
      const subject = extractParameter(transcript, COMMANDS.COMPOSE_ACTIONS.SUBJECT);
      if (subject) {
        setSubject(subject);
        this.tts.speak(`Subject set to ${subject}`);
      }
      return true;
    }
    
    if (action === 'BODY') {
      const body = extractParameter(transcript, COMMANDS.COMPOSE_ACTIONS.BODY);
      if (body) {
        setBody(body);
        this.tts.speak('Email body updated');
      }
      return true;
    }
    
    if (action === 'SEND') {
      sendEmail();
      this.tts.speak('Email sent');
      return true;
    }
    
    if (action === 'DISCARD') {
      setRecipient('');
      setSubject('');
      setBody('');
      this.tts.speak('Email discarded');
      return true;
    }
    
    return false;
  }
}

export default VoiceService;