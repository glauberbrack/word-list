import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { usePronunciationPlayer } from '@/hooks/use-pronunciation-player';
import { colors, radius, spacing, typography } from '@/theme';

type TPronunciationPlayerProps = {
  word: string;
  audioUrl: string | null;
};

const SOURCE_LABELS: Record<TPronunciationSource, string> = {
  audio: 'Pronúncia da Free Dictionary API',
  'speech-missing': 'Sem áudio na API: voz do aparelho',
  'speech-unavailable': 'Áudio da API indisponível: voz do aparelho',
};

const BAR_COUNT = 26;
const BAR_HEIGHTS = Array.from({ length: BAR_COUNT }, (_, index) =>
  Math.round(8 + Math.abs(Math.sin(index * 1.7)) * 18),
);
const BUTTON_SIZE = 36;

export function PronunciationPlayer({ word, audioUrl }: TPronunciationPlayerProps) {
  const { source, isPlaying, progress, toggle } = usePronunciationPlayer(word, audioUrl);
  const playedBars = Math.round(progress * BAR_COUNT);

  return (
    <View>
      <View style={styles.player}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? 'Pausar pronúncia' : 'Ouvir pronúncia'}
          hitSlop={spacing.sm}
          onPress={toggle}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={16} color={colors.card} />
        </Pressable>
        <View
          style={styles.wave}
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 0, max: 100, now: Math.round(progress * 100) }}
        >
          {BAR_HEIGHTS.map((height, index) => (
            <View
              key={index}
              style={[
                styles.bar,
                {
                  height,
                  backgroundColor: index < playedBars ? colors.primary : colors.primaryTrack,
                },
              ]}
            />
          ))}
        </View>
      </View>
      <Text style={styles.caption}>{SOURCE_LABELS[source]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  player: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md - 4,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md - 4,
    borderRadius: radius.lg,
    backgroundColor: colors.background,
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  wave: {
    flex: 1,
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bar: {
    width: 4,
    borderRadius: 2,
  },
  caption: {
    ...typography.micro,
    fontSize: 12,
    color: colors.textSubtle,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
