import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { sfx } from '../../sound/sfx';

export interface ReadAloudCaptionProps {
  /** The sentence text displayed on screen */
  sentence: string;
  /**
   * Optional custom audio source: can be an audio URL (.mp3, .wav, .ogg) or custom audio text.
   * If omitted, falls back to reading the `sentence` text directly.
   */
  audioSource?: string;
  /** Autoplay on mount (default: true) */
  autoplay?: boolean;
  /** Delay in milliseconds before autoplay starts (default: 400) */
  autoplayDelayMs?: number;
  /** Show on-demand replay button (default: true) */
  showReplayButton?: boolean;
  /** Visual sizing variant */
  size?: 'sm' | 'md' | 'lg';
  /** Optional container CSS class */
  className?: string;
  /** Callback emitted when audio starts/stops */
  onAudioStateChange?: (isPlaying: boolean) => void;
  /** Callback emitted when sentence read-along completes */
  onComplete?: () => void;
}

export const ReadAloudCaption: React.FC<ReadAloudCaptionProps> = ({
  sentence,
  audioSource,
  autoplay = true,
  autoplayDelayMs = 400,
  showReplayButton = true,
  size = 'md',
  className = '',
  onAudioStateChange,
  onComplete,
}) => {
  const [activeWordIndex, setActiveWordIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const words = sentence.split(/\s+/);
  const fallbackTimerRef = useRef<number | null>(null);

  // Audio source to play (custom file URL, custom text, or sentence)
  const resolvedAudio = audioSource || sentence;

  // Character range mappings for speech boundary events
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

    sfx.speakPrompt(
      resolvedAudio,
      () => {
        setIsPlaying(false);
        setActiveWordIndex(-1);
        onAudioStateChange?.(false);
        if (fallbackTimerRef.current) clearInterval(fallbackTimerRef.current);
        onComplete?.();
      },
      (charIndex) => {
        hasReceivedBoundary = true;
        const matchIdx = wordRanges.current.findIndex(
          (r) => charIndex >= r.start && charIndex <= r.end
        );
        if (matchIdx !== -1) {
          setActiveWordIndex(matchIdx);
        }
      }
    );

    // Fallback word highlighting progression if browser speech boundary events are absent
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
  }, [resolvedAudio, words.length, onAudioStateChange, onComplete, stopPlayback]);

  // Autoplay effect
  useEffect(() => {
    if (!autoplay) return;
    const timer = setTimeout(() => {
      startReadAlong();
    }, autoplayDelayMs);
    return () => {
      clearTimeout(timer);
      stopPlayback();
    };
  }, [autoplay, autoplayDelayMs, startReadAlong, stopPlayback]);

  // Handle individual word tap
  const handleWordTap = (word: string, index: number) => {
    stopPlayback();
    setActiveWordIndex(index);
    sfx.speakPrompt(word, () => {
      setTimeout(() => setActiveWordIndex(-1), 400);
    });
  };

  // Font size variants
  const sizeClasses = {
    sm: 'text-lg md:text-xl py-1 px-2.5 gap-1.5',
    md: 'text-xl md:text-2xl py-1.5 px-3 gap-2',
    lg: 'text-2xl md:text-3xl py-2 px-3.5 gap-2.5',
  };

  return (
    <div className={`w-full flex flex-col items-center ${className}`}>
      <div className="w-full flex items-center justify-center gap-3">
        {/* On-demand Replay Button */}
        {showReplayButton && (
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            animate={isPlaying ? { scale: [1, 1.1, 1] } : {}}
            transition={isPlaying ? { repeat: Infinity, duration: 1.2 } : {}}
            onClick={startReadAlong}
            className="flex-shrink-0 bg-indigo-500 hover:bg-indigo-600 text-white p-3 rounded-2xl shadow-md transition cursor-pointer"
            title="Read sentence aloud"
            aria-label="Read sentence aloud"
          >
            <Volume2 className="w-6 h-6" />
          </motion.button>
        )}

        {/* Word-by-word interactive read-aloud caption container */}
        <div className="flex-1 p-4 bg-slate-50 border-2 border-indigo-100 rounded-3xl flex flex-wrap items-center justify-center gap-2">
          {words.map((word, index) => {
            const isHighlighted = activeWordIndex === index;
            return (
              <motion.span
                key={index}
                animate={isHighlighted ? { scale: 1.12, y: -3 } : { scale: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                onClick={() => handleWordTap(word, index)}
                className={`font-bold rounded-2xl cursor-pointer transition-all ${sizeClasses[size]} ${
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
      </div>

      <p className="text-[11px] text-slate-400 mt-2 font-semibold text-center">
        💡 Tap any word to hear it pronounced
      </p>
    </div>
  );
};
