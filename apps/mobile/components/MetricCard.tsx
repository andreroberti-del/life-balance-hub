import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '../constants/theme';
import { Card } from './Card';

type TrendDirection = 'up' | 'down' | 'neutral';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: string | number;
  trendLabel?: string;
  trendDirection?: TrendDirection;
  style?: ViewStyle;
}

const trendArrows: Record<TrendDirection, string> = {
  up: '\u2191',
  down: '\u2193',
  neutral: '\u2192',
};

const trendColors: Record<TrendDirection, string> = {
  up: Colors.green,
  down: Colors.red,
  neutral: Colors.slateLight,
};

export function MetricCard({
  label,
  value,
  unit,
  trend,
  trendLabel,
  trendDirection = 'neutral',
  style,
}: MetricCardProps) {
  const trendColor = trendColors[trendDirection];
  const arrow = trendArrows[trendDirection];

  return (
    <Card style={[styles.container, style]}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>

      <View style={styles.valueRow}>
        <Text style={styles.value}>{value}</Text>
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>

      {trend !== undefined && (
        <View style={styles.trendRow}>
          <Text style={[styles.trendArrow, { color: trendColor }]}>{arrow}</Text>
          <Text style={[styles.trendValue, { color: trendColor }]}>
            {trend}
            {trendLabel ? ` ${trendLabel}` : ''}
          </Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 140,
  },
  label: {
    color: Colors.white50,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    letterSpacing: 1.2,
    marginBottom: Spacing.sm,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    color: Colors.white,
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
  },
  unit: {
    color: Colors.white50,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    marginLeft: Spacing.xs,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  trendArrow: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    marginRight: Spacing.xs,
  },
  trendValue: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
});
