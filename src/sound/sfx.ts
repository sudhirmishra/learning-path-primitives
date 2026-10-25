class SoundEffectsEngine {
  private ctx: AudioContext | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private voicesLoaded = false;
  private currentAudioElement: HTMLAudioElement | null = null;
  private activeUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.voices = window.speechSynthesis.getVoices();
    if (this.voices.length > 0) {
      this.voicesLoaded = true;
    }
  }

  /**
   * Intelligently selects the warmest, most natural sounding English voice
   * prioritizing neural/natural voices from Google, Apple, and Microsoft.
   */
  private getBestVoice(): SpeechSynthesisVoice | null {
    if (!this.voicesLoaded) {
      this.loadVoices();
    }
    if (this.voices.length === 0) return null;

    const preferredPatterns = [
      /natural/i,
      /google.*english/i,
      /google us english/i,
      /google uk english female/i,
      /microsoft.*(jenny|aria|guy|ana)/i,
      /samantha/i,
      /victoria/i,
      /karen/i,
      /moira/i,
      /tessa/i,
    ];

    const englishVoices = this.voices.filter((v) =>
      v.lang.startsWith('en') || v.lang.startsWith('en_')
    );

    for (const pattern of preferredPatterns) {
      const match = englishVoices.find((v) => pattern.test(v.name));
      if (match) return match;
    }

    const nonRobotic = englishVoices.filter((v) => !v.name.toLowerCase().includes('espeak'));
    if (nonRobotic.length > 0) {
      return nonRobotic[0];
    }

    return englishVoices[0] || this.voices[0] || null;
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playCorrectChime(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const notes = [
      { freq: 523.25, time: 0 },
      { freq: 659.25, time: 0.08 },
      { freq: 783.99, time: 0.16 },
      { freq: 1046.50, time: 0.24 },
    ];

    notes.forEach(({ freq, time }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + time);

      gain.gain.setValueAtTime(0, now + time);
      gain.gain.linearRampToValueAtTime(0.3, now + time + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + time + 0.55);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + time);
      osc.stop(now + time + 0.58);

      const overtone = ctx.createOscillator();
      const overGain = ctx.createGain();
      overtone.type = 'triangle';
      overtone.frequency.setValueAtTime(freq * 2, now + time);
      overGain.gain.setValueAtTime(0.08, now + time);
      overGain.gain.exponentialRampToValueAtTime(0.0001, now + time + 0.25);

      overtone.connect(overGain);
      overGain.connect(ctx.destination);
      overtone.start(now + time);
      overtone.stop(now + time + 0.28);
    });
  }

  playIncorrectBoing(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.28);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  }

  /**
   * Speaks prompt text or plays audio file.
   * Supports `onBoundary` for word-by-word synchronized highlighting.
   */
  speakPrompt(
    audioSourceOrText: string,
    onEnd?: () => void,
    onBoundary?: (charIndex: number, wordLength?: number) => void
  ): void {
    if (!audioSourceOrText) {
      onEnd?.();
      return;
    }

    this.stopVoice();

    // Check if input is a real audio file URL
    const isAudioFile = /\.(mp3|wav|ogg|m4a|aac)(\?.*)?$/i.test(audioSourceOrText);

    if (isAudioFile) {
      try {
        const audio = new Audio(audioSourceOrText);
        this.currentAudioElement = audio;
        audio.onended = () => {
          this.currentAudioElement = null;
          onEnd?.();
        };
        audio.onerror = () => {
          this.currentAudioElement = null;
          onEnd?.();
        };
        audio.play().catch(() => {
          onEnd?.();
        });
        return;
      } catch {
        // Fall back to synthesis
      }
    }

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) setTimeout(onEnd, 1200);
      return;
    }

    // Resume speech synthesis if paused by browser
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const utterance = new SpeechSynthesisUtterance(audioSourceOrText);
    this.activeUtterance = utterance;

    const bestVoice = this.getBestVoice();
    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    utterance.rate = 0.86;
    utterance.pitch = 1.15;

    // Word boundary event for precise read-along highlighting
    if (onBoundary) {
      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          onBoundary(event.charIndex, event.charLength);
        }
      };
    }

    utterance.onend = () => {
      this.activeUtterance = null;
      onEnd?.();
    };

    utterance.onerror = () => {
      this.activeUtterance = null;
      onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  }

  stopVoice(): void {
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement.currentTime = 0;
      this.currentAudioElement = null;
    }
    this.activeUtterance = null;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const sfx = new SoundEffectsEngine();
