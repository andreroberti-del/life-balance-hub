import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing, FontSize, FontWeight } from '../constants/theme';
import { Card } from './Card';

interface LocationCardProps {
  icon: string;
  title: string;
  subtitle?: string;
  value: string | number;
  unit?: string;
  valueColor?: string;
  style?: ViewStyle;
}

export function LocationCard({
  icon,
  title,
  subtitle,
  value,
  unit,
  valueColor = Colors.white,
  style,
}: LocationCardProps) {
  return (
    <Card style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      <View style={styles.valueContainer}>
        <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
        {unit ? (
          <Text style={[styles.unit, { color: valueColor }]}>{unit}</Text>
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.white08,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  icon: {
    fontSize: 20,
  },
  info: {
    flex: 1,
  },
  title: {
    color: Colors.white90,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  subtitle: {
    color: Colors.white50,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
    marginTop: 2,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
  unit: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    marginLeft: Spacing.xs,
    opacity: 0.7,
  },
});
