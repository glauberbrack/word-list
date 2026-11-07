import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme';

type TMeaningsListProps = {
  meanings: TMeaning[];
};

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function MeaningsList({ meanings }: TMeaningsListProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title} accessibilityRole="header">
        Meanings
      </Text>
      {meanings.map((meaning) => (
        <View key={meaning.partOfSpeech} style={styles.meaning}>
          <Text style={styles.partOfSpeech}>{capitalize(meaning.partOfSpeech)}</Text>
          {meaning.definitions.map((item, index) => (
            <View key={`${meaning.partOfSpeech}-${index}`} style={styles.definition}>
              <Text style={styles.definitionText}>
                {index + 1}. {item.definition}
              </Text>
              {item.example ? <Text style={styles.example}>“{item.example}”</Text> : null}
            </View>
          ))}
          {meaning.synonyms.length > 0 ? (
            <Text style={styles.synonyms}>Synonyms: {meaning.synonyms.join(', ')}</Text>
          ) : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  title: {
    ...typography.heading,
    color: colors.text,
  },
  meaning: {
    gap: spacing.sm,
  },
  partOfSpeech: {
    ...typography.label,
    color: colors.primary,
  },
  definition: {
    gap: spacing.xs,
  },
  definitionText: {
    ...typography.body,
    color: colors.text,
  },
  example: {
    ...typography.caption,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  synonyms: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
