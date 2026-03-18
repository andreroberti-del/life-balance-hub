import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors, Radius, Spacing } from '../constants/theme';

type CardVariant = 'default' | 'lime' | 'alert';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: CardVariant;
  showPattern?: boolean;
}

function TopographicPattern() {
  return (
    <Svg
      width="100%"
      height="100%"
      style={StyleSheet.absoluteFill}
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 300 200"
    >
      <Path
        d="M20,80 Q60,40 120,70 T220,60 T300,80"
        stroke={Colors.white08}
        strokeWidth={1}
        fill="none"
      />
      <Path
        d="M0,110 Q80,70 150,100 T260,90 T300,110"
        stroke={Colors.white08}
        strokeWidth={1}
        fill="none"
      />
      <Path
        d="M10,140 Q70,110 140,130 T240,120 T300,140"
        stroke={Colors.white08}
        strokeWidth={1}
        fill="none"
      />
      <Path
        d="M0,50 Q50,20 100,40 T200,35 T300,50"
        stroke={Colors.white08}
        strokeWidth={0.8}
        fill="none"
      />
      <Path
        d="M20,170 Q90,140 160,160 T270,150 T300,170"
        stroke={Colors.white08}
        strokeWidth={0.8}
        fill="none"
      />
    </Svg>
  );
}

const borderColors: Record<CardVariant, string | undefined> = {
  default: undefined,
  lime: Colors.lime,
  alert: Colors.red,
};

export function Card({ children, style, variant = 'default', showPattern = false }: CardProps) {
  const borderColor = borderColors[variant];

  return (
    <View
      style={[
        styles.card,
        borderColor ? { borderWidth: 1.5, borderColor } : undefined,
        style,
      ]}
    >
      {showPattern && <TopographicPattern />}
      {children}
    </View>
  );
}

export { TopographicPattern };

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.dark3,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    overflow: 'hidden',
  },
});
