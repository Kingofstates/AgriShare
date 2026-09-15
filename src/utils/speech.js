// Speech Recognition Utility using Web Speech API

export class SpeechInputService {
  constructor() {
    this.recognition = null;
    this.isSupported = false;

    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-IN'; // Default to Indian English, can also adapt to Telugu / Hindi
        this.isSupported = true;
      }
    }
  }

  listen({ onResult, onError, onStart, onEnd, lang = 'en-IN' }) {
    if (!this.isSupported) {
      if (onError) onError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return null;
    }

    try {
      this.recognition.lang = lang;

      this.recognition.onstart = () => {
        if (onStart) onStart();
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (onResult) onResult(transcript);
      };

      this.recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        if (onError) onError(event.error);
      };

      this.recognition.onend = () => {
        if (onEnd) onEnd();
      };

      this.recognition.start();

      return () => {
        try {
          this.recognition.stop();
        } catch {
          // ignore
        }
      };
    } catch (err) {
      console.error('Speech recognition exception:', err);
      if (onError) onError(err.message);
      return null;
    }
  }
}

export const speechService = new SpeechInputService();
