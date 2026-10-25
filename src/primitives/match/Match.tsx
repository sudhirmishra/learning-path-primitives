import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { sfx } from '../../sound/sfx';
import { ReadAloudCaption } from '../../components/common';

export interface MatchPair {
  id: string;
  leftLabel: string;
  leftEmoji: string;
  rightLabel: string;
  rightEmoji: string;
}

export interface MatchProps {
  instruction?: string;
  promptAudio?: string;
  pairs: MatchPair[];
  onComplete?: () => void;
  onAudioStateChange?: (isPlaying: boolean) => void;
}

export const Match: React.FC<MatchProps> = ({
  instruction = "Tap an item on the left, then tap its match on the right!",
  promptAudio,
  pairs,
  onComplete,
  onAudioStateChange,
}) => {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [mismatch, setMismatch] = useState<boolean>(false);

  // Shuffle right items on mount so they aren't side-by-side
  const [shuffledRight] = useState(() => [...pairs].sort(() => Math.random() - 0.5));

  const handleLeftClick = (id: string) => {
    if (matchedIds.has(id)) return;
    setSelectedLeft(id);
    const item = pairs.find((p) => p.id === id);
    if (item) sfx.speakPrompt(item.leftLabel);

    if (selectedRight) {
      evaluatePair(id, selectedRight);
    }
  };

  const handleRightClick = (id: string) => {
    if (matchedIds.has(id)) return;
    setSelectedRight(id);
    const item = pairs.find((p) => p.id === id);
    if (item) sfx.speakPrompt(item.rightLabel);

    if (selectedLeft) {
      evaluatePair(selectedLeft, id);
    }
  };

  const evaluatePair = (leftId: string, rightId: string) => {
    if (leftId === rightId) {
      // Match found!
      sfx.playCorrectChime();
      const updated = new Set([...matchedIds, leftId]);
      setMatchedIds(updated);
      setSelectedLeft(null);
      setSelectedRight(null);

      if (updated.size === pairs.length) {
        setTimeout(() => {
          onComplete?.();
        }, 1000);
      }
    } else {
      // Mismatch
      sfx.playIncorrectBoing();
      setMismatch(true);
      setTimeout(() => {
        setMismatch(false);
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 500);
    }
  };

  const isAllComplete = matchedIds.size === pairs.length;

  return (
    <div className="w-full max-w-3xl flex flex-col items-center">
      {/* Header Banner using ReadAloudCaption */}
      <div className="w-full bg-white rounded-3xl p-6 shadow-xl border-4 border-emerald-200 mb-8">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs text-emerald-600 font-extrabold uppercase tracking-wider">
            Tap to Match
          </span>
          <div className="bg-emerald-50 text-emerald-700 px-3.5 py-1 rounded-full font-bold text-xs border border-emerald-200">
            Matched: {matchedIds.size} / {pairs.length}
          </div>
        </div>

        <ReadAloudCaption
          sentence={instruction}
          audioSource={promptAudio}
          size="md"
          autoplay={true}
          autoplayDelayMs={300}
          onAudioStateChange={onAudioStateChange}
        />
      </div>

      {/* Two Columns Grid */}
      <div className="grid grid-cols-2 gap-8 w-full">
        {/* Left Set */}
        <div className="flex flex-col gap-4">
          <span className="text-center font-bold text-slate-500 uppercase text-xs tracking-wider">
            Items
          </span>
          {pairs.map((pair) => {
            const isMatched = matchedIds.has(pair.id);
            const isSelected = selectedLeft === pair.id;

            return (
              <motion.button
                key={pair.id}
                whileHover={!isMatched ? { scale: 1.03 } : {}}
                whileTap={!isMatched ? { scale: 0.97 } : {}}
                onClick={() => handleLeftClick(pair.id)}
                disabled={isMatched}
                className={`p-5 rounded-3xl shadow-md border-4 flex items-center gap-4 transition-all duration-200 cursor-pointer ${
                  isMatched
                    ? 'bg-emerald-50 border-emerald-400 opacity-60 cursor-default'
                    : isSelected
                    ? mismatch
                      ? 'bg-rose-50 border-rose-400'
                      : 'bg-indigo-50 border-indigo-500 shadow-indigo-100 shadow-lg'
                    : 'bg-white border-slate-100 hover:border-indigo-300'
                }`}
              >
                <span className="text-5xl">{pair.leftEmoji}</span>
                <span className="text-xl font-bold text-slate-700">{pair.leftLabel}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Right Set */}
        <div className="flex flex-col gap-4">
          <span className="text-center font-bold text-slate-500 uppercase text-xs tracking-wider">
            Matches
          </span>
          {shuffledRight.map((pair) => {
            const isMatched = matchedIds.has(pair.id);
            const isSelected = selectedRight === pair.id;

            return (
              <motion.button
                key={pair.id}
                whileHover={!isMatched ? { scale: 1.03 } : {}}
                whileTap={!isMatched ? { scale: 0.97 } : {}}
                onClick={() => handleRightClick(pair.id)}
                disabled={isMatched}
                className={`p-5 rounded-3xl shadow-md border-4 flex items-center gap-4 transition-all duration-200 cursor-pointer ${
                  isMatched
                    ? 'bg-emerald-50 border-emerald-400 opacity-60 cursor-default'
                    : isSelected
                    ? mismatch
                      ? 'bg-rose-50 border-rose-400'
                      : 'bg-amber-50 border-amber-500 shadow-amber-100 shadow-lg'
                    : 'bg-white border-slate-100 hover:border-amber-300'
                }`}
              >
                <span className="text-5xl">{pair.rightEmoji}</span>
                <span className="text-xl font-bold text-slate-700">{pair.rightLabel}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Completion Banner */}
      {isAllComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-8 bg-white rounded-3xl p-6 shadow-xl border-4 border-emerald-400 text-center w-full"
        >
          <div className="text-5xl mb-2">🎉</div>
          <h3 className="text-2xl font-bold text-emerald-600 mb-1">All Pairs Matched!</h3>
          <p className="text-slate-600 text-sm font-medium">You paired every single item correctly!</p>
        </motion.div>
      )}
    </div>
  );
};
