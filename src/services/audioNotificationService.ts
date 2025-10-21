class AudioNotificationService {
  private audio: HTMLAudioElement | null = null;
  private isPlaying = false;
  private isMuted = false;
  private volume = 0.7;

  initialize(): void {
    if (!this.audio) {
      this.audio = new Audio('/notification.mp3');
      this.audio.loop = true;
      this.audio.volume = this.volume;
    }
  }

  play(): void {
    if (!this.audio || this.isPlaying || this.isMuted) return;

    this.audio.play()
      .then(() => {
        this.isPlaying = true;
      })
      .catch((error) => {
        if (error.name === 'NotAllowedError') {
          console.warn('Audio playback requires user interaction first');
        } else {
          console.error('Error playing audio:', error);
        }
      });
  }

  stop(): void {
    if (!this.audio || !this.isPlaying) return;

    this.audio.pause();
    this.audio.currentTime = 0;
    this.isPlaying = false;
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

  test(): void {
    if (!this.audio) return;

    const wasPlaying = this.isPlaying;
    if (wasPlaying) {
      this.stop();
    }

    const testAudio = new Audio(this.audio.src);
    testAudio.volume = this.volume;
    testAudio.play().catch((error) => {
      console.error('Error testing audio:', error);
    });
  }
}

export const audioNotificationService = new AudioNotificationService();
