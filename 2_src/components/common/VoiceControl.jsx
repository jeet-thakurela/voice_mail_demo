//frontend/src/components/common/VoiceControl.jsx
import '../../styles/VoiceControl.css';
import React, { useEffect, useState, useContext, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useVoiceRecognition from '../../hooks/useVoiceRecognition';
import useTextToSpeech from '../../hooks/useTextToSpeech';
import { getCommandType, extractParameter, COMMANDS } from '../../utils/voiceCommands';
import { EmailContext } from '../../contexts/EmailContext';
import { AuthContext } from '../../contexts/AuthContext';

const VoiceControl = () => {
  const { isListening, transcript, error, startListening, stopListening, clearTranscript } = useVoiceRecognition(true);
  const { speak } = useTextToSpeech();
  const navigate = useNavigate();
  
  const [activeCommand, setActiveCommand] = useState(null);
  const { emails, currentEmail, selectEmail, deleteEmail, markAsRead, markAsUnread } = useContext(EmailContext);
  const { logout } = useContext(AuthContext);
  const [isEnabled, setIsEnabled] = useState(true);

  const processedCommandRef = useRef(null);

  // Start listening when component mounts if enabled
  useEffect(() => {
    if (isEnabled && !isListening) {
      startListening();
      speak('Voice commands activated. Say "help" for available commands.');
    }
    
    return () => stopListening();
  }, [isEnabled]);

  // Toggle voice control on/off
  const toggleVoiceControl = () => {
    if (isEnabled) {
      setIsEnabled(false);
      stopListening();
      speak('Voice commands disabled');
    } else {
      setIsEnabled(true);
      startListening();
      speak('Voice commands activated. Say "help" for available commands.');
    }
  };

  // Optimized navigation function using useCallback
  const navigateTo = useCallback((path, message) => {
    navigate(path);
    speak(message);
  }, [navigate, speak]);

  // Process voice commands
  useEffect(() => {
    if (!transcript || transcript.trim() === '') return;
    
    console.log('Processing transcript:', transcript);
    
    // Prevent duplicate command execution
    if (processedCommandRef.current === transcript) return;
    processedCommandRef.current = transcript;

    // Clear command after 2 seconds to avoid repetition
    setTimeout(() => {
      processedCommandRef.current = null;
    }, 2000);

    const { category, action, matched } = getCommandType(transcript);
    
    if (!matched) {
      console.log('Command not recognized:', transcript);
      return;
    }
    
    console.log('Command recognized:', category, action);
    
    setActiveCommand({ category, action, transcript });

    // Clear the transcript after processing
    setTimeout(() => clearTranscript(), 1000);

    // Handle navigation commands
    if (category === 'NAVIGATION') {
      switch (action) {
        case 'INBOX': navigateTo('/inbox', 'Opening inbox'); break;
        case 'SENT': navigateTo('/sent', 'Opening sent mail'); break;
        case 'DRAFTS': navigateTo('/drafts', 'Opening drafts'); break;
        case 'TRASH': navigateTo('/trash', 'Opening trash'); break;
        case 'SPAM': navigateTo('/spam', 'Opening spam folder'); break;
        case 'COMPOSE': navigateTo('/compose', 'Opening new email composition'); break;
        default: break;
      }
    }

    // Handle email actions
    if (category === 'EMAIL_ACTIONS') {
      (async () => {
        switch (action) {
          case 'OPEN': {
            const emailNumber = extractParameter(transcript, COMMANDS.EMAIL_ACTIONS.OPEN);
            if (emailNumber && emails && emails[parseInt(emailNumber) - 1]) {
              selectEmail(emails[parseInt(emailNumber) - 1].id);
              speak(`Opening email ${emailNumber}`);
            } else if (currentEmail) {
              speak(`Reading current email. From: ${currentEmail.from}. Subject: ${currentEmail.subject}. Message: ${currentEmail.body}`);
            } else {
              speak('Please select an email first');
            }
            break;
          }
          case 'DELETE':
            if (currentEmail) {
              speak('Deleting email in 3 seconds. Say "cancel" to stop.');
              await new Promise(resolve => setTimeout(resolve, 3000));
              if (processedCommandRef.current === 'cancel') {
                speak('Email deletion canceled.');
                return;
              }
              await deleteEmail(currentEmail.id);
              speak('Email deleted');
            } else {
              speak('Please select an email first');
            }
            break;
          case 'MARK_READ':
            if (currentEmail) {
              await markAsRead(currentEmail.id);
              speak('Email marked as read');
            } else {
              speak('Please select an email first');
            }
            break;
          case 'MARK_UNREAD':
            if (currentEmail) {
              await markAsUnread(currentEmail.id);
              speak('Email marked as unread');
            } else {
              speak('Please select an email first');
            }
            break;
          default:
            break;
        }
      })();
    }

    // Handle general commands
    if (category === 'GENERAL') {
      switch (action) {
        case 'HELP':
          speak('Available commands include: "Go to inbox", "compose", "read email", "delete", "mark as read", and "logout". You can say "help" again for more commands.');
          break;
        case 'STOP_LISTENING':
          setIsEnabled(false);
          stopListening();
          speak('Voice commands stopped');
          break;
        case 'START_LISTENING':
          setIsEnabled(true);
          startListening();
          speak('Voice commands activated');
          break;
        case 'LOGOUT':
          logout();
          speak('Logging out');
          navigate('/login');
          break;
        default:
          break;
      }
    }

  }, [transcript]);

  // Handle errors
  useEffect(() => {
    if (error) {
      console.error('Voice recognition error:', error);
      speak(`Voice recognition error: ${error}`);
      
      // Restart on error if enabled
      if (isEnabled && !isListening) {
        setTimeout(() => startListening(), 3000);
      }
    }
  }, [error]);

  return (
    <div className="voice-control-container">
      <button 
        onClick={toggleVoiceControl} 
        className={`voice-control-button ${isEnabled ? 'active' : ''}`}
        aria-label={isEnabled ? "Disable voice commands" : "Enable voice commands"}
      >
        {isEnabled ? 'Voice Commands Active' : 'Enable Voice Commands'}
      </button>
      
      {isEnabled && (
        <div className="voice-status">
          <div className="listening-indicator" role="status">
            {isListening ? 'Listening...' : 'Voice recognition paused'}
          </div>
          {transcript && <div className="transcript" aria-live="polite">Heard: {transcript}</div>}
          {activeCommand && (
            <div className="active-command" aria-live="polite">
              Executing: {activeCommand.category} - {activeCommand.action}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VoiceControl;
