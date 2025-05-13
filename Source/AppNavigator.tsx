import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Login';
import SignUpScreen from './SignUpScreen';
import Main from './Main';
import PasswordResetScreen from './PasswordResetScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Main" component={Main} />
      <Stack.Screen name="PasswordReset" component={PasswordResetScreen} />
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  );
}