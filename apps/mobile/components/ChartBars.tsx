import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '../constants/theme';

interface ChartBarData {
  value: number;
  label: string;
  active?: boolean;
}

interface ChartBarsProps {
  data: ChartBarData[];
  height?: number;
  style?: ViewStyle;
}

export function ChartBars({ data, height = 120, style }: ChartBarsProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.barsRow, { height }]}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * height;
          const isActive = item.active !== false;

          return (
            <View key={index} style={styles.barColumn}>
              <View style={[styles.barTrack, { height }]}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: barHeight,
                      backgroundColor: isActive ? Colors.lime : Colors.white15,
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.label,
                  isActive ? styles.labelActive : styles.labelInactive,
                ]}
              >
                {item.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.sm,
  },
  barsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 3,
  },
  barTrack: {
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: '70%',
    maxWidth: 28,
    borderRadius: Radius.xs,
    minHeight: 4,
  },
  label: {
    fontSize: 9,
    fontWeight: FontWeight.medium,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  labelActive: {
    color: Colors.white70,
  },
  labelInactive: {
    color: Colors.white30,
  },
});
