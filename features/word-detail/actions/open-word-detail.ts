import { router } from 'expo-router';

export function openWordDetail(link: TWordLink, source: TWordSource) {
  router.push({
    pathname: '/word/[word]',
    params: {
      word: link.word,
      source,
      ...(link.id !== undefined && { id: String(link.id) }),
    },
  });
}

export function replaceWordDetail(link: TWordLink) {
  router.setParams({ word: link.word, id: link.id !== undefined ? String(link.id) : undefined });
}
