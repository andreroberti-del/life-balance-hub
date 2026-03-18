import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  Platform,
} from 'react-native';
import { Colors, Spacing, FontSize, FontWeight } from '../constants/theme';

interface TabBarProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
  style?: ViewStyle;
}

interface TabItem {
  key: string;
  label: string;
  icon: string;
  isFab?: boolean;
}

const TABS: TabItem[] = [
  { key: 'home', label: 'Home', icon: '\uD83C\uDFE0' },
  { key: 'data', label: 'Data', icon: '\uD83D\uDCCA' },
  { key: 'scan', label: 'Scan', icon: '\uD83D\uDD0D', isFab: true },
  { key: 'omega', label: 'Omega', icon: '\uD83E\uDDE0' },
  { key: 'profile', label: 'Profile', icon: '\uD83D\uDC64' },
];

export function TabBar({ activeTab, onTabPress, style }: TabBarProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.backdrop} />
      <View style={styles.tabsRow}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;

          if (tab.isFab) {
            return (
              <TouchableOpacity
                key={tab.key}
                style={styles.fabContainer}
                onPress={() => onTabPress(tab.key)}
                activeOpacity={0.8}
              >
                <View style={styles.fab}>
                  <Text style={styles.fabIcon}>{tab.icon}</Text>
                </View>
                <Text style={styles.fabLabel}>{tab.label}</Text>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tab}
              onPress={() => onTabPress(tab.key)}
              activeOpacity={0.7}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text
                style={[
                  styles.tabLabel,
                  isActive ? styles.tabLabelActive : styles.tabLabelInactive,
                ]}
              >
                {tab.label}
              </Text>
              {isActive && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const TAB_HEIGHT = 72;
const FAB_SIZE = 52;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: TAB_HEIGHT + (Platform.OS === 'ios' ? 20 : 0),
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26,35,50,0.92)',
    ...(Platform.OS === 'ios'
      ? {}
      : {}),
  },
  tabsRow: {
    flexDirection: 'row',
    height: TAB_HEIGHT,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    position: 'relative',
  },
  tabIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
  tabLabelActive: {
    color: Colors.lime,
  },
  tabLabelInactive: {
    color: Colors.white50,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.lime,
  },
  fabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: Colors.lime,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.lime,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 22,
  },
  fabLabel: {
    color: Colors.lime,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    marginTop: 4,
  },
});
