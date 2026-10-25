import React, { useState } from 'react';
import { Volume2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { sfx } from '../../sound/sfx';
import { ReadAloudCaption } from '../../components/common';

export interface NewWordProps {
  /** The target word being introduced (e.g. "Giraffe") */
  word: string;
  /** Optional phonetic spelling (e.g. "dʒəˈræf") */
  phonetics?: string;
  /** Visual hero asset (emoji or image URL) */
  visualAsset: {
    emoji?: string;
    assetUrl?: string;
    altText: string;
  };
  /** Fun educational fact */
  funFact?: string;
  /** Contextual example sentence for the word */
  exampleSentence?: string;
  /** Optional custom audio source for the sentence (.mp3 URL or audio text) */
  sentenceAudio?: string;
  /** Optional custom audio source for the word pronunciation (.mp3 URL) */
  pronunciationAudio?: string;
  /** Lifecycle completion callback */
  onComplete?: () => void;
  /** Audio playback state notification callback */
  onAudioStateChange?: (isPlaying: boolean) => void;
}

export const NewWord: React.FC<NewWordProps> = ({
  word,
  phonetics,
  visualAsset,
  funFact,
  exampleSentence,
  sentenceAudio,
  pronunciationAudio,
  onComplete,
  onAudioStateChange,
}) => {
  const [isSpeakingWord, setIsSpeakingWord] = useState<boolean>(false);

  const wordAudioSource = pronunciationAudio || word;

  const speakWord = () => {
    setIsSpeakingWord(true);
    onAudioStateChange?.(true);
    sfx.speakPrompt(wordAudioSource, () => {
      setIsSpeakingWord(false);
      onAudioStateChange?.(false);
    });
  };

  const handleFinish = () => {
    sfx.playCorrectChime();
    setTimeout(() => {
      onComplete?.();
    }, 600);
  };

  return (
    <div className="w-full max-w-4xl flex flex-col items-center">
      {/* Top Split Layout: Word Details on Left, Visual Image on Right (Container removed) */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-8 py-6 px-4">
        {/* Left Side: Word, Phonetics, Audio Button, and Fun Fact */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          <div className="inline-block bg-amber-100 text-amber-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            New Word
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-800 tracking-wide mb-1">
            {word}
          </h1>

          {phonetics && (
            <p className="text-base font-semibold text-indigo-500 tracking-widest mb-4">
              /{phonetics}/
            </p>
          )}

          {funFact && (
            <p className="text-slate-600 bg-white/80 backdrop-blur border border-amber-200/60 rounded-2xl p-4 text-sm md:text-base font-medium max-w-md shadow-sm mb-5">
              ✨ {funFact}
            </p>
          )}

          {/* Word Pronunciation Trigger Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={speakWord}
            className="bg-amber-400 hover:bg-amber-500 active:scale-95 text-white font-bold px-6 py-3 rounded-2xl shadow-md flex items-center gap-2 cursor-pointer transition text-base"
          >
            <Volume2 className="w-5 h-5" />
            <span>Hear Word</span>
          </motion.button>
        </div>

        {/* Right Side: Visual Asset Illustration / Emoji */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <motion.div
            animate={isSpeakingWord ? { scale: [1, 1.14, 1], rotate: [0, -3, 3, 0] } : {}}
            transition={{ duration: 1.2, repeat: isSpeakingWord ? Infinity : 0 }}
            className="w-52 h-52 md:w-64 md:h-64 flex items-center justify-center text-9xl md:text-[11rem] select-none drop-shadow-xl cursor-pointer"
            onClick={speakWord}
            title="Tap to hear word"
          >
            {visualAsset.assetUrl ? (
              <img
                src={visualAsset.assetUrl}
                alt={visualAsset.altText}
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <span>{visualAsset.emoji}</span>
            )}
          </motion.div>
        </div>
      </div>

      {/* Bottom Area: Full-width ReadAloudCaption */}
      {exampleSentence && (
        <div className="w-full my-6 bg-white/90 backdrop-blur rounded-3xl p-6 shadow-lg border-2 border-indigo-100">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-2 text-center md:text-left">
            Example Sentence Read-Along
          </span>
          <ReadAloudCaption
            sentence={exampleSentence}
            audioSource={sentenceAudio}
            size="md"
            autoplay={true}
            autoplayDelayMs={600}
            onAudioStateChange={onAudioStateChange}
          />
        </div>
      )}

      {/* Completion Action Button */}
      <div className="flex items-center justify-center mt-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleFinish}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg flex items-center gap-2 cursor-pointer transition text-base md:text-lg"
        >
          <CheckCircle2 className="w-6 h-6" />
          <span>I Learned It!</span>
        </motion.button>
      </div>
    </div>
  );
};
