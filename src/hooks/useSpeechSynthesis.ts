import { useState, useEffect } from 'react';

export const useSpeechSynthesis = () => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      const japaneseVoices = availableVoices.filter(voice => voice.lang.startsWith('ja'));
      setVoices(japaneseVoices);
      
      if (japaneseVoices.length > 0 && !selectedVoice) {
        const savedVoice = localStorage.getItem('selectedVoice');
        const voice = savedVoice 
          ? japaneseVoices.find(v => v.name === savedVoice) || japaneseVoices[0]
          : japaneseVoices[0];
        setSelectedVoice(voice);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = (text: string, rate = 1.0, pitch = 1.0) => {
    if (!selectedVoice) return;

    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.lang = 'ja-JP';

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  const selectVoice = (voice: SpeechSynthesisVoice) => {
    setSelectedVoice(voice);
    localStorage.setItem('selectedVoice', voice.name);
  };

  return { voices, selectedVoice, speaking, speak, stop, selectVoice };
};
