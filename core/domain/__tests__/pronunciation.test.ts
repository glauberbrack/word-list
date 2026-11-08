import { pickPronunciationAudio, toPlaybackProgress } from '../pronunciation';

const phonetic = (audioUrl: string | null): TPhonetic => ({ text: null, audioUrl });

describe('pickPronunciationAudio', () => {
  it('prefere o áudio americano', () => {
    expect(pickPronunciationAudio([phonetic('x/hello-uk.mp3'), phonetic('x/hello-us.mp3')])).toBe(
      'x/hello-us.mp3',
    );
  });

  it('cai para britânico e depois para o primeiro disponível', () => {
    expect(pickPronunciationAudio([phonetic('x/hello-au.mp3'), phonetic('x/hello-uk.mp3')])).toBe(
      'x/hello-uk.mp3',
    );
    expect(pickPronunciationAudio([phonetic(null), phonetic('x/hello.mp3')])).toBe('x/hello.mp3');
  });

  it('retorna null quando não há áudio', () => {
    expect(pickPronunciationAudio([phonetic(null)])).toBeNull();
    expect(pickPronunciationAudio([])).toBeNull();
  });
});

describe('toPlaybackProgress', () => {
  it('calcula a fração tocada e limita entre 0 e 1', () => {
    expect(toPlaybackProgress(0.5, 2)).toBe(0.25);
    expect(toPlaybackProgress(3, 2)).toBe(1);
    expect(toPlaybackProgress(1, 0)).toBe(0);
  });
});
