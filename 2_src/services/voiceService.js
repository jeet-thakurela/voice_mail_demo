// src/services/voiceService.js
import { COMMANDS } from '../utils/voiceCommands';

class VoiceService {
  constructor(textToSpeech, voiceRecognition) {
    this.tts = textToSpeech;
    this.stt = voiceRecognition;
  }

  // ... (keep existing methods like announceEmailList, etc.)

  processVoiceCommand = async (command) => {
    const response = await fetch('https://speech.googleapis.com/v1/speech:recognize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GOOGLE_API_KEY}`,
      },
      body: JSON.stringify({
        audio: { content: command.audio },
        config: {
          encoding: 'WEBM_OPUS',
          sampleRateHertz: 16000,
          languageCode: 'en-US',
        },
      }),
    });
    return response.json();
  };
}

export default VoiceService;