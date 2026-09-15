// Robust Speech Recognition Service for Multilingual Agricultural Inputs

export class SpeechInputService {
  constructor() {
    this.recognition = null;
    this.isSupported = false;

    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          this.recognition = new SpeechRecognition();
          this.recognition.continuous = false;
          this.recognition.interimResults = true; // Show interim text as user speaks!
          this.recognition.maxAlternatives = 1;
          this.isSupported = true;
        } catch (e) {
          console.warn('SpeechRecognition init error:', e);
        }
      }
    }
  }

  listen({ onResult, onError, onStart, onEnd, lang = 'en-IN' }) {
    if (!this.isSupported || !this.recognition) {
      if (onError) onError('unsupported');
      return null;
    }

    try {
      // Map language codes
      const langMap = {
        en: 'en-IN',
        te: 'te-IN',
        hi: 'hi-IN'
      };
      this.recognition.lang = langMap[lang] || lang || 'en-IN';

      let finalResult = '';

      this.recognition.onstart = () => {
        if (onStart) onStart();
      };

      this.recognition.onresult = (event) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalResult += item[0].transcript;
          } else {
            interim += item[0].transcript;
          }
        }
        const text = (finalResult || interim).trim();
        if (onResult && text) {
          onResult(text);
        }
      };

      this.recognition.onerror = (event) => {
        // Silently log; never throw annoying popups to the user
        console.warn('Speech recognition status:', event.error);
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
      console.warn('Speech start caught:', err);
      if (onError) onError(err.message);
      return null;
    }
  }
}

export const speechService = new SpeechInputService();
