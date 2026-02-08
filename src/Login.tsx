import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';

function Login({ navigation }: { navigation: any }): React.JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
    } else if (email === password) {
      // Temporary login logic
      navigation.navigate('MainDrawer');
    } else {
      Alert.alert('Invalid Credentials', 'Email must match password (for now)');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Beep Food App 🚕</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Login Button */}
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginBtnText}>Login</Text>
      </TouchableOpacity>

      {/* Sign Up Link */}
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.signUpBtn}>
        <Text style={styles.signUpText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Forgot Password Button */}
      <TouchableOpacity onPress={() => navigation.navigate('PasswordReset')} style={styles.forgotBtn}>
        <Text style={styles.signUpText}>Forgot Password</Text>
      </TouchableOpacity>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 24,
    marginLeft: 10,
    textAlign: 'left',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: 'white',
  },
  loginBtn: {
    width: '95%',
    backgroundColor: '#f5f5f5',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    marginLeft: 10,
    alignItems: 'center',
  },
  loginBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  signUpBtn: {
    marginTop: 24,
    marginLeft: 20,
  },
  signUpText: {
    fontSize: 16,
    color: '#FFCC00',
    fontWeight: '800',
  },
  forgotBtn: {
  marginTop: -17,
  marginRight: 20,
  alignSelf: 'flex-end',
  },
});

export default Login;