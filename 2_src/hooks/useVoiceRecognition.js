// Updated useVoiceRecognition.js
import { useState, useRef, useCallback } from 'react';

const useVoiceRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const processAudio = async (audioBlob) => {
    const audioData = await audioBlob.arrayBuffer();
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioData)));

    try {
      const response = await fetch(
        `https://speech.googleapis.com/v1/speech:recognize?key=${import.meta.env.VITE_GOOGLE_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audio: {
              content: base64Audio
            },
            config: {
              encoding: 'WEBM_OPUS',
              sampleRateHertz: 16000,
              languageCode: 'en-US'
            }
          })
        }
      );

      const data = await response.json();
      if (data.results?.[0]?.alternatives?.[0]?.transcript) {
        setTranscript(data.results[0].alternatives[0].transcript);
      }
    } catch (err) {
      setError('Speech recognition failed');
      console.error(err);
    }
  };

  // ... (keep existing startListening/stopListening implementations)
};