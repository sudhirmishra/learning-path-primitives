export type PrimitiveState =
  | 'IDLE'
  | 'PROMPTING'
  | 'AWAITING_INTERACTION'
  | 'EVALUATING'
  | 'FEEDBACK'
  | 'COMPLETE';

export interface ChoiceItem {
  id: string;
  assetUrl?: string;
  emoji?: string;
  label: string;
  altText: string;
}

export interface AttemptDetails {
  selectedId: string;
  targetId: string;
  isCorrect: boolean;
  timestamp: number;
  attemptNumber: number;
}

export interface ResultSummary {
  status: 'success' | 'abandoned';
  totalAttempts: number;
  timeSpentMs: number;
}

export interface ListenAndFindProps {
  /** Text or voice prompt to be announced and replayed */
  promptAudio: string;
  /** Visual reinforcing caption */
  textCaption: string;
  /** Array of visual choice target assets */
  choices: ChoiceItem[];
  /** Correct choice identifier */
  correctChoiceId: string;
  /** Max incorrect attempts allowed before giving hints or auto-advancing */
  maxRetries?: number;
  /** Lifecycle event callbacks emitted to the Host Engine */
  onCorrect?: (details: AttemptDetails) => void;
  onIncorrect?: (details: AttemptDetails) => void;
  onComplete?: (summary: ResultSummary) => void;
  onAudioStateChange?: (isPlaying: boolean) => void;
}
