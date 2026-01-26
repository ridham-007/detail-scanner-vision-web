"use client";
// Sound effects utility using Web Audio API
class SoundEffects {
  private audioContext: AudioContext | null = null;

  constructor() {
    // Don't initialize here - wait until first use on client
  }

  private initializeAudioContext() {
    // Only run on client
    if (typeof window === 'undefined') return;

    try {
      this.audioContext = new (
        window.AudioContext ||
        (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      )();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  private async ensureAudioContext() {
    // Only initialize on client when actually needed
    if (typeof window === 'undefined') return;

    if (!this.audioContext) {
      this.initializeAudioContext();
    }

    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  // Play a correct answer sound (ascending chime)
  async playCorrectAnswer() {
    await this.ensureAudioContext();
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Create a pleasant ascending tone
    oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, this.audioContext.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, this.audioContext.currentTime + 0.2); // G5

    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.5);
  }

  // Play a wrong answer sound (dramatic buzzer sequence)
  async playWrongAnswer() {
    await this.ensureAudioContext();
    if (!this.audioContext) return;

    // Create a more dramatic wrong answer sound with multiple tones
    const frequencies = [300, 250, 200, 150]; // Descending sequence

    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        // Each tone gets progressively lower and more distorted
        oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(freq * 0.7, this.audioContext.currentTime + 0.15);

        // Use square wave for more harsh, buzzer-like sound
        oscillator.type = 'square';

        // Volume decreases with each tone but still audible
        gainNode.gain.setValueAtTime(0.25 - (index * 0.05), this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.15);
      }, index * 80); // Stagger each tone by 80ms for dramatic effect
    });
  }

  // Play a button click sound
  async playButtonClick() {
    await this.ensureAudioContext();
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
    oscillator.type = 'square';
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }

  // Play a tick sound for countdown
  async playTick() {
    await this.ensureAudioContext();
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
    oscillator.type = 'square';
    gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.05);
  }

  // Play warning sound when time is running low
  async playWarning() {
    await this.ensureAudioContext();
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
    oscillator.frequency.setValueAtTime(880, this.audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime + 0.2);

    oscillator.type = 'triangle';
    gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  // Play quiz completion sound (fanfare)
  async playQuizComplete() {
    await this.ensureAudioContext();
    if (!this.audioContext) return;

    // Create a simple fanfare with multiple tones
    const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        this.playNote(freq, 0.2, 'sine');
      }, index * 100);
    });
  }

  private async playNote(frequency: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = type;
    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }
}

// Create a singleton instance - safe now because constructor doesn't access window
export const soundEffects = new SoundEffects();