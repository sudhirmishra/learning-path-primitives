import { useState } from 'react';
import { ListenAndFind } from './primitives/listen-and-find';
import { ChoiceItem, AttemptDetails, ResultSummary } from './types/primitive';
import { Star, Sparkles, Terminal } from 'lucide-react';

const SAMPLE_CHOICES: ChoiceItem[] = [
  { id: 'apple', label: 'Apple', emoji: '🍎', altText: 'Red sweet apple' },
  { id: 'banana', label: 'Banana', emoji: '🍌', altText: 'Yellow ripe banana' },
  { id: 'orange', label: 'Orange', emoji: '🍊', altText: 'Juicy orange' },
  { id: 'strawberry', label: 'Strawberry', emoji: '🍓', altText: 'Fresh strawberry' },
  { id: 'grapes', label: 'Grapes', emoji: '🍇', altText: 'Purple grapes bunch' },
  { id: 'watermelon', label: 'Watermelon', emoji: '🍉', altText: 'Sweet watermelon slice' },
];

export function App() {
  const [eventLogs, setEventLogs] = useState<string[]>([
    '[HOST] Learning Path Engine initialized',
    '[HOST] Loading primitive: Listen & Find',
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
      <header className="w-full max-w-3xl flex items-center justify-between bg-white/90 backdrop-blur rounded-3xl px-6 py-4 shadow-md border-4 border-amber-200 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-400 flex items-center justify-center text-white shadow-inner">
            <Star className="w-6 h-6 fill-current" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block">
              Learning Path Engine • Primitive Sandbox
            </span>
            <h1 className="text-slate-800 font-bold text-xl leading-tight">
              Listen & Find Primitive
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-1.5 rounded-2xl">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-bold text-amber-600">Unit 1: Fruits</span>
        </div>
      </header>

      {/* Main Primitive Workspace */}
      <main className="w-full max-w-3xl flex-1 flex flex-col items-center justify-center">
        <ListenAndFind
          promptAudio="Can you find the sweet apple?"
          textCaption="Can you find the sweet apple?"
          choices={SAMPLE_CHOICES}
          correctChoiceId="apple"
          onCorrect={handleCorrect}
          onIncorrect={handleIncorrect}
          onComplete={handleComplete}
          onAudioStateChange={handleAudioState}
        />
      </main>

      {/* Host Event Console */}
      <footer className="w-full max-w-3xl mt-8 bg-slate-900 text-slate-200 rounded-2xl p-4 shadow-xl border border-slate-700 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <Terminal className="w-4 h-4" />
            <span>Host Runtime Event Bus:</span>
          </div>
          <span className="text-slate-500">React 18 + Framer Motion + Web Audio</span>
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
