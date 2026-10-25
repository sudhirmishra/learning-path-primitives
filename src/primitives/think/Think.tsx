import React, { useState } from 'react';
import { Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { sfx } from '../../sound/sfx';

export interface ThinkOption {
  id: string;
  emoji: string;
  label: string;
}

export interface ThinkProps {
  promptText?: string;
  patternSequence: Array<{ emoji: string; label: string }>;
  options: ThinkOption[];
  correctOptionId: string;
  onComplete?: () => void;
}

export const Think: React.FC<ThinkProps> = ({
  promptText = "What comes next in the pattern?",
  patternSequence,
  options,
  correctOptionId,
  onComplete,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleSelect = (option: ThinkOption) => {
    sfx.speakPrompt(option.label);
    setSelectedOptionId(option.id);

    if (option.id === correctOptionId) {
      setIsCorrect(true);
      sfx.playCorrectChime();
      setTimeout(() => {
        onComplete?.();
      }, 1000);
    } else {
      setIsCorrect(false);
      sfx.playIncorrectBoing();
      setTimeout(() => {
        setSelectedOptionId(null);
        setIsCorrect(null);
      }, 600);
    }
  };

  return (
    <div className="w-full max-w-3xl flex flex-col items-center">
      {/* Question Header */}
      <div className="w-full bg-white rounded-3xl p-6 shadow-xl border-4 border-purple-200 flex items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs text-purple-600 font-bold uppercase tracking-wider block mb-1">
            Logic & Pattern Quest
          </span>
          <h2 className="text-2xl md:text-3xl text-slate-800 font-bold">
            {promptText}
          </h2>
        </div>
        <div className="bg-purple-100 text-purple-700 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          Think
        </div>
      </div>

      {/* Pattern Sequence Display */}
      <div className="w-full bg-white rounded-3xl p-8 shadow-lg border-4 border-slate-100 mb-8 flex flex-wrap items-center justify-center gap-4">
        {patternSequence.map((item, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-slate-50 border-2 border-slate-200 flex flex-col items-center justify-center text-4xl md:text-5xl shadow-sm"
          >
            <span>{item.emoji}</span>
          </motion.div>
        ))}

        {/* Missing Target Slot */}
        <motion.div
          animate={isCorrect ? { scale: [1, 1.15, 1] } : {}}
          className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl border-4 border-dashed flex flex-col items-center justify-center text-4xl md:text-5xl transition-all ${
            isCorrect
              ? 'border-emerald-500 bg-emerald-50 shadow-emerald-200 shadow-md'
              : 'border-purple-400 bg-purple-50 text-purple-600 animate-pulse'
          }`}
        >
          {isCorrect ? (
            <span>{options.find((o) => o.id === correctOptionId)?.emoji}</span>
          ) : (
            <span className="font-extrabold text-3xl">?</span>
          )}
        </motion.div>
      </div>

      {/* Choice Options */}
      <span className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider">
        Choose the missing piece:
      </span>
      <div className="grid grid-cols-3 gap-6 w-full max-w-lg">
        {options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          return (
            <motion.button
              key={opt.id}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => handleSelect(opt)}
              disabled={isCorrect === true}
              animate={
                isSelected && isCorrect === false
                  ? { x: [0, -10, 10, -6, 6, 0] }
                  : {}
              }
              className={`p-6 rounded-3xl shadow-lg border-4 flex flex-col items-center justify-center cursor-pointer transition-all ${
                isSelected && isCorrect
                  ? 'bg-emerald-50 border-emerald-500'
                  : isSelected && isCorrect === false
                  ? 'bg-rose-50 border-rose-400'
                  : 'bg-white border-slate-100 hover:border-purple-300'
              }`}
            >
              <span className="text-6xl mb-2">{opt.emoji}</span>
              <span className="text-base font-bold text-slate-700">{opt.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
