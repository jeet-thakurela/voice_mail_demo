import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Custom hook for text-to-speech functionality
 * @returns {Object} Text-to-speech methods and state
 */
const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState(null);
  const [voices, setVoices] = useState([]);
  const [currentVoice, setCurrentVoice] = useState(null);
  
  // Track utterance with a ref
  const utteranceRef = useRef(null);
  
  // Check if browser supports speech synthesis
  const browserSupportsSpeechSynthesis = useCallback(() => {
    return 'speechSynthesis' in window;
  }, []);
  
  // Initialize and load available voices
  useEffect(() => {
    if (!browserSupportsSpeechSynthesis()) {
      setError('Your browser does not support speech synthesis.');
      return;
    }
    
    // Function to load and set voices
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        
        // Set default voice - prefer English voices
        const englishVoice = availableVoices.find(
          voice => voice.lang.includes('en-US') && voice.localService
        ) || availableVoices[0];
        
        setCurrentVoice(englishVoice);
      }
    };
    
    // Chrome loads voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    }
    
    
    loadVoices();
    
    // Cleanup on unmount
    return () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  
  // Speak text
  const speak = useCallback((text, options = {}) => {
    if (!browserSupportsSpeechSynthesis() || !text) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Create a new utterance
    utteranceRef.current = new SpeechSynthesisUtterance(text);
    
    // Set voice if available
    if (currentVoice) {
      utteranceRef.current.voice = currentVoice;
    }
    
    // Set options
    utteranceRef.current.rate = options.rate || 1;
    utteranceRef.current.pitch = options.pitch || 1;
    utteranceRef.current.volume = options.volume || 1;
    
    // Set event handlers
    utteranceRef.current.onstart = () => setIsSpeaking(true);
    utteranceRef.current.onend = () => setIsSpeaking(false);
    utteranceRef.current.onerror = (event) => {
      console.error('Speech synthesis error', event);
      setError(`Speech synthesis error: ${event.error}`);
      setIsSpeaking(false);
    };
    
    // Speak
    window.speechSynthesis.speak(utteranceRef.current);
  }, [currentVoice]);
  
  // Stop speaking
  const stop = useCallback(() => {
    if (!browserSupportsSpeechSynthesis()) return;
    
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);
  
  // Pause speaking
  const pause = useCallback(() => {
    if (!browserSupportsSpeechSynthesis() || !isSpeaking) return;
    
    window.speechSynthesis.pause();
    setIsPaused(true);
  }, [isSpeaking]);
  
  // Resume speaking
  const resume = useCallback(() => {
    if (!browserSupportsSpeechSynthesis() || !isPaused) return;
    
    window.speechSynthesis.resume();
    setIsPaused(false);
  }, [isPaused]);
  
  // Change voice
  const changeVoice = useCallback((voice) => {
    setCurrentVoice(voice);
  }, []);
  
  return {
    isSpeaking,
    isPaused,
    error,
    voices,
    currentVoice,
    speak,
    stop,
    pause,
    resume,
    changeVoice,
    browserSupportsSpeechSynthesis: browserSupportsSpeechSynthesis()
  };
};

export default useTextToSpeech;