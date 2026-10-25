import React, { useState, useCallback } from 'react';
import { Sparkles, CheckCircle, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sfx } from '../../sound/sfx';
import { ReadAloudCaption } from '../../components/common';

export interface SceneItem {
  id: string;
  isTarget: boolean;
  label: string;
  emoji?: string;
  assetUrl?: string;
  /** Position coordinates in percentages (0-100) */
  x: number;
  y: number;
  /** Size in pixels (default: ~70px) */
  size?: number;
  /** Optional rotation in degrees */
  rotation?: number;
}

export interface FindProps {
  /** Instructional prompt text (e.g. "Can you find the hidden golden star?") */
  instruction: string;
  /** Optional custom audio source for the prompt */
  promptAudio?: string;
  /** Target asset description */
  targetLabel: string;
  targetEmoji?: string;
  targetAssetUrl?: string;
  /** Background theme styling (e.g. ocean, jungle, bedroom, sky) */
  backgroundTheme?: 'ocean' | 'jungle' | 'sky' | 'space' | 'garden';
  /** Array of scene items (distractors + target) placed in 2D coordinate space */
  sceneItems: SceneItem[];
  /** Lifecycle callbacks */
  onTargetFound?: () => void;
  onDistractorTap?: (item: SceneItem) => void;
  onComplete?: () => void;
  onAudioStateChange?: (isPlaying: boolean) => void;
}

export const Find: React.FC<FindProps> = ({
  instruction,
  promptAudio,
  targetLabel,
  targetEmoji,
  targetAssetUrl,
  backgroundTheme = 'jungle',
  sceneItems,
  onTargetFound,
  onDistractorTap,
  onComplete,
  onAudioStateChange,
}) => {
  const [isFound, setIsFound] = useState<boolean>(false);
  const [clickedDistractorIds, setClickedDistractorIds] = useState<Set<string>>(new Set());
  const [wobblingId, setWobblingId] = useState<string | null>(null);

  // Background gradients per theme
  const themeGradients = {
    jungle: 'from-emerald-100 via-green-50 to-amber-100 border-emerald-300',
    ocean: 'from-cyan-100 via-sky-50 to-blue-100 border-sky-300',
    sky: 'from-sky-200 via-indigo-50 to-amber-100 border-sky-300',
    space: 'from-slate-900 via-indigo-950 to-purple-900 border-indigo-500 text-white',
    garden: 'from-lime-100 via-emerald-50 to-rose-50 border-lime-300',
  };

  const handleItemClick = (item: SceneItem) => {
    if (isFound) return;

    if (item.isTarget) {
      // Correct target found!
      setIsFound(true);
      sfx.playCorrectChime();
      sfx.speakPrompt(`You found the ${targetLabel}! Awesome job!`);
      onTargetFound?.();

      setTimeout(() => {
        onComplete?.();
      }, 1500);
    } else {
      // Distractor tapped
      setWobblingId(item.id);
      sfx.playIncorrectBoing();
      sfx.speakPrompt(item.label);
      setClickedDistractorIds((prev) => new Set([...prev, item.id]));
      onDistractorTap?.(item);

      setTimeout(() => {
        setWobblingId(null);
      }, 600);
    }
  };

  const handleReset = useCallback(() => {
    setIsFound(false);
    setClickedDistractorIds(new Set());
    setWobblingId(null);
  }, []);

  return (
    <div className="w-full max-w-4xl flex flex-col items-center">
      {/* Top ReadAloudCaption Layer */}
      <div className="w-full bg-white rounded-3xl p-6 shadow-xl border-4 border-amber-200 mb-6">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-amber-600 font-extrabold uppercase tracking-wider">
              Visual Search Quest • Find
            </span>
            <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              Target:
              {targetAssetUrl ? (
                <img src={targetAssetUrl} alt={targetLabel} className="w-4 h-4 inline-block object-contain" />
              ) : (
                <span>{targetEmoji}</span>
              )}
              {targetLabel}
            </span>
          </div>
          <div className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-200 uppercase tracking-wide">
            {isFound ? 'Target Found!' : 'Searching...'}
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

      {/* Interactive Visual Search Canvas */}
      <div
        className={`w-full h-[440px] md:h-[500px] relative rounded-3xl overflow-hidden shadow-2xl border-4 bg-gradient-to-b ${themeGradients[backgroundTheme]} select-none`}
      >
        {/* Subtle decorative environmental background markers */}
        <div className="absolute inset-0 pointer-events-none opacity-25 flex items-center justify-between p-8 text-8xl">
          <span>🌿</span>
          <span>🍃</span>
          <span>🌸</span>
        </div>

        {/* Scene Items (Target + Distractors placed in 2D coordinates) */}
        {sceneItems.map((item) => {
          const isTargetItem = item.isTarget;
          const isWobbling = wobblingId === item.id;
          const isClickedDistractor = clickedDistractorIds.has(item.id);

          return (
            <motion.button
              key={item.id}
              onClick={() => handleItemClick(item)}
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              whileHover={!isFound ? { scale: 1.15 } : {}}
              whileTap={!isFound ? { scale: 0.9 } : {}}
              animate={
                isTargetItem && isFound
                  ? { scale: [1, 1.4, 1.25], rotate: [0, -10, 10, 0] }
                  : isWobbling
                  ? { x: [0, -10, 10, -6, 6, 0] }
                  : {}
              }
              transition={{ duration: 0.5 }}
              className={`absolute cursor-pointer transition-opacity flex flex-col items-center justify-center p-2 rounded-2xl ${
                isTargetItem && isFound
                  ? 'z-30 bg-amber-400/40 ring-4 ring-amber-400 backdrop-blur-sm'
                  : isClickedDistractor
                  ? 'opacity-40 hover:opacity-75 z-10'
                  : 'z-20 hover:drop-shadow-lg'
              }`}
            >
              <div
                style={{ fontSize: `${item.size || 58}px`, transform: `rotate(${item.rotation || 0}deg)` }}
                className="select-none filter drop-shadow-md"
              >
                {item.assetUrl ? (
                  <img src={item.assetUrl} alt={item.label} className="w-16 h-16 object-contain" />
                ) : (
                  <span>{item.emoji}</span>
                )}
              </div>

              {/* Success celebration halo */}
              {isTargetItem && isFound && (
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

        {/* Found Celebration Overlay */}
        <AnimatePresence>
          {isFound && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-40"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                <Sparkles className="w-12 h-12" />
              </div>
              <h3 className="text-3xl font-extrabold text-emerald-700 mb-2">
                You Found The {targetLabel}!
              </h3>
              <p className="text-slate-600 font-medium mb-6 text-base max-w-sm">
                Sharp eyes! You spotted the target hidden among all the distractions!
              </p>
              <button
                onClick={handleReset}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-7 py-3 rounded-full flex items-center gap-2 shadow-lg transition active:scale-95 cursor-pointer text-base"
              >
                <RefreshCcw className="w-5 h-5" />
                Play Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="text-xs text-slate-400 mt-3 font-semibold text-center">
        💡 Explore the scene: tap around to find where the target is hiding!
      </p>
    </div>
  );
};
