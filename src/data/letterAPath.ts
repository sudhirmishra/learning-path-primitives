import { ChoiceItem } from '../types/primitive';
import { ThinkOption } from '../primitives/think';
import { SceneItem } from '../primitives/find';

export interface PathStep {
  id: string;
  primitiveId: 'new-word' | 'read' | 'listen-find' | 'find' | 'think';
  stepNumber: number;
  title: string;
  badge: string;
  summary: string;
}

export const LETTER_A_PATH_STEPS: PathStep[] = [
  {
    id: 'step-1-new-word',
    primitiveId: 'new-word',
    stepNumber: 1,
    title: 'Meet Letter A: A is for Apple',
    badge: '1. New Word',
    summary: 'Introduce Letter A with a big red Apple and simple caption.',
  },
  {
    id: 'step-2-read',
    primitiveId: 'read',
    stepNumber: 2,
    title: 'Read Along: Apple is a fruit',
    badge: '2. Read Along',
    summary: 'Synchronized sentence reading reinforcing A for Apple.',
  },
  {
    id: 'step-3-listen-find',
    primitiveId: 'listen-find',
    stepNumber: 3,
    title: 'Listen & Find: Where is the Apple?',
    badge: '3. Listen & Find',
    summary: 'Focused 2-choice auditory challenge to find the Apple.',
  },
  {
    id: 'step-4-find',
    primitiveId: 'find',
    stepNumber: 4,
    title: 'Visual Search: Find the Apple in the Tree',
    badge: '4. Find',
    summary: 'Spot the red Apple placed naturally in the leafy tree.',
  },
  {
    id: 'step-5-think',
    primitiveId: 'think',
    stepNumber: 5,
    title: 'Think: What is the sweet fruit?',
    badge: '5. Think',
    summary: '2-choice riddle asking for the sweet fruit starting with Letter A.',
  },
];

export const LETTER_A_DATA = {
  // Step 1: New Word — Single target: Apple. Caption: "A for Apple"
  'step-1-new-word': {
    word: 'A',
    phonetics: 'eɪ',
    visualAsset: { emoji: '🍎', altText: 'Red sweet apple' },
    funFact: 'A is for Apple! Crisp, sweet, and yummy to eat.',
    exampleSentence: 'A for Apple.',
  },

  // Step 2: Read Along — "Apple is a fruit, A for Apple."
  'step-2-read': {
    sentence: 'Apple is a fruit. A for Apple.',
    illustration: '🍎✨',
  },

  // Step 3: Listen & Find — Only 2 choices, finding the Apple!
  'step-3-listen-find': {
    promptAudio: 'Can you listen and find the red Apple?',
    textCaption: 'Find the Apple!',
    correctChoiceId: 'apple',
    choices: [
      { id: 'apple', label: 'Apple', emoji: '🍎', altText: 'Red Apple' },
      { id: 'banana', label: 'Banana', emoji: '🍌', altText: 'Yellow Banana' },
    ] as ChoiceItem[],
  },

  // Step 4: Find — Focused visual scene: Spot the red Apple on the leafy apple tree
  'step-4-find': {
    instruction: 'Look at the apple tree! Can you find the red Apple?',
    targetLabel: 'Apple',
    targetEmoji: '🍎',
    backgroundTheme: 'garden' as const,
    sceneItems: [
      { id: 'leaf1', isTarget: false, label: 'Green Leaf', emoji: '🍃', x: 25, y: 32, size: 58 },
      { id: 'leaf2', isTarget: false, label: 'Green Leaf', emoji: '🌿', x: 70, y: 28, size: 62 },
      { id: 'branch', isTarget: false, label: 'Tree Branch', emoji: '🪵', x: 50, y: 78, size: 65 },
      { id: 'apple', isTarget: true, label: 'Apple', emoji: '🍎', x: 55, y: 45, size: 75 },
    ] as SceneItem[],
  },

  // Step 5: Think — "What is the sweet fruit that starts with A?" with 2 choices (Apple vs Car)
  'step-5-think': {
    promptText: 'What is the sweet fruit that starts with Letter A?',
    options: [
      { id: 'apple', emoji: '🍎', label: 'Apple' },
      { id: 'car', emoji: '🚗', label: 'Car' },
    ] as ThinkOption[],
    correctOptionId: 'apple',
  },
};
