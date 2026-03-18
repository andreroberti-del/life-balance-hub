import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '../constants/theme';
import { Card } from './Card';
import { WeekStreak } from '../types';

interface StreakBarProps {
  streak: number;
  protocolDay: number;
  totalDays: number;
  days?: WeekStreak[];
  style?: ViewStyle;
}

function generateDays(protocolDay: number, totalDays: number): WeekStreak[] {
  const displayCount = Math.min(totalDays, 10);
  const result: WeekStreak[] = [];

  const startDay = Math.max(1, protocolDay - 3);
  for (let i = 0; i < displayCount; i++) {
    const day = startDay + i;
    let status: WeekStreak['status'];
    if (day < protocolDay) {
      status = 'done';
    } else if (day === protocolDay) {
      status = 'today';
    } else {
      status = 'future';
    }
    result.push({ day: `D${day}`, status });
  }
  return result;
}

export function StreakBar({
  streak,
  protocolDay,
  totalDays,
  days,
  style,
}: StreakBarProps) {
  const displayDays = days ?? generateDays(protocolDay, totalDays);

  const streakMessage =
    streak >= 7
      ? 'On fire! Keep it up!'
      : streak >= 3
        ? 'Great momentum!'
        : streak >= 1
          ? 'Good start!'
          : 'Start your streak!';

  return (
    <Card style={[styles.container, style]}>
      <View style={styles.header}>
        <View style={styles.streakInfo}>
          <Text style={styles.fireEmoji}>{'\uD83D\uDD25'}</Text>
          <Text style={styles.streakCount}>{streak}</Text>
          <Text style={styles.streakLabel}>day streak</Text>
        </View>
        <Text style={styles.message}>{streakMessage}</Text>
      </View>

      <View style={styles.dotsRow}>
        {displayDays.map((day, index) => (
          <View key={index} style={styles.dotColumn}>
            <View
              style={[
                styles.dot,
                day.status === 'done' && styles.dotDone,
                day.status === 'today' && styles.dotToday,
                day.status === 'future' && styles.dotFuture,
              ]}
            >
              {day.status === 'done' && (
                <Text style={styles.checkmark}>{'\u2713'}</Text>
              )}
            </View>
            <Text
              style={[
                styles.dayLabel,
                day.status === 'today' && styles.dayLabelActive,
              ]}
            >
              {day.day}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const DOT_SIZE = 28;

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  streakInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fireEmoji: {
    fontSize: FontSize.xl,
    marginRight: Spacing.xs,
  },
  streakCount: {
    color: Colors.lime,
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    marginRight: Spacing.xs,
  },
  streakLabel: {
    color: Colors.white50,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  message: {
    color: Colors.white50,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dotColumn: {
    alignItems: 'center',
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  dotDone: {
    backgroundColor: Colors.lime,
  },
  dotToday: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.lime,
  },
  dotFuture: {
    backgroundColor: Colors.white08,
  },
  checkmark: {
    color: Colors.dark,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  dayLabel: {
    color: Colors.white30,
    fontSize: 9,
    fontWeight: FontWeight.medium,
  },
  dayLabelActive: {
    color: Colors.lime,
  },
});
