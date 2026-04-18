import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import ReportScreen from '../screens/ReportScreen';
import ConfirmationScreen from '../screens/ConfirmationScreen';
import ConfirmationSuccessScreen from '../screens/ConfirmationSuccessScreen';
import MapScreen from '../screens/MapScreen';
import RewardsScreen from '../screens/RewardsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import IncidentDetailScreen from '../screens/IncidentDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="IncidentDetail" component={IncidentDetailScreen} />
    </Stack.Navigator>
  );
}

function ReportStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ReportMain" component={ReportScreen} />
      <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
      <Stack.Screen name="ConfirmationSuccess" component={ConfirmationSuccessScreen} />
    </Stack.Navigator>
  );
}

function CenterButton({ onPress }: { onPress: (e?: any) => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.centerBtn} activeOpacity={0.85}>
      <Text style={{ fontSize: 28 }}>📷</Text>
    </TouchableOpacity>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#0066ff',
          tabBarInactiveTintColor: '#334455',
          tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginTop: 2 },
          tabBarBackground: () => <View style={styles.tabBg} />,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text> }}
        />
        <Tab.Screen
          name="Map"
          component={MapScreen}
          options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🗺</Text> }}
        />
        <Tab.Screen
          name="Report"
          component={ReportStack}
          options={{
            // RULE 1: No icon, no label. Only CenterButton shows 📷.
            tabBarLabel: '',
            tabBarButton: (props) => <CenterButton onPress={props.onPress as any} />,
          }}
        />
        <Tab.Screen
          name="Rewards"
          component={RewardsScreen}
          options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏆</Text> }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text> }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: { backgroundColor: '#000', borderTopColor: '#0066ff18', borderTopWidth: 1, height: 64, paddingBottom: 8 },
  tabBg: { flex: 1, backgroundColor: '#000' },
  centerBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0055ee',
    borderWidth: 2,
    borderColor: '#4488ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    shadowColor: '#0066ff',
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 12,
  },
});

