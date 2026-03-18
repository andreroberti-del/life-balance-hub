import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface TabIconProps {
  name: IoniconsName;
  color: string;
  size: number;
  isScan?: boolean;
}

function TabIcon({ name, color, size, isScan }: TabIconProps) {
  if (isScan) {
    return (
      <View style={styles.scanButton}>
        <Ionicons name={name} size={28} color={Colors.dark} />
      </View>
    );
  }
  return <Ionicons name={name} size={size} color={color} />;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.lime,
        tabBarInactiveTintColor: Colors.white30,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="data"
        options={{
          title: 'Data',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="stats-chart" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: '',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="scan" color={color} size={size} isScan />
          ),
        }}
      />
      <Tabs.Screen
        name="omega"
        options={{
          title: 'Omega',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="fish" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="person" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="checkin"
        options={{
          href: null,
          title: 'Check-in',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'rgba(26, 35, 50, 0.95)',
    borderTopWidth: 0,
    elevation: 0,
    height: Platform.OS === 'ios' ? 88 : 68,
    paddingBottom: Platform.OS === 'ios' ? 28 : 8,
    paddingTop: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  tabItem: {
    paddingTop: 4,
  },
  scanButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.lime,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Platform.OS === 'ios' ? 20 : 12,
    shadowColor: Colors.lime,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});
