import React, { useState, useRef, useCallback } from 'react';
import { Sparkles, CheckCircle, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ListenAndFindProps, PrimitiveState, ChoiceItem } from '../../types/primitive';
import { sfx } from '../../sound/sfx';
import { ReadAloudCaption } from '../../components/common';

export const ListenAndFind: React.FC<ListenAndFindProps> = ({
  promptAudio,
  textCaption,
  choices,
  correctChoiceId,
  onCorrect,
  onIncorrect,
  onComplete,
  onAudioStateChange,
}) => {
  const [state, setState] = useState<PrimitiveState>('IDLE');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [disabledChoiceIds, setDisabledChoiceIds] = useState<Set<string>>(new Set());
  const [attemptsCount, setAttemptsCount] = useState<number>(0);
  const startTimeRef = useRef<number>(Date.now());

  const handleSelect = (choice: ChoiceItem) => {
    if (state === 'FEEDBACK' || state === 'COMPLETE' || disabledChoiceIds.has(choice.id)) {
      return;
    }

    const currentAttempt = attemptsCount + 1;
    setAttemptsCount(currentAttempt);
    setSelectedId(choice.id);
    setState('EVALUATING');

    const isMatch = choice.id === correctChoiceId;

    if (isMatch) {
      setState('FEEDBACK');
      sfx.playCorrectChime();

      onCorrect?.({
        selectedId: choice.id,
        targetId: correctChoiceId,
        isCorrect: true,
        timestamp: Date.now(),
        attemptNumber: currentAttempt,
      });

      // Celebration transition to complete
      setTimeout(() => {
        setState('COMPLETE');
        onComplete?.({
          status: 'success',
          totalAttempts: currentAttempt,
          timeSpentMs: Date.now() - startTimeRef.current,
        });
      }, 1200);
    } else {
      setState('FEEDBACK');
      sfx.playIncorrectBoing();

      onIncorrect?.({
        selectedId: choice.id,
        targetId: correctChoiceId,
        isCorrect: false,
        timestamp: Date.now(),
        attemptNumber: currentAttempt,
      });

      // Gentle wobble recovery: dim the choice and allow retry
      setTimeout(() => {
        setDisabledChoiceIds((prev) => new Set([...prev, choice.id]));
        setSelectedId(null);
        setState('AWAITING_INTERACTION');
      }, 700);
    }
  };

  const handleReset = useCallback(() => {
    setDisabledChoiceIds(new Set());
    setSelectedId(null);
    setAttemptsCount(0);
    setState('IDLE');
  }, []);

  return (
    <div className="w-full max-w-3xl flex flex-col items-center">
      {/* Integrated ReadAloudCaption Header Layer */}
      <div className="w-full bg-white rounded-3xl p-6 shadow-xl border-4 border-indigo-200 mb-8">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs text-indigo-500 font-extrabold uppercase tracking-wider">
            Listen & Find
          </span>
          <div className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold border border-indigo-200 uppercase tracking-wide">
            {state === 'IDLE' ? 'Awaiting Choice' : state.replace('_', ' ')}
          </div>
        </div>

        {/* ReadAloudCaption with synchronized word highlighting & on-demand audio */}
        <ReadAloudCaption
          sentence={textCaption}
          audioSource={promptAudio}
          size="md"
          autoplay={true}
          autoplayDelayMs={300}
          onAudioStateChange={onAudioStateChange}
          onComplete={() => setState('AWAITING_INTERACTION')}
        />
      </div>

      {/* Visual Layer: Interactive Choice Targets Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full">
        {choices.map((choice) => {
          const isSelected = selectedId === choice.id;
          const isCorrect = choice.id === correctChoiceId;
          const isDisabled = disabledChoiceIds.has(choice.id);

          return (
            <motion.button
              key={choice.id}
              onClick={() => handleSelect(choice)}
              disabled={isDisabled || state === 'COMPLETE'}
              whileHover={!isDisabled && state !== 'COMPLETE' ? { scale: 1.04, y: -4 } : {}}
              whileTap={!isDisabled && state !== 'COMPLETE' ? { scale: 0.96 } : {}}
              animate={
                isSelected && isCorrect
                  ? { scale: [1, 1.15, 1.1], rotate: [0, 4, -4, 0] }
                  : isSelected && !isMatchShake(isSelected, isCorrect)
                  ? { x: [0, -12, 10, -8, 6, -3, 0] }
                  : {}
              }
              transition={{ duration: 0.5 }}
              className={`relative rounded-3xl p-6 shadow-md border-4 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
                isDisabled
                  ? 'bg-slate-100 border-slate-200 opacity-40 cursor-not-allowed'
                  : isSelected && isCorrect
                  ? 'bg-emerald-50 border-emerald-500 shadow-emerald-200 shadow-xl'
                  : isSelected && !isCorrect
                  ? 'bg-rose-50 border-rose-400'
                  : 'bg-white border-slate-100 hover:border-amber-300'
              }`}
            >
              {/* Asset Display (Emoji or Image) */}
              <div className="w-24 h-24 flex items-center justify-center text-7xl mb-2 select-none">
                {choice.assetUrl ? (
                  <img src={choice.assetUrl} alt={choice.altText} className="max-h-full max-w-full object-contain" />
                ) : (
                  <span>{choice.emoji}</span>
                )}
              </div>

              {/* Label */}
              <span className="text-lg font-bold text-slate-700">
                {choice.label}
              </span>

              {/* Celebration overlay */}
              {isSelected && isCorrect && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-3 -right-3 bg-emerald-500 text-white rounded-full p-1.5 shadow-lg"
                >
                  <CheckCircle className="w-6 h-6" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Complete / Advance Card */}
      <AnimatePresence>
        {state === 'COMPLETE' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mt-8 bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-2xl border-4 border-emerald-400 flex flex-col items-center text-center w-full"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
              <Sparkles className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-bold text-emerald-700 mb-1">Fantastic Job!</h3>
            <p className="text-slate-600 mb-4 font-medium">You listened carefully and found the right match!</p>
            <button
              onClick={handleReset}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-full flex items-center gap-2 shadow-lg transition active:scale-95 cursor-pointer"
            >
              <RefreshCcw className="w-5 h-5" />
              Play Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function isMatchShake(isSelected: boolean, isCorrect: boolean): boolean {
  return !isSelected || isCorrect;
}
