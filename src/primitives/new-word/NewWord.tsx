import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { PrimitiveState } from '../../types/primitive';
import { sfx } from '../../sound/sfx';

export interface NewWordProps {
  word: string;
  pronunciationAudio?: string;
  phonetics?: string;
  visualAsset: {
    emoji?: string;
    assetUrl?: string;
    altText: string;
  };
  funFact?: string;
  onComplete?: () => void;
  onAudioStateChange?: (isPlaying: boolean) => void;
}

export const NewWord: React.FC<NewWordProps> = ({
  word,
  phonetics,
  visualAsset,
  funFact,
  onComplete,
  onAudioStateChange,
}) => {
  const [state, setState] = useState<PrimitiveState>('IDLE');
  const [hasTappedHear, setHasTappedHear] = useState(false);
  const hasMountedRef = useRef(false);

  const speakWord = useCallback(() => {
    setState('PROMPTING');
    onAudioStateChange?.(true);
    sfx.speakPrompt(word, () => {
      onAudioStateChange?.(false);
      setState('AWAITING_INTERACTION');
      setHasTappedHear(true);
    });
  }, [word, onAudioStateChange]);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      const timer = setTimeout(() => {
        speakWord();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [speakWord]);

  const handleFinish = () => {
    setState('FEEDBACK');
    sfx.playCorrectChime();
    setTimeout(() => {
      setState('COMPLETE');
      onComplete?.();
    }, 600);
  };

  return (
    <div className="w-full max-w-2xl flex flex-col items-center">
      {/* Visual Object Card */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="w-full bg-white rounded-3xl p-8 shadow-xl border-4 border-amber-200 flex flex-col items-center relative overflow-hidden"
      >
        <div className="absolute top-4 right-4 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          New Word
        </div>

        {/* Object Illustration / Emoji */}
        <motion.div
          animate={state === 'PROMPTING' ? { scale: [1, 1.12, 1], rotate: [0, -3, 3, 0] } : {}}
          transition={{ duration: 1.2, repeat: state === 'PROMPTING' ? Infinity : 0 }}
          className="w-44 h-44 flex items-center justify-center text-9xl my-4 select-none drop-shadow-md cursor-pointer"
          onClick={speakWord}
        >
          {visualAsset.assetUrl ? (
            <img src={visualAsset.assetUrl} alt={visualAsset.altText} className="max-h-full max-w-full object-contain" />
          ) : (
            <span>{visualAsset.emoji}</span>
          )}
        </motion.div>

        {/* Written Word Label */}
        <div className="text-center mb-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-wide">
            {word}
          </h1>
          {phonetics && (
            <p className="text-sm font-semibold text-indigo-500 tracking-widest mt-1">
              /{phonetics}/
            </p>
          )}
        </div>

        {/* Fun Fact / Description text */}
        {funFact && (
          <p className="text-slate-600 bg-sky-50 border border-sky-100 rounded-2xl p-3 text-center text-sm md:text-base font-medium max-w-md mb-6">
            ✨ {funFact}
          </p>
        )}

        {/* Audio Action Button */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={speakWord}
            className="bg-amber-400 hover:bg-amber-500 text-white font-bold px-6 py-3 rounded-2xl shadow-md flex items-center gap-2 cursor-pointer transition"
          >
            <Volume2 className="w-6 h-6" />
            <span>Hear Again</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleFinish}
            disabled={!hasTappedHear && state === 'PROMPTING'}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-7 py-3 rounded-2xl shadow-md flex items-center gap-2 cursor-pointer transition"
          >
            <CheckCircle2 className="w-6 h-6" />
            <span>I Learned It!</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
