import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Login from './Login';
import SignUpScreen from './SignUpScreen';
import Main from './Main';
import ProfileScreen from './ProfileScreen';
import BeepScreen from './BeepScreen';
import ActiveDriversScreen from './ActiveDriversScreen';
import { useColorScheme } from 'react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => {
          let iconName = 'circle';
          if (route.name === 'Order') iconName = 'shopping-outline';
          else if (route.name === 'Beep') iconName = 'steering';
          else if (route.name === 'Profile') iconName = 'account';
          return <MaterialCommunityIcons name={iconName} size={28} color={color} />;
        },
        tabBarActiveTintColor: '#2f95dc',
        tabBarInactiveTintColor: '#ffffff',
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 4,
        },
        tabBarStyle: {
          position: 'absolute',
          bottom: 30,
          left: 50,
          right: 50,
          elevation: 0,
          backgroundColor: '#1E1E1E',
          borderRadius: 50,
          height: 70,
          borderTopWidth: 0,
          // Shadow for iOS
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.25,
          shadowRadius: 10,
        },
        tabBarItemStyle: {
          borderRadius: 20,
          marginHorizontal: 5,
          marginVertical: 8,
          paddingBottom: 2,
        },
        tabBarActiveBackgroundColor: '#333333',
      })}
    >
      <Tab.Screen name="Order" component={Main} />
      <Tab.Screen name="Beep" component={BeepScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{
          headerShown: true,
          title: 'Sign Up',
        }}
      />
      <Stack.Screen name="MainDrawer" component={MainTabs} />
      <Stack.Screen name="ActiveDrivers" component={ActiveDriversScreen} />
    </Stack.Navigator>
  );
}