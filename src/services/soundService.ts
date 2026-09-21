import { GentleToneType } from '../types';

class SoundService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Toca un cuenco tibetano suave y profundo
   */
  public playTibetanBowl(volume: number = 0.3) {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const frequencies = [216, 432, 648];
    const gains = [0.6, 0.3, 0.1];

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(gains[idx] * volume, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 4.6);
    });
  }

  /**
   * Toca una campana zen clara
   */
  public playZenChime(volume: number = 0.25) {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const freqs = [880, 1320, 1760];
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume / (i + 1), now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 2.6);
    });
  }

  /**
   * Toca arpegio suave de arpa
   */
  public playGentleHarp(volume: number = 0.25) {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const notes = [349.23, 440.0, 523.25, 659.25, 698.46]; // F4, A4, C5, E5, F5
    const now = ctx.currentTime;

    notes.forEach((freq, index) => {
      const noteTime = now + index * 0.12;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0, noteTime);
      gain.gain.linearRampToValueAtTime(volume * 0.7, noteTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 2.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 2.3);
    });
  }

  /**
   * Sonido suave de ola o brisa relajante
   */
  public playOceanWave(volume: number = 0.2) {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(260, now + 1.5);
    osc.frequency.exponentialRampToValueAtTime(120, now + 3.8);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume * 0.6, now + 1.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.9);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 4.0);
  }

  /**
   * Toca el tono configurado para recordatorios
   */
  public playConfiguredTone(tone: GentleToneType, volume: number = 0.3) {
    switch (tone) {
      case 'campana_zen':
        this.playZenChime(volume);
        break;
      case 'arpa_suave':
        this.playGentleHarp(volume);
        break;
      case 'ola_mar':
        this.playOceanWave(volume);
        break;
      case 'tazon_tibetano':
      default:
        this.playTibetanBowl(volume);
        break;
    }
  }

  /**
   * Suave tono guía al cambiar de fase de respiración
   */
  public playPhaseCue(phase: 'inhala' | 'sosten' | 'exhala' | 'reposa') {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    
    // Tonalidad según la fase
    if (phase === 'inhala') {
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(587.33, now + 0.3); // Ascendente A4 -> D5
    } else if (phase === 'sosten') {
      osc.frequency.setValueAtTime(587.33, now); // Constante calma
    } else if (phase === 'exhala') {
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.exponentialRampToValueAtTime(392, now + 0.35); // Descendente D5 -> G4
    } else {
      osc.frequency.setValueAtTime(329.63, now); // E4 reposo
    }

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.85);

    // Haptic feedback suave si está disponible
    this.triggerHaptic([30]);
  }

  /**
   * Fanfarria serena al completar 1 minuto
   */
  public playCompletionChime() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const chord = [392.00, 493.88, 587.33, 783.99]; // G4, B4, D5, G5
    const now = ctx.currentTime;

    chord.forEach((freq, idx) => {
      const t = now + idx * 0.14;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.2, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 2.5);
    });

    this.triggerHaptic([50, 40, 70]);
  }

  public triggerHaptic(pattern: number[] = [40]) {
    if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignorar si el navegador bloquea vibraciones
      }
    }
  }
}

export const soundService = new SoundService();
