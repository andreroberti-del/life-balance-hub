import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '../constants/theme';

type ScoreLevel = 'good' | 'moderate' | 'bad';

interface ScanResultItemProps {
  name: string;
  score: ScoreLevel;
  tag: string;
  style?: ViewStyle;
}

const scoreConfig: Record<ScoreLevel, { color: string; bg: string; label: string }> = {
  good: { color: Colors.lime, bg: Colors.limeBg, label: 'Good' },
  moderate: { color: Colors.orange, bg: Colors.orangeBg, label: 'Moderate' },
  bad: { color: Colors.red, bg: Colors.redBg, label: 'Avoid' },
};

export function ScanResultItem({ name, score, tag, style }: ScanResultItemProps) {
  const config = scoreConfig[score];

  return (
    <View style={[styles.container, style]}>
      <View style={styles.left}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.tag}>{tag}</Text>
      </View>

      <View style={[styles.badge, { backgroundColor: config.bg }]}>
        <View style={[styles.dot, { backgroundColor: config.color }]} />
        <Text style={[styles.badgeText, { color: config.color }]}>
          {config.label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white08,
    borderRadius: Radius.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  left: {
    flex: 1,
    marginRight: Spacing.md,
  },
  name: {
    color: Colors.white90,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  tag: {
    color: Colors.white50,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
    marginTop: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: Spacing.xs,
  },
  badgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
});
