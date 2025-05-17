import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Login';
import SignUpScreen from './SignUpScreen';
import Main from './Main';
import { useColorScheme } from 'react-native';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
 const isDarkMode = useColorScheme() === 'dark';

function MainDrawer() {
  return (
    <Drawer.Navigator initialRouteName="Main">
      <Drawer.Screen name="Main" component={Main} />
      {/* Add other screens to the drawer if needed */}
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
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
      <Stack.Screen name="MainDrawer" component={MainDrawer} />
    </Stack.Navigator>
  );
}