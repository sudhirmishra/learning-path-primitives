import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
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
  const [activeWordIndex, setActiveWordIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const words = wordsProp || sentence.split(/\s+/);
  const fallbackTimerRef = useRef<number | null>(null);

  // Compute character ranges for each word to match speech boundary events
  const wordRanges = useRef<Array<{ start: number; end: number }>>([]);
  useEffect(() => {
    let currentPos = 0;
    wordRanges.current = words.map((w) => {
      const start = sentence.indexOf(w, currentPos);
      currentPos = start + w.length;
      return { start, end: currentPos };
    });
  }, [sentence, words]);

  const stopPlayback = useCallback(() => {
    sfx.stopVoice();
    setIsPlaying(false);
    setActiveWordIndex(-1);
    onAudioStateChange?.(false);
    if (fallbackTimerRef.current) {
      clearInterval(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
  }, [onAudioStateChange]);

  const startReadAlong = useCallback(() => {
    stopPlayback();
    setIsPlaying(true);
    setActiveWordIndex(0);
    onAudioStateChange?.(true);

    let hasReceivedBoundary = false;

    // Use speech boundary events for true synchronized voice reading
    sfx.speakPrompt(
      sentence,
      () => {
        setIsPlaying(false);
        setActiveWordIndex(-1);
        onAudioStateChange?.(false);
        if (fallbackTimerRef.current) clearInterval(fallbackTimerRef.current);
      },
      (charIndex) => {
        hasReceivedBoundary = true;
        // Find which word matches this character index
        const matchIdx = wordRanges.current.findIndex(
          (r) => charIndex >= r.start && charIndex <= r.end
        );
        if (matchIdx !== -1) {
          setActiveWordIndex(matchIdx);
        }
      }
    );

    // Fallback timer only if browser does not emit boundary events
    let fallbackIdx = 0;
    fallbackTimerRef.current = window.setInterval(() => {
      if (hasReceivedBoundary) {
        if (fallbackTimerRef.current) clearInterval(fallbackTimerRef.current);
        return;
      }
      fallbackIdx++;
      if (fallbackIdx < words.length) {
        setActiveWordIndex(fallbackIdx);
      } else {
        if (fallbackTimerRef.current) clearInterval(fallbackTimerRef.current);
      }
    }, 450);
  }, [sentence, words.length, onAudioStateChange, stopPlayback]);

  // Autoplay on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      startReadAlong();
    }, 400);
    return () => {
      clearTimeout(timer);
      stopPlayback();
    };
  }, [startReadAlong, stopPlayback]);

  const handleWordTap = (word: string, index: number) => {
    stopPlayback();
    setActiveWordIndex(index);
    sfx.speakPrompt(word, () => {
      setTimeout(() => setActiveWordIndex(-1), 400);
    });
  };

  const handleFinish = () => {
    stopPlayback();
    sfx.playCorrectChime();
    setTimeout(() => {
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
                transition={{ duration: 0.15 }}
                onClick={() => handleWordTap(word, index)}
                className={`text-2xl md:text-3xl font-bold px-3 py-1.5 rounded-2xl cursor-pointer transition-all ${
                  isHighlighted
                    ? 'bg-amber-400 text-slate-900 shadow-lg shadow-amber-200 ring-4 ring-amber-200'
                    : 'text-slate-700 hover:bg-indigo-100 hover:text-indigo-900'
                }`}
              >
                {word}
              </motion.span>
            );
          })}
        </div>

        <p className="text-xs text-slate-400 mb-6 font-semibold">
          💡 Tap any word to hear it pronounced individually
        </p>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={isPlaying ? { scale: [1, 1.06, 1] } : {}}
            transition={isPlaying ? { repeat: Infinity, duration: 1.2 } : {}}
            onClick={startReadAlong}
            className="bg-amber-400 hover:bg-amber-500 text-white font-bold px-6 py-3 rounded-2xl shadow-md flex items-center gap-2 cursor-pointer transition"
          >
            <Volume2 className="w-6 h-6" />
            <span>{isPlaying ? 'Reading Together...' : 'Read Together Again'}</span>
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
