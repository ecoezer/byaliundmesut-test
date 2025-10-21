class AudioNotificationService {
  private audioContext: AudioContext | null = null;
  private isPlaying = false;
  private isMuted = false;
  private volume = 0.7;
  private oscillatorInterval: number | null = null;
  private isInitialized = false;
  private initializationError: string | null = null;

  initialize(): void {
    if (this.isInitialized) return;

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.isInitialized = true;
      this.initializationError = null;
      console.log('Audio notification service initialized successfully');
    } catch (error) {
      this.initializationError = 'Failed to initialize audio context';
      console.error('Error initializing audio context:', error);
    }
  }

  private playBeep(frequency: number, duration: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.audioContext) {
        reject(new Error('Audio context not initialized'));
        return;
      }

      try {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        gainNode.gain.value = this.volume;

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);

        oscillator.onended = () => resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  async play(): Promise<void> {
    if (this.isPlaying || this.isMuted) return;

    if (!this.isInitialized) {
      console.warn('Audio service not initialized. Call initialize() first.');
      return;
    }

    if (this.initializationError) {
      console.error('Cannot play audio:', this.initializationError);
      return;
    }

    try {
      if (this.audioContext?.state === 'suspended') {
        await this.audioContext.resume();
      }

      this.isPlaying = true;

      const playSequence = async () => {
        while (this.isPlaying && !this.isMuted) {
          await this.playBeep(800, 0.2);
          await new Promise(resolve => setTimeout(resolve, 200));
          await this.playBeep(1000, 0.2);
          await new Promise(resolve => setTimeout(resolve, 800));
        }
      };

      playSequence();
    } catch (error) {
      this.isPlaying = false;
      if ((error as any).name === 'NotAllowedError') {
        console.warn('Audio playback requires user interaction first');
      } else {
        console.error('Error playing audio:', error);
      }
    }
  }

  stop(): void {
    this.isPlaying = false;
    if (this.oscillatorInterval) {
      clearInterval(this.oscillatorInterval);
      this.oscillatorInterval = null;
    }
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  getVolume(): number {
    return this.volume;
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.isPlaying) {
      this.stop();
    }
    return this.isMuted;
  }

  isMutedState(): boolean {
    return this.isMuted;
  }

  isPlayingState(): boolean {
    return this.isPlaying;
  }

  getInitializationError(): string | null {
    return this.initializationError;
  }

  async test(): Promise<void> {
    if (!this.isInitialized) {
      console.warn('Audio service not initialized');
      return;
    }

    if (this.initializationError) {
      console.error('Cannot test audio:', this.initializationError);
      return;
    }

    const wasPlaying = this.isPlaying;
    if (wasPlaying) {
      this.stop();
    }

    try {
      if (this.audioContext?.state === 'suspended') {
        await this.audioContext.resume();
      }

      await this.playBeep(800, 0.2);
      await new Promise(resolve => setTimeout(resolve, 200));
      await this.playBeep(1000, 0.2);
    } catch (error) {
      console.error('Error testing audio:', error);
    }
  }
}

export const audioNotificationService = new AudioNotificationService();
