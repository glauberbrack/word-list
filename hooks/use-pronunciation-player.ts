import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import * as Speech from 'expo-speech';
import { useCallback, useEffect, useState } from 'react';

import {
  estimateSpeechDurationMs,
  SPEECH_LANGUAGE,
  toPlaybackProgress,
} from '@/core/domain/pronunciation';

const PROGRESS_UPDATE_INTERVAL_MS = 100;
const SPEECH_PROGRESS_CEILING = 0.95;

function useSpeech(word: string) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isSpeaking) return;

    const startedAt = Date.now();
    const duration = estimateSpeechDurationMs(word);
    const interval = setInterval(() => {
      setProgress(Math.min((Date.now() - startedAt) / duration, SPEECH_PROGRESS_CEILING));
    }, PROGRESS_UPDATE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isSpeaking, word]);

  useEffect(() => {
    return () => {
      void Speech.stop();
    };
  }, []);

  const toggle = useCallback(() => {
    if (isSpeaking) {
      void Speech.stop();
      return;
    }

    setProgress(0);
    Speech.speak(word, {
      language: SPEECH_LANGUAGE,
      onStart: () => setIsSpeaking(true),
      onDone: () => {
        setIsSpeaking(false);
        setProgress(1);
      },
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  }, [isSpeaking, word]);

  return { isSpeaking, progress, toggle };
}

export function usePronunciationPlayer(
  word: string,
  audioUrl: string | null,
): TPronunciationPlayer {
  const player = useAudioPlayer(audioUrl ? { uri: audioUrl } : null, {
    updateInterval: PROGRESS_UPDATE_INTERVAL_MS,
  });
  const status = useAudioPlayerStatus(player);
  const speech = useSpeech(word);

  useEffect(() => {
    void setAudioModeAsync({ playsInSilentMode: true });
  }, []);

  const toggleAudio = useCallback(() => {
    if (status.playing) {
      player.pause();
      return;
    }

    if (status.duration > 0 && status.currentTime >= status.duration) void player.seekTo(0);
    player.play();
  }, [player, status.playing, status.currentTime, status.duration]);

  if (!audioUrl || status.error) {
    return {
      source: audioUrl ? 'speech-unavailable' : 'speech-missing',
      isPlaying: speech.isSpeaking,
      progress: speech.progress,
      toggle: speech.toggle,
    };
  }

  return {
    source: 'audio',
    isPlaying: status.playing,
    progress: toPlaybackProgress(status.currentTime, status.duration),
    toggle: toggleAudio,
  };
}
