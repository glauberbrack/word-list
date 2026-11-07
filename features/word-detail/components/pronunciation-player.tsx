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

export function PronunciationPlayer({ word, audioUrl }: TPronunciationPlayerProps) {
  const { source, isPlaying, progress, toggle } = usePronunciationPlayer(word, audioUrl);

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isPlaying ? 'Pausar pronúncia' : 'Ouvir pronúncia'}
        hitSlop={spacing.sm}
        onPress={toggle}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <Ionicons name={isPlaying ? 'pause' : 'play'} size={22} color={colors.background} />
      </Pressable>
      <View style={styles.info}>
        <View
          style={styles.track}
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 0, max: 100, now: Math.round(progress * 100) }}
        >
          <View style={[styles.fill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.caption}>{SOURCE_LABELS[source]}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  button: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: colors.primary,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  info: {
    flex: 1,
    gap: spacing.xs,
  },
  track: {
    height: 6,
    overflow: 'hidden',
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
  },
  fill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  caption: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
