import { useState, useEffect, useCallback, useRef } from 'react';

const useVoiceRecognition = (autoRestart = false) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false; // Get only final results
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      recognitionRef.current.onresult = (event) => {
        const current = event.resultIndex;
        const result = event.results[current][0].transcript.trim();
        console.log('Speech detected:', result);

        setTranscript((prev) => prev + " " + result); // Append transcript instead of replacing

        // Example: Handle commands
        if (result.toLowerCase() === "dark mode") {
          document.body.classList.add("dark");
        } else if (result.toLowerCase() === "light mode") {
          document.body.classList.remove("dark");
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setError(event.error);

        if (event.error !== 'no-speech') {
          setIsListening(false);
        }
      };

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);

        if (autoRestart && recognitionRef.current) {
          console.log('Auto-restarting speech recognition');
          setTimeout(() => {
            try {
              recognitionRef.current.start();
            } catch (e) {
              console.error('Error restarting recognition:', e);
            }
          }, 500);
        }
      };

    } else {
      setError('Speech recognition not supported in this browser');
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error("Error during cleanup:", e);
        }
      }
    };
  }, [autoRestart]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setError('Speech recognition not supported in this browser');
      return;
    }

    if (isListening) {
      console.log('Already listening, no need to start again');
      return;
    }

    try {
      console.log('Starting speech recognition');
      recognitionRef.current.start();
      setTranscript('');
    } catch (error) {
      console.error('Error starting recognition:', error);

      if (error.name === 'InvalidStateError') {
        setIsListening(true);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      console.log('Stopping speech recognition');
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error('Error stopping recognition:', e);
      }
      setIsListening(false);
    }
  }, [isListening]);

  const clearTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    clearTranscript
  };
};

export default useVoiceRecognition;
