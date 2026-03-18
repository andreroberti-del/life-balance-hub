import React from 'react';
import { View, Text, TextInput, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '../constants/theme';

interface InputFieldProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  unit?: string;
  centered?: boolean;
  keyboardType?: TextInput['props']['keyboardType'];
  secureTextEntry?: boolean;
  multiline?: boolean;
  style?: ViewStyle;
}

export function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  unit,
  centered = false,
  keyboardType = 'default',
  secureTextEntry = false,
  multiline = false,
  style,
}: InputFieldProps) {
  return (
    <View style={[styles.wrapper, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            centered && styles.inputCentered,
            unit ? styles.inputWithUnit : undefined,
            multiline && styles.inputMultiline,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.white30}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          selectionColor={Colors.lime}
        />
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing.lg,
  },
  label: {
    color: Colors.white70,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    marginBottom: Spacing.sm,
    letterSpacing: 0.3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white08,
    borderWidth: 1,
    borderColor: Colors.white15,
    borderRadius: Radius.sm,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    color: Colors.white,
    fontSize: FontSize.base,
    fontWeight: FontWeight.regular,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    height: 48,
  },
  inputCentered: {
    textAlign: 'center',
  },
  inputWithUnit: {
    paddingRight: Spacing.xs,
  },
  inputMultiline: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: Spacing.md,
  },
  unit: {
    color: Colors.white50,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    paddingRight: Spacing.lg,
  },
});
