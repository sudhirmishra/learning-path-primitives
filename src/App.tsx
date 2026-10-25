import { useState } from 'react';
import {
  ListenAndFind,
  NewWord,
  Read,
  Opposites,
  Match,
  Think,
} from './primitives';
import { ChoiceItem, AttemptDetails, ResultSummary } from './types/primitive';
import { Star, Terminal } from 'lucide-react';

type PrimitiveTab = 'listen-find' | 'new-word' | 'read' | 'opposites' | 'match' | 'think';

const LISTEN_FIND_CHOICES: ChoiceItem[] = [
  { id: 'apple', label: 'Apple', emoji: '🍎', altText: 'Red sweet apple' },
  { id: 'banana', label: 'Banana', emoji: '🍌', altText: 'Yellow ripe banana' },
  { id: 'orange', label: 'Orange', emoji: '🍊', altText: 'Juicy orange' },
  { id: 'strawberry', label: 'Strawberry', emoji: '🍓', altText: 'Fresh strawberry' },
  { id: 'grapes', label: 'Grapes', emoji: '🍇', altText: 'Purple grapes bunch' },
  { id: 'watermelon', label: 'Watermelon', emoji: '🍉', altText: 'Sweet watermelon slice' },
];

const MATCH_PAIRS = [
  { id: 'dog', leftLabel: 'Puppy', leftEmoji: '🐶', rightLabel: 'Bone', rightEmoji: '🦴' },
  { id: 'bee', leftLabel: 'Bee', leftEmoji: '🐝', rightLabel: 'Honey', rightEmoji: '🍯' },
  { id: 'monkey', leftLabel: 'Monkey', leftEmoji: '🐵', rightLabel: 'Banana', rightEmoji: '🍌' },
  { id: 'rabbit', leftLabel: 'Bunny', leftEmoji: '🐰', rightLabel: 'Carrot', rightEmoji: '🥕' },
];

const THINK_PATTERN = [
  { emoji: '☀️', label: 'Sun' },
  { emoji: '🌙', label: 'Moon' },
  { emoji: '☀️', label: 'Sun' },
  { emoji: '🌙', label: 'Moon' },
  { emoji: '☀️', label: 'Sun' },
];

const THINK_OPTIONS = [
  { id: 'cloud', emoji: '☁️', label: 'Cloud' },
  { id: 'moon', emoji: '🌙', label: 'Moon' },
  { id: 'star', emoji: '⭐', label: 'Star' },
];

