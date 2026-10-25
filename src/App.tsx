import { useState } from 'react';
import {
  ListenAndFind,
  NewWord,
  Read,
  Opposites,
  Match,
  Think,
  Find,
} from './primitives';
import { ACTIVITIES_CATALOG, ACTIVITY_DATA } from './data/activities';
import { Star, ArrowLeft, Terminal, Play, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function App() {
  const [activeActivityId, setActiveActivityId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [eventLogs, setEventLogs] = useState<string[]>([
    '[HOST] Learning Path Engine initialized',
    '[HOST] 15 Activities catalog loaded (7 Primitives)',
  ]);

  const addLog = (msg: string) => {
    setEventLogs((prev) => [...prev.slice(-15), msg]);
  };

  const currentActivity = activeActivityId
    ? ACTIVITIES_CATALOG.find((a) => a.id === activeActivityId)
    : null;

  const filteredActivities =
    selectedCategory === 'All'
      ? ACTIVITIES_CATALOG
      : ACTIVITIES_CATALOG.filter((a) => a.category === selectedCategory);

  const categories = ['All', 'Logic', 'Observation', 'Vocabulary', 'Reading', 'Concepts', 'Association'];

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-4 md:p-8">
      {/* Top Header Bar */}
      <header className="w-full max-w-5xl flex items-center justify-between bg-white/90 backdrop-blur rounded-3xl p-5 shadow-md border-4 border-amber-200 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-400 flex items-center justify-center text-white shadow-inner">
            <Star className="w-7 h-7 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-amber-600 font-extrabold bg-amber-100 px-2.5 py-0.5 rounded-full">
                Interactive Learning Paths
              </span>
            </div>
            <h1 className="text-slate-800 font-extrabold text-2xl md:text-3xl leading-tight">
              Kid Quest Adventure
            </h1>
          </div>
        </div>

        {activeActivityId ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setActiveActivityId(null);
              addLog('[HOST] Navigated back to Activities Catalog');
            }}
            className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-4 py-2.5 rounded-2xl border-2 border-indigo-200 transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-bold">Back to Quests</span>
          </motion.button>
        ) : (
          <div className="hidden sm:flex items-center gap-2 text-slate-500 font-bold text-sm bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl">
            <Compass className="w-4 h-4 text-amber-500" />
            <span>15 Quests Across 7 Primitives</span>
          </div>
        )}
      </header>

      {/* Main View Area */}
      <main className="w-full max-w-5xl flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {!activeActivityId ? (
            /* --- Activities Catalog Index Page --- */
            <motion.div
              key="catalog"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full flex flex-col items-center"
            >
              {/* Hero Banner */}
              <div className="w-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 rounded-3xl p-8 shadow-xl text-white mb-8 flex flex-col md:flex-row items-center justify-between gap-6 border-4 border-amber-200">
                <div className="max-w-xl text-center md:text-left">
                  <span className="text-xs font-extrabold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full inline-block mb-3">
                    Play • Listen • Discover
                  </span>
                  <h2 className="text-3xl md:text-4xl font-extrabold mb-2 leading-tight">
                    Choose Your Learning Adventure!
                  </h2>
                  <p className="text-amber-50 text-base md:text-lg font-medium">
                    Pick any quest below to practice visual search, riddles, stories, opposites, matching, and logic puzzles.
                  </p>
                </div>
                <div className="text-7xl md:text-8xl drop-shadow-md select-none animate-bounce">
                  🚀
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-2xl font-bold text-sm transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-105'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Grid of Activity Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {filteredActivities.map((act) => (
                  <motion.div
                    key={act.id}
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setActiveActivityId(act.id);
                      addLog(`[HOST] Launched Activity: ${act.title} (${act.primitiveName})`);
                    }}
                    className={`bg-white rounded-3xl p-6 shadow-lg border-4 ${act.accentBorder} hover:shadow-xl transition-all duration-200 flex flex-col justify-between cursor-pointer group`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="bg-slate-100 text-slate-700 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                          {act.primitiveName}
                        </span>
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                          {act.category}
                        </span>
                      </div>

                      {/* Icon & Title */}
                      <div className="flex items-start gap-4 mb-3">
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition duration-300">
                          {act.emoji}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-slate-800 leading-snug group-hover:text-indigo-600 transition">
                            {act.title}
                          </h3>
                        </div>
                      </div>

                      <p className="text-slate-500 text-sm font-medium mb-6">
                        {act.description}
                      </p>
                    </div>

                    {/* Launch Button Footer */}
                    <div className="w-full pt-4 border-t border-slate-100 flex items-center justify-between text-indigo-600 font-bold text-sm">
                      <span className="flex items-center gap-1 group-hover:translate-x-1 transition">
                        Start Quest &rarr;
                      </span>
                      <div className="w-8 h-8 rounded-full bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            /* --- Active Activity View --- */
            <motion.div
              key="active-activity"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full flex flex-col items-center"
            >
              {/* Activity Context Subheader */}
              <div className="w-full max-w-4xl flex items-center justify-between mb-6 px-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{currentActivity?.emoji}</span>
                  <span className="font-bold text-slate-700 text-lg">
                    {currentActivity?.title}
                  </span>
                </div>
                <span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full uppercase">
                  Template: {currentActivity?.primitiveName}
                </span>
              </div>

              {/* Render Respective Primitive with Configured Dataset */}
              {activeActivityId === 'think-swim-fly' && (
                <Think
                  {...ACTIVITY_DATA['think-swim-fly']}
                  onComplete={() => addLog('[HOST EVENT] Completed 2-Choice Think Riddle')}
                />
              )}

              {activeActivityId === 'find-hidden-butterfly' && (
                <Find
                  {...ACTIVITY_DATA['find-hidden-butterfly']}
                  onTargetFound={() => addLog('[HOST EVENT] onTargetFound: Golden Butterfly')}
                  onDistractorTap={(d) => addLog(`[HOST EVENT] onDistractorTap: ${d.label}`)}
                  onComplete={() => addLog('[HOST EVENT] Completed Secret Garden Find Quest')}
                />
              )}

              {activeActivityId === 'find-ocean-pearl' && (
                <Find
                  {...ACTIVITY_DATA['find-ocean-pearl']}
                  onTargetFound={() => addLog('[HOST EVENT] onTargetFound: Glowing Pearl')}
                  onDistractorTap={(d) => addLog(`[HOST EVENT] onDistractorTap: ${d.label}`)}
                  onComplete={() => addLog('[HOST EVENT] Completed Deep Ocean Pearl Find Quest')}
                />
              )}

              {activeActivityId === 'listen-find-fruits' && (
                <ListenAndFind
                  {...ACTIVITY_DATA['listen-find-fruits']}
                  onCorrect={(d) => addLog(`[HOST EVENT] onCorrect: ${d.selectedId}`)}
                  onIncorrect={(d) => addLog(`[HOST EVENT] onIncorrect: ${d.selectedId}`)}
                  onComplete={() => addLog('[HOST EVENT] Completed Fruit Harvest Quest')}
                />
              )}

              {activeActivityId === 'listen-find-animals' && (
                <ListenAndFind
                  {...ACTIVITY_DATA['listen-find-animals']}
                  onCorrect={(d) => addLog(`[HOST EVENT] onCorrect: ${d.selectedId}`)}
                  onIncorrect={(d) => addLog(`[HOST EVENT] onIncorrect: ${d.selectedId}`)}
                  onComplete={() => addLog('[HOST EVENT] Completed Jungle Safari Calls')}
                />
              )}

              {activeActivityId === 'new-word-giraffe' && (
                <NewWord
                  {...ACTIVITY_DATA['new-word-giraffe']}
                  onComplete={() => addLog('[HOST EVENT] Completed Spotlight: Giraffe')}
                />
              )}

              {activeActivityId === 'new-word-telescope' && (
                <NewWord
                  {...ACTIVITY_DATA['new-word-telescope']}
                  onComplete={() => addLog('[HOST EVENT] Completed Spotlight: Telescope')}
                />
              )}

              {activeActivityId === 'read-kitten' && (
                <Read
                  {...ACTIVITY_DATA['read-kitten']}
                  onComplete={() => addLog('[HOST EVENT] Completed Playful Kitten Story')}
                />
              )}

              {activeActivityId === 'read-rocket' && (
                <Read
                  {...ACTIVITY_DATA['read-rocket']}
                  onComplete={() => addLog('[HOST EVENT] Completed Rocket Journey Story')}
                />
              )}

              {activeActivityId === 'opposites-big-small' && (
                <Opposites
                  {...ACTIVITY_DATA['opposites-big-small']}
                  onComplete={() => addLog('[HOST EVENT] Completed Big vs Small')}
                />
              )}

              {activeActivityId === 'opposites-hot-cold' && (
                <Opposites
                  {...ACTIVITY_DATA['opposites-hot-cold']}
                  onComplete={() => addLog('[HOST EVENT] Completed Hot vs Cold')}
                />
              )}

              {activeActivityId === 'match-animal-food' && (
                <Match
                  {...ACTIVITY_DATA['match-animal-food']}
                  onComplete={() => addLog('[HOST EVENT] Completed Animal Treat Match')}
                />
              )}

              {activeActivityId === 'match-parent-baby' && (
                <Match
                  {...ACTIVITY_DATA['match-parent-baby']}
                  onComplete={() => addLog('[HOST EVENT] Completed Parent & Baby Match')}
                />
              )}

              {activeActivityId === 'think-day-night' && (
                <Think
                  {...ACTIVITY_DATA['think-day-night']}
                  onComplete={() => addLog('[HOST EVENT] Completed Day & Night Think Puzzle')}
                />
              )}

              {activeActivityId === 'think-shape-sequence' && (
                <Think
                  {...ACTIVITY_DATA['think-shape-sequence']}
                  onComplete={() => addLog('[HOST EVENT] Completed Gem Rhythm Think Puzzle')}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Host Event Console */}
      <footer className="w-full max-w-5xl mt-10 bg-slate-900 text-slate-200 rounded-2xl p-4 shadow-xl border border-slate-700 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <Terminal className="w-4 h-4" />
            <span>Host Runtime Event Bus:</span>
          </div>
          <span className="text-slate-500">15 Modeled Activities</span>
        </div>
        <div className="h-16 overflow-y-auto space-y-1 text-slate-300">
          {eventLogs.map((log, index) => (
            <div key={index}>{log}</div>
          ))}
        </div>
      </footer>
    </div>
  );
}

export default App;
