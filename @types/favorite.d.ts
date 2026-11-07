declare type TFavorite = {
  word: string;
  createdAt: number;
  updatedAt: number;
  deleted: boolean;
};

declare type TFavoritesRepository = {
  getAll(): Record<string, TFavorite>;
  save(item: TFavorite): void;
};