export function App() {
  const [currentTab, setCurrentTab] = useState<PrimitiveTab>('listen-find');
  const [eventLogs, setEventLogs] = useState<string[]>([
    '[HOST] Learning Path Engine initialized',
    '[HOST] Ready to render interactive primitives',
  ]);

  const addLog = (msg: string) => {
    setEventLogs((prev) => [...prev.slice(-15), msg]);
  };

  const handleCorrect = (details: AttemptDetails) => {
    addLog(`[HOST EVENT] onCorrect: selected "${details.selectedId}" on attempt #${details.attemptNumber}`);
  };

  const handleIncorrect = (details: AttemptDetails) => {
    addLog(`[HOST EVENT] onIncorrect: selected "${details.selectedId}", retry permitted`);
  };

  const handleComplete = (summary: ResultSummary) => {
    addLog(`[HOST EVENT] onComplete: status=${summary.status}, totalAttempts=${summary.totalAttempts}`);
  };

  const handleAudioState = (isPlaying: boolean) => {
    addLog(`[HOST EVENT] onAudioStateChange: isPlaying=${isPlaying}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-4 md:p-8">
      {/* Top Navigation / Host Header */}
      <header className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-between bg-white/90 backdrop-blur rounded-3xl p-5 shadow-md border-4 border-amber-200 mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 flex items-center justify-center text-white shadow-inner">
            <Star className="w-7 h-7 fill-current" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block">
              Learning Path Engine • Game Primitives
            </span>
            <h1 className="text-slate-800 font-bold text-2xl leading-tight">
              Interactive Kids Learning Sandbox
            </h1>
          </div>
        </div>

        {/* Primitive Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => {
              setCurrentTab('listen-find');
              addLog('[HOST] Switched to primitive: Listen & Find');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
              currentTab === 'listen-find'
                ? 'bg-amber-400 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🎧 Listen & Find
          </button>

          <button
            onClick={() => {
              setCurrentTab('new-word');
              addLog('[HOST] Switched to primitive: New Word');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
              currentTab === 'new-word'
                ? 'bg-amber-400 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🔤 New Word
          </button>

          <button
            onClick={() => {
              setCurrentTab('read');
              addLog('[HOST] Switched to primitive: Read');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
              currentTab === 'read'
                ? 'bg-indigo-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📖 Read
          </button>

          <button
            onClick={() => {
              setCurrentTab('opposites');
              addLog('[HOST] Switched to primitive: Opposites');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
              currentTab === 'opposites'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⚖️ Opposites
          </button>

          <button
            onClick={() => {
              setCurrentTab('match');
              addLog('[HOST] Switched to primitive: Match');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
              currentTab === 'match'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🧩 Match
          </button>

          <button
            onClick={() => {
              setCurrentTab('think');
              addLog('[HOST] Switched to primitive: Think');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
              currentTab === 'think'
                ? 'bg-purple-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            💡 Think
          </button>
        </div>
      </header>

      {/* Main Primitive Workspace */}
      <main className="w-full max-w-4xl flex-1 flex flex-col items-center justify-center my-4">
        {currentTab === 'listen-find' && (
          <ListenAndFind
            promptAudio="Can you find the sweet apple?"
            textCaption="Can you find the sweet apple?"
            choices={LISTEN_FIND_CHOICES}
            correctChoiceId="apple"
            onCorrect={handleCorrect}
            onIncorrect={handleIncorrect}
            onComplete={handleComplete}
            onAudioStateChange={handleAudioState}
          />
        )}

        {currentTab === 'new-word' && (
          <NewWord
            word="Giraffe"
            phonetics="dʒəˈræf"
            visualAsset={{ emoji: '🦒', altText: 'Tall Giraffe' }}
            funFact="Giraffes are the tallest mammals on Earth with super long necks!"
            onComplete={() => addLog('[HOST] Completed New Word: Giraffe')}
            onAudioStateChange={handleAudioState}
          />
        )}

        {currentTab === 'read' && (
          <Read
            sentence="The little kitten plays happily with a soft ball of yarn."
            illustration="🐱🧶"
            onComplete={() => addLog('[HOST] Completed Read Along sentence')}
            onAudioStateChange={handleAudioState}
          />
        )}

        {currentTab === 'opposites' && (
          <Opposites
            conceptTitle="Big vs Small"
            leftItem={{
              id: 'elephant',
              label: 'Enormous Elephant',
              emoji: '🐘',
              description: 'Big and heavy!',
            }}
            rightItem={{
              id: 'mouse',
              label: 'Tiny Mouse',
              emoji: '🐭',
              description: 'Small and quick!',
            }}
            promptQuestion="Look at the opposites: Who is BIG and who is SMALL?"
            onComplete={() => addLog('[HOST] Completed Opposites: Big vs Small')}
            onAudioStateChange={handleAudioState}
          />
        )}

        {currentTab === 'match' && (
          <Match
            instruction="Pair each friendly animal with their favorite treat!"
            pairs={MATCH_PAIRS}
            onComplete={() => addLog('[HOST] Completed Match primitive')}
          />
        )}

        {currentTab === 'think' && (
          <Think
            promptText="Look at the day and night sky pattern. What comes next?"
            patternSequence={THINK_PATTERN}
            options={THINK_OPTIONS}
            correctOptionId="moon"
            onComplete={() => addLog('[HOST] Completed Think logic puzzle')}
          />
        )}
      </main>

      {/* Host Event Console */}
      <footer className="w-full max-w-4xl mt-8 bg-slate-900 text-slate-200 rounded-2xl p-4 shadow-xl border border-slate-700 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <Terminal className="w-4 h-4" />
            <span>Host Runtime Event Bus:</span>
          </div>
          <span className="text-slate-500">6 Primitives Live</span>
        </div>
        <div className="h-20 overflow-y-auto space-y-1 text-slate-300">
          {eventLogs.map((log, index) => (
            <div key={index}>{log}</div>
          ))}
        </div>
      </footer>
    </div>
  );
}

export default App;
