import React, { useState } from 'react';
import { Mic, MicOff, Check } from 'lucide-react';
import { speechService } from '../utils/speech';

export default function VoiceInputButton({ 
  onTranscript, 
  lang = 'en', 
  className = '',
  quickSuggestions = [] 
}) {
  const [isListening, setIsListening] = useState(false);
  const [showHelper, setShowHelper] = useState(false);

  const handleToggleListen = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isListening) {
      setIsListening(false);
      return;
    }

    const stop = speechService.listen({
      lang: lang,
      onStart: () => {
        setIsListening(true);
      },
      onResult: (text) => {
        if (onTranscript && text) {
          onTranscript(text);
        }
      },
      onError: (err) => {
        setIsListening(false);
        // If network or permission error, show quick suggestions helper if available
        if (quickSuggestions.length > 0) {
          setShowHelper(true);
          setTimeout(() => setShowHelper(false), 5000);
        }
      },
      onEnd: () => {
        setIsListening(false);
      }
    });

    if (!stop && !speechService.isSupported) {
      if (quickSuggestions.length > 0) {
        setShowHelper(true);
      }
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={handleToggleListen}
        className={`p-1.5 rounded-full transition-all duration-150 flex items-center justify-center shrink-0 ${
          isListening
            ? 'bg-red-600 text-white animate-pulse shadow-md ring-2 ring-red-400'
            : 'text-slate-500 hover:text-farm-700 hover:bg-slate-100 active:scale-95'
        } ${className}`}
        title={isListening ? 'Listening... tap to stop' : 'Tap to speak'}
      >
        {isListening ? (
          <MicOff className="w-4 h-4 text-white" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
      </button>

      {/* Listening status indicator (No annoying error popups) */}
      {isListening && (
        <div className="absolute right-0 bottom-full mb-1.5 z-50 whitespace-nowrap bg-slate-900 text-white text-[11px] px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          <span>Listening...</span>
        </div>
      )}

      {/* Quick suggestions if mic is restricted */}
      {showHelper && quickSuggestions.length > 0 && (
        <div className="absolute right-0 top-full mt-1 z-50 bg-white border border-slate-200 rounded-xl shadow-xl p-2 flex flex-wrap gap-1 w-48">
          <span className="text-[10px] text-slate-400 font-bold block w-full mb-1">Quick Select:</span>
          {quickSuggestions.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onTranscript(s);
                setShowHelper(false);
              }}
              className="text-[11px] px-2 py-0.5 bg-slate-100 hover:bg-farm-100 text-slate-800 rounded-md font-medium"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
