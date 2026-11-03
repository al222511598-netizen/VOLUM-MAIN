/**
 * Sintetizador acústico de alta fidelidad para Estación de Servicio ("Ding-Dong" y "Comandero")
 * Funciona mediante Web Audio API nativo: no requiere cargar archivos de audio externos.
 * Incluye auto-desbloqueo en la primera interacción y tonos diferenciados para:
 * - 'waiter': Llamar Mesero (Ding-Dong Sol -> Mi)
 * - 'bill': Pedir Cuenta (Campanilla de caja registradora)
 * - 'order': Nueva Comanda (Arpegio enérgico Do-Mi-Sol-Do de pase de cocina)
 */
class ServiceChime {
  constructor() {
    this.audioCtx = null;
    this.isUnlocked = false;

    // Escuchar el primer toque/clic en cualquier parte de la pantalla para auto-desbloquear el AudioContext
    if (typeof window !== 'undefined') {
      const unlockHandler = () => {
        this.unlock();
        window.removeEventListener('click', unlockHandler);
        window.removeEventListener('touchstart', unlockHandler);
        window.removeEventListener('keydown', unlockHandler);
      };
      window.addEventListener('click', unlockHandler, { once: true, passive: true });
      window.addEventListener('touchstart', unlockHandler, { once: true, passive: true });
      window.addEventListener('keydown', unlockHandler, { once: true, passive: true });
    }
  }

  init() {
    if (typeof window === 'undefined') return;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().then(() => {
        this.isUnlocked = true;
      }).catch(() => {});
    } else if (this.audioCtx && this.audioCtx.state === 'running') {
      this.isUnlocked = true;
    }
  }

  unlock() {
    this.init();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().then(() => {
        this.isUnlocked = true;
      }).catch(() => {});
    }
  }

  playChime(type = 'waiter') {
    try {
      this.init();
      if (!this.audioCtx) return;

      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      // Vibración táctil en celulares (haptic feedback)
      if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        try {
          if (type === 'order') {
            navigator.vibrate([150, 80, 200, 80, 300]);
          } else if (type === 'bill') {
            navigator.vibrate([200, 100, 250]);
          } else {
            navigator.vibrate([180, 90, 180]);
          }
        } catch (_) {}
      }

      if (type === 'order') {
        // Tono de Comanda: Triple campanada brillante de pase de cocina (Do -> Mi -> Sol -> Do agudo)
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const startTime = now + idx * 0.12;

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, startTime);

          gain.gain.setValueAtTime(0, startTime);
          gain.gain.linearRampToValueAtTime(0.35, startTime + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.7);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(startTime);
          osc.stop(startTime + 0.75);
        });
        return;
      }

      // Frecuencias para Asistencia y Cuenta:
      // 'bill': Acorde elegante La -> Re agudo (880Hz -> 1174Hz)
      // 'waiter': Campanada clásica Sol -> Mi (784Hz -> 659Hz)
      const freq1 = type === 'bill' ? 880 : 783.99;
      const freq2 = type === 'bill' ? 1174.66 : 659.25;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(freq1, now);
      osc2.frequency.setValueAtTime(freq2, now + 0.16);

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.45, now + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.25);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.55);

      osc2.start(now + 0.16);
      osc2.stop(now + 1.25);
    } catch (e) {
      console.warn('Audio no disponible o bloqueado por interacción del navegador:', e);
    }
  }
}

export const chime = new ServiceChime();
