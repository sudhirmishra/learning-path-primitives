import { ChoiceItem } from './types/primitive';
import { MatchPair } from './primitives/match';
import { ThinkOption } from './primitives/think';

export interface ActivityCatalogItem {
  id: string;
  primitiveId: 'listen-find' | 'new-word' | 'read' | 'opposites' | 'match' | 'think';
  primitiveName: string;
  title: string;
  description: string;
  emoji: string;
  category: 'Vocabulary' | 'Reading' | 'Logic' | 'Concepts' | 'Association';
  color: string;
  accentBorder: string;
}

export const ACTIVITIES_CATALOG: ActivityCatalogItem[] = [
  // Listen & Find Usages
  {
    id: 'listen-find-fruits',
    primitiveId: 'listen-find',
    primitiveName: 'Listen & Find',
    title: 'Fruit Harvest Quest',
    description: 'Listen to the fruit name and tap the matching fresh fruit.',
    emoji: '🍎',
    category: 'Vocabulary',
    color: 'from-amber-400 to-orange-400',
    accentBorder: 'border-amber-300',
  },
  {
    id: 'listen-find-animals',
    primitiveId: 'listen-find',
    primitiveName: 'Listen & Find',
    title: 'Jungle Safari Calls',
    description: 'Listen carefully to the animal call or name and find who is hiding!',
    emoji: '🦁',
    category: 'Vocabulary',
    color: 'from-emerald-400 to-teal-500',
    accentBorder: 'border-emerald-300',
  },

  // New Word Usages
  {
    id: 'new-word-giraffe',
    primitiveId: 'new-word',
    primitiveName: 'New Word',
    title: 'Safari Spotlight: Giraffe',
    description: 'Explore the tallest animal on Earth with pronunciation and fun facts.',
    emoji: '🦒',
    category: 'Vocabulary',
    color: 'from-yellow-400 to-amber-500',
    accentBorder: 'border-amber-300',
  },
  {
    id: 'new-word-telescope',
    primitiveId: 'new-word',
    primitiveName: 'New Word',
    title: 'Space Explorer: Telescope',
    description: 'Discover how astronomers look at distant stars and planets.',
    emoji: '🔭',
    category: 'Concepts',
    color: 'from-indigo-400 to-purple-500',
    accentBorder: 'border-indigo-300',
  },

  // Read Usages
  {
    id: 'read-kitten',
    primitiveId: 'read',
    primitiveName: 'Read',
    title: 'Playful Kitten Story',
    description: 'Word-by-word synchronized read-along with the little kitten.',
    emoji: '🐱',
    category: 'Reading',
    color: 'from-sky-400 to-blue-500',
    accentBorder: 'border-sky-300',
  },
  {
    id: 'read-rocket',
    primitiveId: 'read',
    primitiveName: 'Read',
    title: 'Rocket Journey to Space',
    description: 'Practice early reading with a rocket countdown and launch.',
    emoji: '🚀',
    category: 'Reading',
    color: 'from-rose-400 to-red-500',
    accentBorder: 'border-rose-300',
  },

  // Opposites Usages
  {
    id: 'opposites-big-small',
    primitiveId: 'opposites',
    primitiveName: 'Opposites',
    title: 'Size Explorer: Big vs Small',
    description: 'Compare an enormous elephant with a tiny mouse.',
    emoji: '🐘',
    category: 'Concepts',
    color: 'from-amber-400 to-yellow-500',
    accentBorder: 'border-amber-300',
  },
  {
    id: 'opposites-hot-cold',
    primitiveId: 'opposites',
    primitiveName: 'Opposites',
    title: 'Temperature: Hot vs Cold',
    description: 'Compare a blazing hot campfire with ice cold winter cubes.',
    emoji: '🔥',
    category: 'Concepts',
    color: 'from-orange-400 to-cyan-500',
    accentBorder: 'border-orange-300',
  },

  // Match Usages
  {
    id: 'match-animal-food',
    primitiveId: 'match',
    primitiveName: 'Match',
    title: 'Animal Treat Match',
    description: 'Connect cute animals to the yummy food they love to eat.',
    emoji: '🥕',
    category: 'Association',
    color: 'from-emerald-400 to-green-500',
    accentBorder: 'border-emerald-300',
  },
  {
    id: 'match-parent-baby',
    primitiveId: 'match',
    primitiveName: 'Match',
    title: 'Parent & Baby Animals',
    description: 'Help baby animals find their loving parent pairs.',
    emoji: '🐣',
    category: 'Association',
    color: 'from-pink-400 to-rose-400',
    accentBorder: 'border-pink-300',
  },

  // Think Usages
  {
    id: 'think-day-night',
    primitiveId: 'think',
    primitiveName: 'Think',
    title: 'Day & Night Sky Pattern',
    description: 'Decipher the celestial sequence of suns and moons.',
    emoji: '🌙',
    category: 'Logic',
    color: 'from-purple-400 to-indigo-500',
    accentBorder: 'border-purple-300',
  },
  {
    id: 'think-shape-sequence',
    primitiveId: 'think',
    primitiveName: 'Think',
    title: 'Geometric Color Rhythm',
    description: 'Identify which colorful gem completes the logical pattern.',
    emoji: '💎',
    category: 'Logic',
    color: 'from-fuchsia-400 to-violet-500',
    accentBorder: 'border-fuchsia-300',
  },
];

