declare type TPronunciationSource = 'audio' | 'speech-missing' | 'speech-unavailable';

declare type TPronunciationPlayer = {
  source: TPronunciationSource;
  isPlaying: boolean;
  progress: number;
  toggle(): void;
};
