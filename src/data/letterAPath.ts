import { ChoiceItem } from '../types/primitive';
import { MatchPair } from '../primitives/match';
import { ThinkOption } from '../primitives/think';
import { SceneItem } from '../primitives/find';

export interface PathStep {
  id: string;
  primitiveId: 'new-word' | 'read' | 'listen-find' | 'find' | 'opposites' | 'match' | 'think';
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
    title: 'Introduce Letter A: Apple & Astronaut',
    badge: '1. New Word',
    summary: 'Meet Letter A with Apple and an example sentence.',
  },
  {
    id: 'step-2-read',
    primitiveId: 'read',
    stepNumber: 2,
    title: 'Letter A Story: Astronaut Andy',
    badge: '2. Read Along',
    summary: 'Read along word-by-word with Astronaut Andy eating an Apple.',
  },
  {
    id: 'step-3-listen-find',
    primitiveId: 'listen-find',
    stepNumber: 3,
    title: 'Auditory Challenge: Hear & Find "A" Word',
    badge: '3. Listen & Find',
    summary: 'Listen to the prompt audio and find the word starting with A.',
  },
  {
    id: 'step-4-find',
    primitiveId: 'find',
    stepNumber: 4,
    title: 'Visual Scene Search: Spot the Hidden Acorn',
    badge: '4. Find',
    summary: 'Look through the garden scene to find the hidden Acorn.',
  },
  {
    id: 'step-5-opposites',
    primitiveId: 'opposites',
    stepNumber: 5,
    title: 'Concepts with "A": Asleep vs Awake',
    badge: '5. Opposites',
    summary: 'Explore contrasting states starting with A: Asleep vs Awake.',
  },
  {
    id: 'step-6-match',
    primitiveId: 'match',
    stepNumber: 6,
    title: 'Pair the "A" Words to Their Friends',
    badge: '6. Match',
    summary: 'Tap to connect related items starting with Letter A.',
  },
  {
    id: 'step-7-think',
    primitiveId: 'think',
    stepNumber: 7,
    title: 'Letter A Riddle: Who Builds Anthills?',
    badge: '7. Think',
    summary: 'Solve the 2-choice riddle: Which tiny creature starts with Letter A?',
  },
];

export const LETTER_A_DATA = {
  // Step 1: New Word (Apple)
  'step-1-new-word': {
    word: 'Apple',
    phonetics: 'ˈæp.əl',
    visualAsset: { emoji: '🍎', altText: 'Red shiny apple' },
    funFact: 'Letter A is the very first letter of the alphabet! Apples grow on trees all over the world.',
    exampleSentence: 'Andy the astronaut picked a crisp sweet Apple.',
  },

  // Step 2: Read Along (Andy the Astronaut)
  'step-2-read': {
    sentence: 'Astronaut Andy saw an alligator eating an apple in space.',
    illustration: '🧑‍🚀🍎🐊',
  },

  // Step 3: Listen & Find ("Airplane")
  'step-3-listen-find': {
    promptAudio: 'Can you listen and find the high flying Airplane that starts with Letter A?',
    textCaption: 'Find the Airplane that starts with Letter A!',
    correctChoiceId: 'airplane',
    choices: [
      { id: 'boat', label: 'Boat', emoji: '⛵', altText: 'Sailboat' },
      { id: 'airplane', label: 'Airplane', emoji: '✈️', altText: 'Flying Airplane' },
      { id: 'car', label: 'Car', emoji: '🚗', altText: 'Red Car' },
      { id: 'train', label: 'Train', emoji: '🚂', altText: 'Steam Train' },
      { id: 'bicycle', label: 'Bicycle', emoji: '🚲', altText: 'Bicycle' },
      { id: 'helicopter', label: 'Helicopter', emoji: '🚁', altText: 'Helicopter' },
    ] as ChoiceItem[],
  },

  // Step 4: Find (Hidden Acorn in the Garden)
  'step-4-find': {
    instruction: 'Search the garden and find the golden Acorn starting with Letter A!',
    targetLabel: 'Acorn',
    targetEmoji: '🌰',
    backgroundTheme: 'garden' as const,
    sceneItems: [
      { id: 'leaf1', isTarget: false, label: 'Green Leaf', emoji: '🍃', x: 20, y: 30, size: 54 },
      { id: 'flower', isTarget: false, label: 'Daisy', emoji: '🌼', x: 75, y: 25, size: 58 },
      { id: 'mushroom', isTarget: false, label: 'Mushroom', emoji: '🍄', x: 80, y: 78, size: 62 },
      { id: 'ladybug', isTarget: false, label: 'Ladybug', emoji: '🐞', x: 30, y: 82, size: 48 },
      { id: 'ant', isTarget: false, label: 'Little Ant', emoji: '🐜', x: 52, y: 56, size: 46 },
      { id: 'tulip', isTarget: false, label: 'Pink Tulip', emoji: '🌷', x: 40, y: 24, size: 55 },
      { id: 'acorn', isTarget: true, label: 'Acorn', emoji: '🌰', x: 68, y: 46, size: 64, rotation: 15 },
      { id: 'sunflower', isTarget: false, label: 'Sunflower', emoji: '🌻', x: 15, y: 70, size: 65 },
    ] as SceneItem[],
  },

  // Step 5: Opposites (Asleep vs Awake)
  'step-5-opposites': {
    conceptTitle: 'Asleep vs Awake',
    leftItem: {
      id: 'asleep',
      label: 'Asleep in Bed',
      emoji: '😴',
      description: 'Quiet dreams under the starry moon.',
    },
    rightItem: {
      id: 'awake',
      label: 'Awake & Active',
      emoji: '😃',
      description: 'Energetic and ready to learn!',
    },
    promptQuestion: 'Look at the "A" words: Who is ASLEEP and who is AWAKE?',
  },

  // Step 6: Match (Words starting with A to their partners)
  'step-6-match': {
    instruction: 'Match each "A" word on the left with its friend on the right!',
    promptAudio: 'Can you match each A word on the left with its partner on the right?',
    pairs: [
      { id: 'apple', leftLabel: 'Apple', leftEmoji: '🍎', rightLabel: 'Tree', rightEmoji: '🌳' },
      { id: 'astronaut', leftLabel: 'Astronaut', leftEmoji: '🧑‍🚀', rightLabel: 'Rocket', rightEmoji: '🚀' },
      { id: 'ant', leftLabel: 'Ant', leftEmoji: '🐜', rightLabel: 'Anthill', rightEmoji: '🪨' },
      { id: 'airplane', leftLabel: 'Airplane', leftEmoji: '✈️', rightLabel: 'Cloud', rightEmoji: '☁️' },
    ] as MatchPair[],
  },

  // Step 7: Think (2-choice riddle)
  'step-7-think': {
    promptText: 'Riddle: Which tiny crawling creature that starts with Letter A builds big anthills?',
    options: [
      { id: 'ant', emoji: '🐜', label: 'Tiny Ant' },
      { id: 'alligator', emoji: '🐊', label: 'Big Alligator' },
    ] as ThinkOption[],
    correctOptionId: 'ant',
  },
};