// Activity Datasets
export const ACTIVITY_DATA = {
  // Listen & Find 1: Fruits
  'listen-find-fruits': {
    promptAudio: 'Can you find the sweet apple?',
    textCaption: 'Can you find the sweet apple?',
    correctChoiceId: 'apple',
    choices: [
      { id: 'apple', label: 'Apple', emoji: '🍎', altText: 'Sweet red apple' },
      { id: 'banana', label: 'Banana', emoji: '🍌', altText: 'Yellow banana' },
      { id: 'orange', label: 'Orange', emoji: '🍊', altText: 'Juicy orange' },
      { id: 'strawberry', label: 'Strawberry', emoji: '🍓', altText: 'Strawberry' },
      { id: 'grapes', label: 'Grapes', emoji: '🍇', altText: 'Grapes' },
      { id: 'watermelon', label: 'Watermelon', emoji: '🍉', altText: 'Watermelon' },
    ] as ChoiceItem[],
  },
  // Listen & Find 2: Animals
  'listen-find-animals': {
    promptAudio: 'Who is roaring? Find the mighty Lion!',
    textCaption: 'Find the mighty Lion!',
    correctChoiceId: 'lion',
    choices: [
      { id: 'panda', label: 'Panda', emoji: '🐼', altText: 'Playful panda' },
      { id: 'lion', label: 'Lion', emoji: '🦁', altText: 'Mighty lion' },
      { id: 'koala', label: 'Koala', emoji: '🐨', altText: 'Cuddly koala' },
      { id: 'fox', label: 'Fox', emoji: '🦊', altText: 'Clever fox' },
      { id: 'bear', label: 'Bear', emoji: '🐻', altText: 'Brown bear' },
      { id: 'frog', label: 'Frog', emoji: '🐸', altText: 'Little frog' },
    ] as ChoiceItem[],
  },

  // New Word 1: Giraffe
  'new-word-giraffe': {
    word: 'Giraffe',
    phonetics: 'dʒəˈræf',
    visualAsset: { emoji: '🦒', altText: 'Tall Giraffe' },
    funFact: 'Giraffes are the tallest mammals on Earth with super long necks!',
  },
  // New Word 2: Telescope
  'new-word-telescope': {
    word: 'Telescope',
    phonetics: 'ˈtel.ɪ.skoʊp',
    visualAsset: { emoji: '🔭', altText: 'Astronomy Telescope' },
    funFact: 'Telescopes use curved lenses and mirrors to bring distant galaxies right before your eyes!',
  },

  // Read 1: Kitten
  'read-kitten': {
    sentence: 'The little kitten plays happily with a soft ball of yarn.',
    illustration: '🐱🧶',
  },
  // Read 2: Rocket
  'read-rocket': {
    sentence: 'Three two one blast off into the starry night sky!',
    illustration: '🚀✨',
  },

  // Opposites 1: Big vs Small
  'opposites-big-small': {
    conceptTitle: 'Big vs Small',
    leftItem: {
      id: 'elephant',
      label: 'Enormous Elephant',
      emoji: '🐘',
      description: 'Big and heavy!',
    },
    rightItem: {
      id: 'mouse',
      label: 'Tiny Mouse',
      emoji: '🐭',
      description: 'Small and quick!',
    },
    promptQuestion: 'Look at the opposites: Who is BIG and who is SMALL?',
  },
  // Opposites 2: Hot vs Cold
  'opposites-hot-cold': {
    conceptTitle: 'Hot vs Cold',
    leftItem: {
      id: 'fire',
      label: 'Blazing Campfire',
      emoji: '🔥',
      description: 'Warm and bright!',
    },
    rightItem: {
      id: 'ice',
      label: 'Frosty Ice Cubes',
      emoji: '🧊',
      description: 'Chilly and freezing!',
    },
    promptQuestion: 'Which one is HOT like summer, and which is COLD like winter?',
  },

  // Match 1: Animals & Food
  'match-animal-food': {
    instruction: 'Pair each animal friend with their favorite treat!',
    promptAudio: 'Can you pair each animal friend with their favorite treat?',
    pairs: [
      { id: 'dog', leftLabel: 'Puppy', leftEmoji: '🐶', rightLabel: 'Bone', rightEmoji: '🦴' },
      { id: 'bee', leftLabel: 'Bee', leftEmoji: '🐝', rightLabel: 'Honey', rightEmoji: '🍯' },
      { id: 'monkey', leftLabel: 'Monkey', leftEmoji: '🐵', rightLabel: 'Banana', rightEmoji: '🍌' },
      { id: 'rabbit', leftLabel: 'Bunny', leftEmoji: '🐰', rightLabel: 'Carrot', rightEmoji: '🥕' },
    ] as MatchPair[],
  },
  // Match 2: Parent & Baby Animals
  'match-parent-baby': {
    instruction: 'Match each baby animal to its loving parent!',
    promptAudio: 'Can you match each baby animal to its loving parent?',
    pairs: [
      { id: 'cat', leftLabel: 'Kitten', leftEmoji: '🐱', rightLabel: 'Cat', rightEmoji: '🐈' },
      { id: 'dog', leftLabel: 'Puppy', leftEmoji: '🐶', rightLabel: 'Dog', rightEmoji: '🐕' },
      { id: 'hen', leftLabel: 'Chick', leftEmoji: '🐥', rightLabel: 'Hen', rightEmoji: '🐔' },
      { id: 'sheep', leftLabel: 'Lamb', leftEmoji: '🐑', rightLabel: 'Sheep', rightEmoji: '🐏' },
    ] as MatchPair[],
  },

  // Think 1: Day & Night
  'think-day-night': {
    promptText: 'Look at the day and night sky pattern. What comes next?',
    patternSequence: [
      { emoji: '☀️', label: 'Sun' },
      { emoji: '🌙', label: 'Moon' },
      { emoji: '☀️', label: 'Sun' },
      { emoji: '🌙', label: 'Moon' },
      { emoji: '☀️', label: 'Sun' },
    ],
    options: [
      { id: 'cloud', emoji: '☁️', label: 'Cloud' },
      { id: 'moon', emoji: '🌙', label: 'Moon' },
      { id: 'star', emoji: '⭐', label: 'Star' },
    ] as ThinkOption[],
    correctOptionId: 'moon',
  },
  // Think 2: Shape Rhythm
  'think-shape-sequence': {
    promptText: 'Follow the gem rhythm: Diamond, Heart, Diamond, Heart... What is next?',
    patternSequence: [
      { emoji: '💎', label: 'Diamond' },
      { emoji: '❤️', label: 'Heart' },
      { emoji: '💎', label: 'Diamond' },
      { emoji: '❤️', label: 'Heart' },
      { emoji: '💎', label: 'Diamond' },
    ],
    options: [
      { id: 'star', emoji: '⭐', label: 'Star' },
      { id: 'heart', emoji: '❤️', label: 'Heart' },
      { id: 'circle', emoji: '🔵', label: 'Circle' },
    ] as ThinkOption[],
    correctOptionId: 'heart',
  },
};
