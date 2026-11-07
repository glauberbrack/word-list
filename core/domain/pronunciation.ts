export const SPEECH_LANGUAGE = 'en-US';

const ACCENT_PREFERENCE = ['-us.', '-uk.', '-au.'];
const SPEECH_BASE_DURATION_MS = 600;
const SPEECH_DURATION_PER_LETTER_MS = 80;

export function pickPronunciationAudio(phonetics: TPhonetic[]): string | null {
  const urls = phonetics
    .map((phonetic) => phonetic.audioUrl)
    .filter((url): url is string => url !== null);

  for (const accent of ACCENT_PREFERENCE) {
    const match = urls.find((url) => url.includes(accent));
    if (match) return match;
  }

  return urls.at(0) ?? null;
}

export function estimateSpeechDurationMs(word: string): number {
  return SPEECH_BASE_DURATION_MS + word.length * SPEECH_DURATION_PER_LETTER_MS;
}

export function toPlaybackProgress(currentTime: number, duration: number): number {
  if (duration <= 0) return 0;

  return Math.min(Math.max(currentTime / duration, 0), 1);
}
