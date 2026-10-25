import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { PrimitiveState } from '../../types/primitive';
import { sfx } from '../../sound/sfx';

export interface OppositesPairItem {
  id: string;
  label: string;
  emoji: string;
  description: string;
}

export interface OppositesProps {
  conceptTitle: string; // e.g. "Big vs Small", "Hot vs Cold"
  leftItem: OppositesPairItem;
  rightItem: OppositesPairItem;
  promptQuestion?: string; // e.g. "Which one is HOT?"
  targetAnswerId?: string; // If interactive question mode is enabled
  onComplete?: () => void;
  onAudioStateChange?: (isPlaying: boolean) => void;
}

export const Opposites: React.FC<OppositesProps> = ({
  conceptTitle,
  leftItem,
  rightItem,
  promptQuestion = `Look at the opposites: ${leftItem.label} and ${rightItem.label}`,
  targetAnswerId,
  onComplete,
  onAudioStateChange,
}) => {
  const [state, setState] = useState<PrimitiveState>('IDLE');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const speakPrompt = () => {
    setState('PROMPTING');
    onAudioStateChange?.(true);
    sfx.speakPrompt(promptQuestion, () => {
      onAudioStateChange?.(false);
      setState('AWAITING_INTERACTION');
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      speakPrompt();
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleCardClick = (item: OppositesPairItem) => {
    sfx.speakPrompt(item.label);

    if (targetAnswerId) {
      if (item.id === targetAnswerId) {
        setSelectedId(item.id);
        setFeedback('correct');
        sfx.playCorrectChime();
        setState('COMPLETE');
        setTimeout(() => {
          onComplete?.();
        }, 1200);
      } else {
        setSelectedId(item.id);
        setFeedback('incorrect');
        sfx.playIncorrectBoing();
        setTimeout(() => {
          setSelectedId(null);
          setFeedback(null);
        }, 600);
      }
    } else {
      setSelectedId(item.id);
    }
  };

  return (
    <div className="w-full max-w-3xl flex flex-col items-center">
      {/* Header Prompt Card */}
      <div className="w-full bg-white rounded-3xl p-6 shadow-xl border-4 border-amber-200 flex flex-col md:flex-row items-center gap-5 mb-8">
        <button
          onClick={speakPrompt}
          className="bg-amber-400 hover:bg-amber-500 text-white p-4 rounded-2xl shadow-md transition flex items-center justify-center cursor-pointer"
          title="Hear prompt again"
        >
          <Volume2 className="w-8 h-8" />
        </button>

        <div className="flex-1 text-center md:text-left">
          <span className="text-xs text-amber-500 font-bold uppercase tracking-wider block mb-1">
            Opposites Concept
          </span>
          <h2 className="text-2xl md:text-3xl text-slate-800 font-bold tracking-wide">
            {promptQuestion}
          </h2>
        </div>

        <div className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-200 uppercase tracking-wide">
          {conceptTitle}
        </div>
      </div>

      {/* Side-by-side Contrast Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Left Item */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleCardClick(leftItem)}
          animate={
            selectedId === leftItem.id && feedback === 'incorrect'
              ? { x: [0, -12, 12, -8, 8, 0] }
              : selectedId === leftItem.id && feedback === 'correct'
              ? { scale: [1, 1.1, 1.05] }
              : {}
          }
          className={`bg-white rounded-3xl p-8 shadow-lg border-4 flex flex-col items-center justify-center cursor-pointer transition-all ${
            selectedId === leftItem.id && feedback === 'correct'
              ? 'border-emerald-500 bg-emerald-50'
              : selectedId === leftItem.id && feedback === 'incorrect'
              ? 'border-rose-400 bg-rose-50'
              : 'border-slate-100 hover:border-sky-300'
          }`}
        >
          <div className="text-9xl mb-4 select-none drop-shadow">
            {leftItem.emoji}
          </div>
          <h3 className="text-3xl font-extrabold text-slate-800 mb-1">{leftItem.label}</h3>
          <p className="text-sm text-slate-500 font-medium">{leftItem.description}</p>
        </motion.div>

        {/* Right Item */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleCardClick(rightItem)}
          animate={
            selectedId === rightItem.id && feedback === 'incorrect'
              ? { x: [0, -12, 12, -8, 8, 0] }
              : selectedId === rightItem.id && feedback === 'correct'
              ? { scale: [1, 1.1, 1.05] }
              : {}
          }
          className={`bg-white rounded-3xl p-8 shadow-lg border-4 flex flex-col items-center justify-center cursor-pointer transition-all ${
            selectedId === rightItem.id && feedback === 'correct'
              ? 'border-emerald-500 bg-emerald-50'
              : selectedId === rightItem.id && feedback === 'incorrect'
              ? 'border-rose-400 bg-rose-50'
              : 'border-slate-100 hover:border-amber-300'
          }`}
        >
          <div className="text-9xl mb-4 select-none drop-shadow">
            {rightItem.emoji}
          </div>
          <h3 className="text-3xl font-extrabold text-slate-800 mb-1">{rightItem.label}</h3>
          <p className="text-sm text-slate-500 font-medium">{rightItem.description}</p>
        </motion.div>
      </div>

      {/* Completion button if in exploratory mode */}
      {!targetAnswerId && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            sfx.playCorrectChime();
            onComplete?.();
          }}
          className="mt-8 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-3.5 rounded-full shadow-lg flex items-center gap-2 cursor-pointer transition text-lg"
        >
          <CheckCircle2 className="w-6 h-6" />
          <span>I Understand Opposites!</span>
        </motion.button>
      )}
    </div>
  );
};
