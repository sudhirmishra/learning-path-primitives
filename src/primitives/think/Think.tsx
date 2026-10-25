import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { sfx } from '../../sound/sfx';
import { ReadAloudCaption } from '../../components/common';

export interface ThinkOption {
  id: string;
  emoji: string;
  label: string;
}

export interface ThinkProps {
  /** The question or problem prompt displayed in ReadAloudCaption */
  promptText?: string;
  /** Optional audio URL or custom speech text for the prompt */
  promptAudio?: string;
  /**
   * Optional pattern sequence.
   * If provided and non-empty, renders the visual pattern clue box with the missing slot ('?').
   * If omitted or empty, Think operates in clean Direct Question / Riddle mode!
   */
  patternSequence?: Array<{ emoji: string; label: string }>;
  /** Multiple-choice options (can be 2, 3, 4, etc.) */
  options: ThinkOption[];
  /** Correct choice ID */
  correctOptionId: string;
  /** Lifecycle callbacks */
  onComplete?: () => void;
  onAudioStateChange?: (isPlaying: boolean) => void;
}

export const Think: React.FC<ThinkProps> = ({
  promptText = "What comes next in the pattern?",
  promptAudio,
  patternSequence,
  options,
  correctOptionId,
  onComplete,
  onAudioStateChange,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const hasPattern = patternSequence && patternSequence.length > 0;

  // Tap an item in the pattern sequence to speak its name
  const handleItemTap = (item: { emoji: string; label: string }) => {
    sfx.speakPrompt(item.label);
  };

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
      {/* Question Header using ReadAloudCaption */}
      <div className="w-full bg-white rounded-3xl p-6 shadow-xl border-4 border-purple-200 mb-8">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs text-purple-600 font-extrabold uppercase tracking-wider">
            {hasPattern ? 'Pattern & Logic Quest' : 'Think & Choose Quest'}
          </span>
          <div className="bg-purple-100 text-purple-700 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Think
          </div>
        </div>

        <ReadAloudCaption
          sentence={promptText}
          audioSource={promptAudio}
          size="md"
          autoplay={true}
          autoplayDelayMs={300}
          onAudioStateChange={onAudioStateChange}
        />
      </div>

      {/* Pattern Sequence Box: Only rendered if patternSequence is provided and non-empty */}
      {hasPattern && (
        <div className="w-full bg-white rounded-3xl p-8 shadow-lg border-4 border-slate-100 mb-8 flex flex-col items-center">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {patternSequence.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleItemTap(item)}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-slate-50 border-2 border-slate-200 flex flex-col items-center justify-center text-4xl md:text-5xl shadow-sm cursor-pointer hover:border-purple-300"
                title={`Tap to hear "${item.label}"`}
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

          <p className="text-xs text-slate-400 mt-4 font-semibold">
            💡 Tap any clue to hear its name in the pattern
          </p>
        </div>
      )}

      {/* Choice Options */}
      <span className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider">
        {hasPattern ? 'Choose the missing piece:' : 'Choose your answer:'}
      </span>
      <div
        className={`grid gap-6 w-full ${
          options.length === 2
            ? 'grid-cols-2 max-w-md'
            : options.length === 3
            ? 'grid-cols-3 max-w-lg'
            : 'grid-cols-2 sm:grid-cols-4 max-w-xl'
        }`}
      >
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
                  ? 'bg-emerald-50 border-emerald-500 ring-4 ring-emerald-200'
                  : isSelected && isCorrect === false
                  ? 'bg-rose-50 border-rose-400'
                  : 'bg-white border-slate-100 hover:border-purple-300'
              }`}
            >
              <span className="text-6xl md:text-7xl mb-3 select-none">{opt.emoji}</span>
              <span className="text-base md:text-lg font-bold text-slate-700">{opt.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
