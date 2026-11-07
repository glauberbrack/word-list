import { PlaceholderScreen } from '@/components/ui/placeholder-screen';

type TWordDetailScreenProps = {
  word: string;
};

export function WordDetailScreen({ word }: TWordDetailScreenProps) {
  return <PlaceholderScreen title={word} description="Detalhe da palavra chega na fase 2." />;
}
