import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '../constants/theme';

interface TogglePillsProps {
  options: string[];
  activeIndex: number;
  onSelect: (index: number) => void;
  style?: ViewStyle;
}

export function TogglePills({
  options,
  activeIndex,
  onSelect,
  style,
}: TogglePillsProps) {
  return (
    <View style={[styles.container, style]}>
      {options.map((option, index) => {
        const isActive = index === activeIndex;

        return (
          <TouchableOpacity
            key={index}
            style={[styles.pill, isActive ? styles.pillActive : styles.pillInactive]}
            onPress={() => onSelect(index)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.pillText,
                isActive ? styles.pillTextActive : styles.pillTextInactive,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.white08,
    borderRadius: Radius.full,
    padding: 3,
  },
  pill: {
    flex: 1,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillActive: {
    backgroundColor: Colors.lime,
  },
  pillInactive: {
    backgroundColor: 'transparent',
  },
  pillText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  pillTextActive: {
    color: Colors.dark,
  },
  pillTextInactive: {
    color: Colors.white50,
  },
});
