// src/hooks/useTextToSpeech.js
import { useState } from 'react';
import textToSpeech from '@google-cloud/text-to-speech';
import fs from 'fs';
import util from 'util';

const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const client = new textToSpeech.TextToSpeechClient({
    keyFilename: 'src/firebase/service-account-key.json',
  });

  const speak = async (text) => {
    setIsSpeaking(true);
    try {
      const [response] = await client.synthesizeSpeech({
        input: { text },
        voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
        audioConfig: { audioEncoding: 'MP3' },
      });
      
      const audio = new Audio(`data:audio/mp3;base64,${response.audioContent}`);
      audio.play();
    } catch (error) {
      console.error('Google TTS Error:', error);
    } finally {
      setIsSpeaking(false);
    }
  };

  return { speak, isSpeaking };
};

export default useTextToSpeech;