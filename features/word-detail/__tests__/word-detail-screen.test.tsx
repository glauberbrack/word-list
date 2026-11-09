import { screen, userEvent } from '@testing-library/react-native';
import { router } from 'expo-router';

import { toWordDetail } from '@/core/domain/dictionary';
import { createFavoritesRepository } from '@/core/storage/favorites.repository';
import { createHistoryRepository } from '@/core/storage/history.repository';
import { useFavoritesStore } from '@/store/favorites.store';
import { useHistoryStore } from '@/store/history.store';
import { helloEntries } from '@/test/fixtures';
import { createMemoryKeyValueStorage } from '@/test/memory-key-value-storage';
import { renderWithProviders } from '@/test/render-with-providers';

import { WordDetailScreen } from '../screens/word-detail-screen';

jest.mock('expo-router', () => ({
  router: { back: jest.fn(), push: jest.fn(), setParams: jest.fn() },
}));

const mockAudioStatus = {
  playing: false,
  currentTime: 0,
  duration: 0,
  error: null as string | null,
};

jest.mock('expo-audio', () => ({
  setAudioModeAsync: jest.fn().mockResolvedValue(undefined),
  useAudioPlayer: () => ({ play: jest.fn(), pause: jest.fn(), seekTo: jest.fn() }),
  useAudioPlayerStatus: () => mockAudioStatus,
}));

jest.mock('expo-speech', () => ({
  speak: jest.fn(),
  stop: jest.fn().mockResolvedValue(undefined),
}));

jest.mock(
  'react-native-safe-area-context',
  () => jest.requireActual('react-native-safe-area-context/jest/mock').default,
);

function setup(getWord: TDictionaryRepository['getWord']) {
  const { storage } = createMemoryKeyValueStorage();
  const enqueue = jest.fn();

  useFavoritesStore.getState().hydrate({
    repository: createFavoritesRepository(storage, 'local'),
    sync: { enqueue },
  });
  useHistoryStore.getState().hydrate({
    repository: createHistoryRepository(storage, 'local'),
    sync: { enqueue },
  });

  const repositories: TRepositories = {
    dictionary: { getWord: jest.fn(getWord) },
    words: {
      getPage: jest.fn(),
      count: jest.fn(),
      getAdjacent: jest.fn(async (id: number, direction: TWordDirection) =>
        direction === 'next' ? { id: id + 1, word: 'help' } : null,
      ),
    },
  };

  return { repositories, enqueue };
}

describe('WordDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAudioStatus.error = null;
  });

  it('mostra fonética e significados da palavra encontrada', async () => {
    const { repositories } = setup(async () => ({
      status: 'found',
      detail: toWordDetail('hello', helloEntries),
    }));

    await renderWithProviders(<WordDetailScreen word="hello" id={1} source="list" />, repositories);

    expect(await screen.findByText('Meanings')).toBeOnTheScreen();
    expect(screen.getByText('/hɛˈləʊ/')).toBeOnTheScreen();
    expect(screen.getByText('1. "Hello!" or an equivalent greeting.')).toBeOnTheScreen();
    expect(screen.getByText('Pronúncia da Free Dictionary API')).toBeOnTheScreen();
  });

  it('usa a voz do aparelho quando o áudio da API falha', async () => {
    mockAudioStatus.error = 'resource unavailable';
    const { repositories } = setup(async () => ({
      status: 'found',
      detail: toWordDetail('hello', helloEntries),
    }));

    await renderWithProviders(<WordDetailScreen word="hello" id={1} source="list" />, repositories);

    expect(await screen.findByText('Áudio da API indisponível: voz do aparelho')).toBeOnTheScreen();
  });

  it('avisa quando a palavra não existe na API', async () => {
    const { repositories } = setup(async () => ({ status: 'not_found' }));

    await renderWithProviders(<WordDetailScreen word="aalii" id={9} source="list" />, repositories);

    expect(
      await screen.findByText('Nenhuma definição encontrada para “aalii” na Free Dictionary API.'),
    ).toBeOnTheScreen();
  });

  it('mostra erro e busca de novo ao tentar outra vez', async () => {
    let online = false;
    const { repositories } = setup(async () => {
      if (!online) throw new Error('Network Error');
      return { status: 'not_found' };
    });
    const user = userEvent.setup();

    await renderWithProviders(<WordDetailScreen word="hello" id={1} source="list" />, repositories);

    const retry = await screen.findByRole('button', { name: 'Tentar de novo' }, { timeout: 5_000 });
    online = true;
    await user.press(retry);

    expect(
      await screen.findByText('Nenhuma definição encontrada para “hello” na Free Dictionary API.'),
    ).toBeOnTheScreen();
    const helloCalls = jest
      .mocked(repositories.dictionary.getWord)
      .mock.calls.filter(([word]) => word === 'hello');
    expect(helloCalls).toHaveLength(3);
  });

  it('registra a palavra no histórico ao abrir', async () => {
    const { repositories } = setup(async () => ({ status: 'not_found' }));

    await renderWithProviders(<WordDetailScreen word="hello" id={1} source="list" />, repositories);

    expect(useHistoryStore.getState().items.hello).toBeDefined();
  });

  it('favorita na hora e enfileira o envio ao servidor', async () => {
    const { repositories, enqueue } = setup(async () => ({ status: 'not_found' }));
    const user = userEvent.setup();

    await renderWithProviders(<WordDetailScreen word="hello" id={1} source="list" />, repositories);

    await user.press(screen.getByRole('button', { name: 'Salvar nos favoritos' }));

    expect(screen.getByRole('button', { name: 'Remover dos favoritos' })).toBeOnTheScreen();
    expect(enqueue).toHaveBeenCalledWith(
      expect.objectContaining({ entity: 'favorite', type: 'upsert', word: 'hello' }),
    );
  });

  it('navega para a próxima palavra da lista e desativa o Voltar no início', async () => {
    const { repositories } = setup(async () => ({ status: 'not_found' }));
    const user = userEvent.setup();

    await renderWithProviders(<WordDetailScreen word="hello" id={1} source="list" />, repositories);

    const next = await screen.findByRole('button', { name: 'Próximo' });
    await screen.findByText('Nenhuma definição encontrada para “hello” na Free Dictionary API.');

    expect(screen.getByRole('button', { name: 'Voltar' })).toBeDisabled();

    await user.press(next);

    expect(router.setParams).toHaveBeenCalledWith({ word: 'help', id: '2' });
  });
});
