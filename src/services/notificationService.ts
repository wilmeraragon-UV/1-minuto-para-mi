import { ReminderConfig, WorkShift } from '../types';
import { soundService } from './soundService';

export const DEFAULT_REMINDER_CONFIG: ReminderConfig = {
  enabled: true,
  frequencyMinutes: 60, // Cada 60 minutos
  shift: 'administrativo',
  customStart: '07:00',
  customEnd: '19:00',
  soundEnabled: true,
  browserNotifications: false,
  gentleTone: 'tazon_tibetano',
  vibrateEnabled: true,
  nextReminderTimestamp: null,
  lastCompletedTimestamp: null,
};

const STORAGE_KEY = 'huv_un_minuto_reminder_cfg_v1';

export class NotificationService {
  public static loadConfig(): ReminderConfig {
    if (typeof window === 'undefined') return DEFAULT_REMINDER_CONFIG;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_REMINDER_CONFIG, ...JSON.parse(stored) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_REMINDER_CONFIG;
  }

  public static saveConfig(cfg: ReminderConfig): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
    } catch (e) {
      console.warn('Error saving reminder config', e);
    }
  }

  public static async requestBrowserPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }
    if (Notification.permission === 'granted') {
      return true;
    }
    if (Notification.permission !== 'denied') {
      const status = await Notification.requestPermission();
      return status === 'granted';
    }
    return false;
  }

  public static isWithinShiftHours(shift: WorkShift, customStart?: string, customEnd?: string): boolean {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const totalMinutesNow = currentHour * 60 + currentMinutes;

    switch (shift) {
      case 'manana': // 07:00 a 13:00
        return totalMinutesNow >= 7 * 60 && totalMinutesNow < 13 * 60;
      case 'tarde': // 13:00 a 19:00
        return totalMinutesNow >= 13 * 60 && totalMinutesNow < 19 * 60;
      case 'noche': // 19:00 a 07:00 (cruza medianoche)
        return totalMinutesNow >= 19 * 60 || totalMinutesNow < 7 * 60;
      case 'administrativo': // 08:00 a 17:00
        return totalMinutesNow >= 8 * 60 && totalMinutesNow < 17 * 60;
      case 'personalizado':
        if (!customStart || !customEnd) return true;
        const [startH, startM] = customStart.split(':').map(Number);
        const [endH, endM] = customEnd.split(':').map(Number);
        const startTotal = (startH || 0) * 60 + (startM || 0);
        const endTotal = (endH || 0) * 60 + (endM || 0);

        if (startTotal <= endTotal) {
          return totalMinutesNow >= startTotal && totalMinutesNow <= endTotal;
        } else {
          // Cruza medianoche
          return totalMinutesNow >= startTotal || totalMinutesNow <= endTotal;
        }
      default:
        return true;
    }
  }

  public static sendGentleAlert(cfg: ReminderConfig, onAction?: () => void) {
    // 1. Tocar tono suave si está activado
    if (cfg.soundEnabled) {
      soundService.playConfiguredTone(cfg.gentleTone, 0.4);
    }

    // 2. Vibración táctil si el dispositivo lo soporta
    if (cfg.vibrateEnabled) {
      soundService.triggerHaptic([100, 80, 100]);
    }

    // 3. Notificación nativa del navegador si está concedida
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        const notif = new Notification('1 minuto para ti • HUV', {
          body: 'Pausa consciente: Respira hondo, suelta la tensión de tus hombros y renueva tu energía para seguir cuidando vidas.',
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: 'huv-mindful-minute',
        });
        notif.onclick = () => {
          window.focus();
          notif.close();
          if (onAction) onAction();
        };
      } catch (err) {
        console.warn('Could not trigger notification', err);
      }
    }
  }
}
