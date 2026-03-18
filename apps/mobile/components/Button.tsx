import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '../constants/theme';

type ButtonVariant = 'lime' | 'outline';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  style?: ViewStyle;
  disabled?: boolean;
  loading?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'lime',
  style,
  disabled = false,
  loading = false,
}: ButtonProps) {
  const isLime = variant === 'lime';

  return (
    <TouchableOpacity
      style={[
        styles.base,
        isLime ? styles.lime : styles.outline,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={isLime ? Colors.dark : Colors.white}
        />
      ) : (
        <Text
          style={[
            styles.text,
            isLime ? styles.textLime : styles.textOutline,
            disabled && styles.textDisabled,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 50,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  lime: {
    backgroundColor: Colors.lime,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.white30,
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.5,
  },
  textLime: {
    color: Colors.dark,
  },
  textOutline: {
    color: Colors.white,
  },
  textDisabled: {
    opacity: 0.6,
  },
});
