import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmailContext } from '../contexts/EmailContext';
import { ThemeContext } from '../contexts/ThemeContext';
import useVoiceRecognition from '../hooks/useVoiceRecognition';
import useTextToSpeech from '../hooks/useTextToSpeech';
import VoiceService from '../services/voiceService';
import '../styles/Compose.css';
import { FaPaperclip, FaSmile, FaBold, FaItalic, FaTrash, FaEllipsisV, FaTimes, FaExpand } from 'react-icons/fa';
import { FaWindowMinimize,} from 'react-icons/fa';

const Compose = () => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [showCcBcc, setShowCcBcc] = useState(false);
  const { sendEmail } = useContext(EmailContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  
  const { isListening, transcript, startListening, stopListening } = useVoiceRecognition();
  const textToSpeech = useTextToSpeech();
  const voiceService = new VoiceService(textToSpeech);

  useEffect(() => {
    startListening();
    textToSpeech.speak('Compose email. Say set recipient, set subject, or send email.');
    return () => stopListening();
  }, []);

  useEffect(() => {
    if (!transcript) return;
    voiceService.processComposeCommand(transcript, setTo, setSubject, setBody, handleSend);
  }, [transcript]);

  const handleSend = async () => {
    if (!to) {
      textToSpeech.speak('Please enter a recipient');
      return;
    }
    try {
      await sendEmail({ to, subject, body });
      textToSpeech.speak('Email sent successfully');
      navigate('/sent');
    } catch (error) {
      textToSpeech.speak(`Failed to send email. ${error.message}`);
    }
  };

  return (
    <div className={`compose-window dark-mode ${theme === 'light' ? 'light-mode' : ''}`}> 
      <div className="compose-header">
        <span>New Message</span>
        <div>
          <button onClick={() => setShowCcBcc(!showCcBcc)}>Cc Bcc</button>
          <FaWindowMinimize className="icon" />
          <FaExpand className="icon" />
          <FaTimes className="icon" />
        </div>
      </div>
      
      <input type="email" placeholder="To" value={to} onChange={(e) => setTo(e.target.value)} />
      {showCcBcc && (
        <div>
          <input type="email" placeholder="Cc" />
          <input type="email" placeholder="Bcc" />
        </div>
      )}
      <input type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
      <textarea placeholder="Message" value={body} onChange={(e) => setBody(e.target.value)} />
      
      <div className="compose-footer">
        <button className="send-btn" onClick={handleSend}>Send</button>
        <FaPaperclip className="icon" />
        <FaSmile className="icon" />
        <FaBold className="icon" />
        <FaItalic className="icon" />
        <FaTrash className="icon" />
        <FaEllipsisV className="icon" />
      </div>
    </div>
  );
};

export default Compose;
