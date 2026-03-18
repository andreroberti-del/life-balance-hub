import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '../constants/theme';
import { Card, TopographicPattern } from './Card';

interface BigMetricProps {
  value: string | number;
  unit: string;
  title: string;
  subtitle?: string;
  color?: string;
  style?: ViewStyle;
}

export function BigMetric({
  value,
  unit,
  title,
  subtitle,
  color = Colors.lime,
  style,
}: BigMetricProps) {
  return (
    <Card style={[styles.container, style]} showPattern>
      <View style={styles.content}>
        <View style={styles.valueSection}>
          <View style={styles.valueRow}>
            <Text style={[styles.value, { color }]}>{value}</Text>
            <Text style={[styles.unit, { color }]}>{unit}</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueSection: {
    marginRight: Spacing.xl,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  value: {
    fontSize: 64,
    fontWeight: FontWeight.black,
    lineHeight: 68,
  },
  unit: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    marginTop: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  infoSection: {
    flex: 1,
  },
  title: {
    color: Colors.white90,
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    color: Colors.white50,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.regular,
    lineHeight: 18,
  },
});
