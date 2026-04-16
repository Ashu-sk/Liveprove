import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Text } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import ReportScreen from '../screens/ReportScreen';
import ConfirmationScreen from '../screens/ConfirmationScreen';
import ConfirmationSuccessScreen from '../screens/ConfirmationSuccessScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
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

function MyReportsPlaceholder() {
  const { View, Text } = require('react-native');
  return (
    <View style={{ flex: 1, backgroundColor: '#0a0a0a', alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#666', fontSize: 16 }}>Your reports will appear here</Text>
    </View>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#0a0a0a', borderTopColor: '#2a2a2a', paddingBottom: 8, height: 60 },
        tabBarActiveTintColor: '#ff3333',
        tabBarInactiveTintColor: '#555',
        tabBarLabelStyle: { fontSize: 11, marginTop: 2 }
      }}>
        <Tab.Screen name="Home" component={HomeStack} options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>🏠</Text> }} />
        <Tab.Screen name="Report" component={ReportStack} options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>🚨</Text> }} />
        <Tab.Screen name="My Reports" component={MyReportsPlaceholder} options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>📋</Text> }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

