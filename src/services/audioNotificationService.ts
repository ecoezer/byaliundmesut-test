class AudioNotificationService {
  private audio: HTMLAudioElement | null = null;
  private isPlaying = false;
  private isMuted = false;
  private volume = 0.7;
  private isInitialized = false;
  private initializationError: string | null = null;

  initialize(): void {
    if (this.isInitialized) return;

    try {
      this.audio = new Audio('/notification.mp3');
      this.audio.loop = true;
      this.audio.volume = this.volume;
      this.isInitialized = true;
      this.initializationError = null;
      console.log('Audio notification service initialized successfully');
    } catch (error) {
      this.initializationError = 'Failed to initialize audio';
      console.error('Error initializing audio:', error);
    }
  }

  async play(): Promise<void> {
    if (this.isPlaying || this.isMuted) return;

    if (!this.isInitialized || !this.audio) {
      console.warn('Audio service not initialized. Call initialize() first.');
      return;
    }

    if (this.initializationError) {
      console.error('Cannot play audio:', this.initializationError);
      return;
    }

    try {
      this.isPlaying = true;
      this.audio.currentTime = 0;
      await this.audio.play();
      console.log('Audio notification started');
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
    if (!this.audio) return;

    this.isPlaying = false;
    this.audio.pause();
    this.audio.currentTime = 0;
    console.log('Audio notification stopped');
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.audio) {
      this.audio.volume = this.volume;
    }
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
    if (!this.isInitialized || !this.audio) {
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
      const testAudio = new Audio('/notification.mp3');
      testAudio.volume = this.volume;
      await testAudio.play();
      setTimeout(() => {
        testAudio.pause();
        testAudio.currentTime = 0;
      }, 1000);
    } catch (error) {
      console.error('Error testing audio:', error);
    }
  }
}

export const audioNotificationService = new AudioNotificationService();
