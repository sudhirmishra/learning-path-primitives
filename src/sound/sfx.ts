class SoundEffectsEngine {
  private ctx: AudioContext | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private voicesLoaded = false;
  private currentAudioElement: HTMLAudioElement | null = null;

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

    // Preferred natural, neural, and child-friendly voice names
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

    // 1. Check preferred high-quality natural voices
    for (const pattern of preferredPatterns) {
      const match = englishVoices.find((v) => pattern.test(v.name));
      if (match) return match;
    }

    // 2. Reject known robotic low-quality fallbacks (like eSpeak) if alternatives exist
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

  /**
   * Warm marimba / glockenspiel-style celebration chord with harmonics
   */
  playCorrectChime(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // C-major cheerful arpeggio (C5, E5, G5, C6) with warm harmonic decay
    const notes = [
      { freq: 523.25, time: 0 },
      { freq: 659.25, time: 0.08 },
      { freq: 783.99, time: 0.16 },
      { freq: 1046.50, time: 0.24 },
    ];

    notes.forEach(({ freq, time }) => {
      // Fundamental tone (sine for warmth)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + time);

      // Gentle bell strike attack, exponential soft decay
      gain.gain.setValueAtTime(0, now + time);
      gain.gain.linearRampToValueAtTime(0.3, now + time + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + time + 0.55);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + time);
      osc.stop(now + time + 0.58);

      // Soft harmonic overtone (triangle wave an octave up)
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

  /**
   * Gentle, friendly cartoon boing (non-punitive)
   */
  playIncorrectBoing(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Friendly pitch drop mimicking a soft spring
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
   * Hybrid vocal prompt playback:
   * 1. If audioSource is an audio file URL (.mp3, .wav, .ogg, etc.), plays real audio.
   * 2. Otherwise, uses speech synthesis with natural voice selection, gentle rate, and expressive pitch.
   */
  speakPrompt(audioSourceOrText: string, onEnd?: () => void): void {
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
        // Fall back to synthesis if audio file playback fails
      }
    }

    // Speech synthesis fallback
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) setTimeout(onEnd, 1200);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(audioSourceOrText);
    const bestVoice = this.getBestVoice();
    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    // Kid-friendly speech cadence: slightly slower for comprehension, warmer pitch
    utterance.rate = 0.88;
    utterance.pitch = 1.18;

    utterance.onend = () => {
      onEnd?.();
    };
    utterance.onerror = () => {
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
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const sfx = new SoundEffectsEngine();
