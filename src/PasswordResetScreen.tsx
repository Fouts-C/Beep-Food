import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PasswordResetScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Your Password</Text>
      <Text>We'll build a real form here later.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 16,
  },
});