# Learning Path Primitives

Modular, reusable UI game interaction primitives for children's learning paths, decoupled from curriculum content.

## Architecture

Every primitive template implements the platform's unified three-layer modal architecture:
1. **Audio Layer**: Primary prompt/instruction audio (with on-demand replay support) plus supplemental feedback audio cues (chimes, descending cues).
2. **Visual Layer**: Touch-friendly, accessible interactive target assets with responsive micro-animations, celebration effects, and gentle recovery wobbles.
3. **Text Layer**: Supporting captions and highlighted prompts for dual-coding reading reinforcement.

## Primitives Included

### `ListenAndFind` (`src/primitives/listen-and-find/`)
- **Props**:
  - `promptAudio`: string (spoken instruction)
  - `textCaption`: string (visual caption text)
  - `choices`: `ChoiceItem[]` (array of visual assets/emojis/images)
  - `correctChoiceId`: string (target answer)
  - Lifecycle callbacks: `onCorrect`, `onIncorrect`, `onComplete`, `onAudioStateChange`
- **Mechanics**:
  - Autoplays prompt with animated speaker indicator.
  - On asset tap, validates target.
  - Non-punitive feedback: incorrect choice wobbles and dims; allows subsequent retries without resetting audio or score penalties.
  - Correct choice triggers celebratory scale animation, positive audio chime, and emits `onComplete`.

## Standalone Prototypes

A standalone, zero-dependency browser prototype is also available at:
[`scratch/prototypes/listen-and-find/index.html`](file:///home/sudhirmi/.gemini/antigravity-cli/scratch/prototypes/listen-and-find/index.html)
