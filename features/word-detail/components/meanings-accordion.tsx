import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, shadows, spacing, typography } from '@/theme';

type TMeaningsAccordionProps = {
  meanings: TMeaning[];
};

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function definitionCount(total: number) {
  return `${total} ${total === 1 ? 'definição' : 'definições'}`;
}

export function MeaningsAccordion({ meanings }: TMeaningsAccordionProps) {
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(meanings.slice(0, 1).map((meaning) => meaning.partOfSpeech)),
  );

  function toggle(partOfSpeech: string) {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(partOfSpeech)) next.delete(partOfSpeech);
      else next.add(partOfSpeech);
      return next;
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title} accessibilityRole="header">
        Meanings
      </Text>
      <View style={styles.card}>
        {meanings.map((meaning, index) => {
          const open = expanded.has(meaning.partOfSpeech);

          return (
            <View
              key={meaning.partOfSpeech}
              style={[styles.row, index < meanings.length - 1 && styles.rowDivider]}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${capitalize(meaning.partOfSpeech)}, ${definitionCount(meaning.definitions.length)}`}
                accessibilityState={{ expanded: open }}
                onPress={() => toggle(meaning.partOfSpeech)}
                style={styles.rowHeader}
              >
                <Text style={styles.rowLabel}>
                  <Text style={styles.partOfSpeech}>{capitalize(meaning.partOfSpeech)}</Text>
                  {` · ${definitionCount(meaning.definitions.length)}`}
                </Text>
                <Ionicons
                  name={open ? 'chevron-down' : 'chevron-forward'}
                  size={18}
                  color={open ? colors.primary : colors.textSubtle}
                />
              </Pressable>
              {open ? (
                <View style={styles.definitions}>
                  {meaning.definitions.map((item, position) => (
                    <View key={`${meaning.partOfSpeech}-${position}`}>
                      <Text style={styles.definition}>
                        {position + 1}. {item.definition}
                      </Text>
                      {item.example ? <Text style={styles.example}>“{item.example}”</Text> : null}
                    </View>
                  ))}
                  {meaning.synonyms.length > 0 ? (
                    <Text style={styles.synonyms}>Synonyms: {meaning.synonyms.join(', ')}</Text>
                  ) : null}
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm + 2,
  },
  title: {
    ...typography.heading,
    color: colors.text,
  },
  card: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.lg + 2,
    backgroundColor: colors.card,
    ...shadows.card,
  },
  row: {
    paddingVertical: spacing.md - 4,
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.primaryTrack,
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLabel: {
    ...typography.body,
    fontSize: 15,
    color: colors.textMuted,
  },
  partOfSpeech: {
    fontWeight: '700',
    color: colors.text,
  },
  definitions: {
    gap: spacing.sm + 2,
    marginTop: spacing.sm + 2,
  },
  definition: {
    ...typography.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
  example: {
    ...typography.caption,
    fontSize: 14,
    fontStyle: 'italic',
    color: colors.primary,
    marginTop: spacing.xs,
  },
  synonyms: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
