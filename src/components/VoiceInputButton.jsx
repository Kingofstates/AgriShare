import React, { useState } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { speechService } from '../utils/speech';

export default function VoiceInputButton({ onTranscript, placeholder = 'Speak now...', className = '', lang = 'en-IN' }) {
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleToggleListen = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isListening) {
      setIsListening(false);
      return;
    }

    setErrorMessage(null);

    const stop = speechService.listen({
      lang: lang,
      onStart: () => {
        setIsListening(true);
      },
      onResult: (text) => {
        setIsListening(false);
        if (onTranscript && text) {
          onTranscript(text);
        }
      },
      onError: (err) => {
        setIsListening(false);
        console.warn('Speech error:', err);
        setErrorMessage('Could not hear clearly. Try again!');
        setTimeout(() => setErrorMessage(null), 3000);
      },
      onEnd: () => {
        setIsListening(false);
      }
    });

    if (!stop && !speechService.isSupported) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={handleToggleListen}
        title={isListening ? 'Listening... click to stop' : 'Click to Speak (Voice-to-Text)'}
        className={`p-2 rounded-full transition-all duration-200 flex items-center justify-center ${
          isListening
            ? 'bg-red-600 text-white mic-active shadow-lg shadow-red-500/30 ring-2 ring-red-400'
            : 'bg-farm-50 text-farm-700 hover:bg-farm-100 active:scale-95 border border-farm-200'
        } ${className}`}
      >
        {isListening ? (
          <MicOff className="w-4 h-4 animate-bounce" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
      </button>

      {/* Listening popup pill */}
      {isListening && (
        <div className="absolute right-0 bottom-full mb-2 z-50 whitespace-nowrap bg-slate-900 text-white text-xs px-3 py-1.5 rounded-full shadow-xl flex items-center gap-1.5 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          <span>Listening... Speak now 🎙️</span>
        </div>
      )}

      {/* Error message popup */}
      {errorMessage && (
        <div className="absolute right-0 bottom-full mb-2 z-50 whitespace-nowrap bg-amber-800 text-white text-xs px-2.5 py-1 rounded shadow-lg">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
