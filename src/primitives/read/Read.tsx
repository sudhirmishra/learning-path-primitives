import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { sfx } from '../../sound/sfx';
import { ReadAloudCaption } from '../../components/common';

export interface ReadProps {
  sentence: string;
  audioSource?: string;
  illustration?: string;
  onComplete?: () => void;
  onAudioStateChange?: (isPlaying: boolean) => void;
}

export const Read: React.FC<ReadProps> = ({
  sentence,
  audioSource,
  illustration,
  onComplete,
  onAudioStateChange,
}) => {
  const [hasCompletedSentence, setHasCompletedSentence] = useState<boolean>(false);

  const handleFinish = () => {
    sfx.stopVoice();
    sfx.playCorrectChime();
    setTimeout(() => {
      onComplete?.();
    }, 500);
  };

  return (
    <div className="w-full max-w-2xl flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-white rounded-3xl p-6 md:p-8 shadow-xl border-4 border-indigo-200 flex flex-col items-center relative overflow-hidden"
      >
        <div className="absolute top-4 right-4 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          Read Along
        </div>

        {illustration && (
          <div className="text-8xl my-3 select-none drop-shadow-sm">
            {illustration}
          </div>
        )}

        {/* Reusable ReadAloudCaption Sub-Component */}
        <div className="my-6 w-full">
          <ReadAloudCaption
            sentence={sentence}
            audioSource={audioSource}
            size="lg"
            autoplay={true}
            autoplayDelayMs={400}
            showReplayButton={true}
            onAudioStateChange={onAudioStateChange}
            onComplete={() => setHasCompletedSentence(true)}
          />
        </div>

        {/* Completion Action Button */}
        <div className="flex items-center justify-center mt-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleFinish}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-3.5 rounded-2xl shadow-md flex items-center gap-2 cursor-pointer transition text-base md:text-lg"
          >
            <CheckCircle2 className="w-6 h-6" />
            <span>I Can Read This!</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
