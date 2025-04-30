import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmailContext } from '../contexts/EmailContext';
import { ThemeContext } from '../contexts/ThemeContext';
import useVoiceRecognition from '../hooks/useVoiceRecognition';
import useTextToSpeech from '../hooks/useTextToSpeech';
import { COMMANDS } from '../utils/voiceCommands';
import '../styles/Compose.css';


const Compose = () => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [showCcBcc, setShowCcBcc] = useState(false);
  const { sendEmail } = useContext(EmailContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  
  const { isListening, transcript, startListening, stopListening } = useVoiceRecognition();
  const { speak } = useTextToSpeech();
  const voiceTimeoutRef = useRef(null);

  // Voice command processing
  const processVoiceCommand = (command) => {
    const lowerCommand = command.toLowerCase();
    
    // Extract recipient
    if (lowerCommand.includes('set recipient') || lowerCommand.includes('to')) {
      const recipient = command.split('to')[1]?.trim() || command.split('recipient')[1]?.trim();
      if (recipient) {
        setTo(recipient);
        speak(`Recipient set to ${recipient}`);
      }
      return;
    }

    // Extract subject
    if (lowerCommand.includes('set subject') || lowerCommand.includes('subject')) {
      const subjectText = command.split('subject')[1]?.trim();
      if (subjectText) {
        setSubject(subjectText);
        speak(`Subject set to ${subjectText}`);
      }
      return;
    }

    // Extract body
    if (lowerCommand.includes('set body') || lowerCommand.includes('message')) {
      const bodyText = command.split('body')[1]?.trim() || command.split('message')[1]?.trim();
      if (bodyText) {
        setBody(bodyText);
        speak('Message body updated');
      }
      return;
    }

    // Send command
    if (COMMANDS.COMPOSE_ACTIONS.SEND.some(cmd => lowerCommand.includes(cmd))) {
      handleSend();
      return;
    }

    // Discard command
    if (COMMANDS.COMPOSE_ACTIONS.DISCARD.some(cmd => lowerCommand.includes(cmd))) {
      setTo('');
      setSubject('');
      setBody('');
      speak('Email discarded');
      return;
    }
  };

  // Handle voice input
  useEffect(() => {
    if (transcript) {
      processVoiceCommand(transcript);
      // Reset listening after processing
      if (voiceTimeoutRef.current) clearTimeout(voiceTimeoutRef.current);
      voiceTimeoutRef.current = setTimeout(() => {
        startListening();
      }, 2000);
    }
  }, [transcript]);

  // Initialize voice control
  useEffect(() => {
    speak('Compose email. Say commands like: "Set recipient to example@test.com", "Subject meeting tomorrow", "Message hello there", or "Send email"');
    }, []);

  const handleSend = async () => {
    if (!to) {
      speak('Please specify a recipient');
      return;
    }

    try {
      await sendEmail({ 
        to, 
        subject, 
        body,
        cc: cc ? [cc] : [],
        bcc: bcc ? [bcc] : []
      });
      speak('Email sent successfully');
      navigate('/sent');
    } catch (error) {
      speak(`Failed to send email: ${error.message}`);
    }
  };

  return (
    <div className={`compose-window ${theme === 'light' ? 'light-mode' : 'dark-mode'}`}>
      <div className="compose-header">
        <span>New Message</span>
        <div>
          <button onClick={() => setShowCcBcc(!showCcBcc)}>
            {showCcBcc ? 'Hide Cc/Bcc' : 'Cc/Bcc'}
          </button>
          <FaWindowMinimize className="icon" />
          <FaExpand className="icon" />
          <FaTimes className="icon" onClick={() => navigate(-1)} />
        </div>
      </div>
      
      <div className="compose-input-group">
        <input 
          type="email" 
          placeholder="To" 
          value={to} 
          onChange={(e) => setTo(e.target.value)} 
        />
        {showCcBcc && (
          <>
            <input 
              type="email" 
              placeholder="Cc" 
              value={cc} 
              onChange={(e) => setCc(e.target.value)} 
            />
            <input 
              type="email" 
              placeholder="Bcc" 
              value={bcc} 
              onChange={(e) => setBcc(e.target.value)} 
            />
          </>
        )}
      </div>
      
      <input 
        type="text" 
        placeholder="Subject" 
        value={subject} 
        onChange={(e) => setSubject(e.target.value)} 
      />
      
      <textarea 
        placeholder="Message" 
        value={body} 
        onChange={(e) => setBody(e.target.value)} 
      />
      
      <div className="compose-footer">
        <button 
          className={`send-btn ${isListening ? 'listening' : ''}`} 
          onClick={handleSend}
        >
          {isListening ? 'Listening...' : 'Send'}
        </button>
        
        <div className="compose-tools">
          <FaPaperclip className="icon" title="Attach file" />
          <FaSmile className="icon" title="Insert emoji" />
          <FaBold className="icon" title="Bold" />
          <FaItalic className="icon" title="Italic" />
          <FaTrash 
            className="icon" 
            title="Discard" 
            onClick={() => {
              setTo('');
              setSubject('');
              setBody('');
              speak('Email discarded');
            }} 
          />
          <FaEllipsisV className="icon" title="More options" />
        </div>
      </div>
    </div>
  );
};

export default Compose;