import React, { useState } from 'react';
import { Volume2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { PrimitiveState } from '../../types/primitive';
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
  /** Optional contextual example sentence for the word */
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
  const [state, setState] = useState<PrimitiveState>('IDLE');
  const [isSpeakingWord, setIsSpeakingWord] = useState<boolean>(false);

  const wordAudioSource = pronunciationAudio || word;

  const speakWord = () => {
    setIsSpeakingWord(true);
    onAudioStateChange?.(true);
    sfx.speakPrompt(wordAudioSource, () => {
      setIsSpeakingWord(false);
      onAudioStateChange?.(false);
      setState('AWAITING_INTERACTION');
    });
  };

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
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="w-full bg-white rounded-3xl p-6 md:p-8 shadow-xl border-4 border-amber-200 flex flex-col items-center relative overflow-hidden"
      >
        <div className="absolute top-4 right-4 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          New Word
        </div>

        {/* Object Illustration / Emoji */}
        <motion.div
          animate={isSpeakingWord ? { scale: [1, 1.12, 1], rotate: [0, -3, 3, 0] } : {}}
          transition={{ duration: 1.2, repeat: isSpeakingWord ? Infinity : 0 }}
          className="w-36 h-36 md:w-40 md:h-40 flex items-center justify-center text-8xl md:text-9xl my-2 select-none drop-shadow-md cursor-pointer"
          onClick={speakWord}
          title="Tap to hear word"
        >
          {visualAsset.assetUrl ? (
            <img src={visualAsset.assetUrl} alt={visualAsset.altText} className="max-h-full max-w-full object-contain" />
          ) : (
            <span>{visualAsset.emoji}</span>
          )}
        </motion.div>

        {/* Written Word Label */}
        <div className="text-center mb-3">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-wide">
            {word}
          </h1>
          {phonetics && (
            <p className="text-sm font-semibold text-indigo-500 tracking-widest mt-1">
              /{phonetics}/
            </p>
          )}
        </div>

        {/* Context Sentence with ReadAloudCaption */}
        {exampleSentence && (
          <div className="w-full my-3">
            <span className="text-[11px] font-bold text-indigo-500 uppercase tracking-wider block mb-1 text-center">
              Example Sentence
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

        {/* Fun Fact */}
        {funFact && (
          <p className="text-slate-600 bg-sky-50 border border-sky-100 rounded-2xl p-3 text-center text-xs md:text-sm font-medium max-w-md my-3">
            ✨ {funFact}
          </p>
        )}

        {/* Audio Action Button */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center mt-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={speakWord}
            className="bg-amber-400 hover:bg-amber-500 text-white font-bold px-6 py-3 rounded-2xl shadow-md flex items-center gap-2 cursor-pointer transition text-sm md:text-base"
          >
            <Volume2 className="w-5 h-5" />
            <span>Hear Word</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleFinish}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-7 py-3 rounded-2xl shadow-md flex items-center gap-2 cursor-pointer transition text-sm md:text-base"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>I Learned It!</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
