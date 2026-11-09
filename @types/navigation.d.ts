declare type TWordSource = 'list' | 'history' | 'favorites';

declare type TWordLink = {
  word: string;
  id?: number;
};

declare type TWordGridItem = TWordLink & {
  key: string;
  caption?: string;
};
