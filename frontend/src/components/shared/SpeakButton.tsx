import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface Props {
  text: string;
  lang: 'en' | 'hi';
}

export const SpeakButton = ({ text, lang }: Props) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  if (!isSupported) return null;

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    const synth = window.speechSynthesis;

    if (isSpeaking) {
      synth.cancel();
      setIsSpeaking(false);
    } else {
      synth.cancel();
      
      const locale = lang === 'hi' ? 'hi-IN' : 'en-IN';
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = locale;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      setIsSpeaking(true);
      synth.speak(utterance);
    }
  };

  return (
    <button
      onClick={handleSpeak}
      className="p-1 rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition-colors focus:outline-none focus:ring-1 focus:ring-primary shrink-0"
      title={isSpeaking ? 'Stop speech' : 'Listen to text'}
    >
      {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
    </button>
  );
};
