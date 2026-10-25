import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, Play, Pause, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { PrimitiveState } from '../../types/primitive';
import { sfx } from '../../sound/sfx';

export interface ReadProps {
  sentence: string;
  words?: string[];
  illustration?: string;
  onComplete?: () => void;
  onAudioStateChange?: (isPlaying: boolean) => void;
}

export const Read: React.FC<ReadProps> = ({
  sentence,
  words: wordsProp,
  illustration,
  onComplete,
  onAudioStateChange,
}) => {
  const [state, setState] = useState<PrimitiveState>('IDLE');
  const [activeWordIndex, setActiveWordIndex] = useState<number>(-1);
  const words = wordsProp || sentence.split(/\s+/);
  const intervalRef = useRef<number | null>(null);

  const startReadAlong = useCallback(() => {
    setState('PROMPTING');
    setActiveWordIndex(0);
    onAudioStateChange?.(true);

    sfx.speakPrompt(sentence, () => {
      onAudioStateChange?.(false);
      setState('AWAITING_INTERACTION');
      setActiveWordIndex(-1);
    });

    // Approximate synchronized word highlighting
    if (intervalRef.current) clearInterval(intervalRef.current);
    const msPerWord = 480;
    let idx = 0;
    intervalRef.current = window.setInterval(() => {
      idx++;
      if (idx < words.length) {
        setActiveWordIndex(idx);
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, msPerWord);
  }, [sentence, words.length, onAudioStateChange]);

  useEffect(() => {
    const timer = setTimeout(() => {
      startReadAlong();
    }, 400);
    return () => {
      clearTimeout(timer);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startReadAlong]);

  const handleFinish = () => {
    setState('FEEDBACK');
    sfx.playCorrectChime();
    setTimeout(() => {
      setState('COMPLETE');
      onComplete?.();
    }, 500);
  };

  return (
    <div className="w-full max-w-2xl flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-white rounded-3xl p-8 shadow-xl border-4 border-indigo-200 flex flex-col items-center relative overflow-hidden"
      >
        <div className="absolute top-4 right-4 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          Read Along
        </div>

        {illustration && (
          <div className="text-8xl my-3 select-none drop-shadow-sm">
            {illustration}
          </div>
        )}

        {/* Highlighted Word-by-Word Sentence View */}
        <div className="my-6 p-6 bg-slate-50 border-2 border-indigo-100 rounded-3xl w-full flex flex-wrap items-center justify-center gap-2 md:gap-3">
          {words.map((word, index) => {
            const isHighlighted = activeWordIndex === index;
            return (
              <motion.span
                key={index}
                animate={isHighlighted ? { scale: 1.15, y: -4 } : { scale: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => {
                  sfx.speakPrompt(word);
                  setActiveWordIndex(index);
                  setTimeout(() => setActiveWordIndex(-1), 600);
                }}
                className={`text-2xl md:text-3xl font-bold px-3 py-1.5 rounded-2xl cursor-pointer transition-all ${
                  isHighlighted
                    ? 'bg-amber-400 text-slate-900 shadow-md shadow-amber-200'
                    : 'text-slate-700 hover:bg-indigo-100 hover:text-indigo-900'
                }`}
              >
                {word}
              </motion.span>
            );
          })}
        </div>

        <p className="text-xs text-slate-400 mb-6 font-semibold">
          💡 Tap any word to hear it pronounced
        </p>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startReadAlong}
            className="bg-amber-400 hover:bg-amber-500 text-white font-bold px-6 py-3 rounded-2xl shadow-md flex items-center gap-2 cursor-pointer transition"
          >
            <Volume2 className="w-6 h-6" />
            <span>Read Together Again</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleFinish}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-7 py-3 rounded-2xl shadow-md flex items-center gap-2 cursor-pointer transition"
          >
            <CheckCircle2 className="w-6 h-6" />
            <span>I Can Read This!</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
