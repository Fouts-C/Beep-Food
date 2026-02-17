import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { AuthService } from './services/AuthService';
import appleAuth from '@invertase/react-native-apple-authentication';

function Login({ navigation }: { navigation: any }): React.JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      await AuthService.signIn(email, password);
      navigation.navigate('MainDrawer');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    if (Platform.OS !== 'ios') {
      Alert.alert('Not Available', 'Apple Sign-In is only available on iOS');
      return;
    }

    setLoading(true);
    try {
      // Perform Apple Sign In request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      // Get current authentication state
      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user,
      );

      if (credentialState === appleAuth.State.AUTHORIZED) {
        // Sign in with Supabase using Apple ID token
        await AuthService.signInWithApple();
        navigation.navigate('MainDrawer');
      }
    } catch (error: any) {
      if (error.code === appleAuth.Error.CANCELED) {
        // User canceled the sign-in flow
        return;
      }
      Alert.alert('Apple Sign-In Failed', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
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
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />

      {/* Login Button */}
      <TouchableOpacity
        style={[styles.loginBtn, loading && styles.disabledBtn]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.loginBtnText}>Login</Text>
        )}
      </TouchableOpacity>

      {/* Apple Sign-In Button (iOS only) */}
      {Platform.OS === 'ios' && (
        <TouchableOpacity
          style={styles.appleBtn}
          onPress={handleAppleSignIn}
          disabled={loading}
        >
          <Text style={styles.appleBtnText}>🍎 Sign in with Apple</Text>
        </TouchableOpacity>
      )}

      {/* Sign Up Link */}
      <TouchableOpacity
        onPress={() => navigation.navigate('SignUp')}
        style={styles.signUpBtn}
        disabled={loading}
      >
        <Text style={styles.signUpText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Forgot Password Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate('PasswordReset')}
        style={styles.forgotBtn}
        disabled={loading}
      >
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
  disabledBtn: {
    opacity: 0.5,
  },
  appleBtn: {
    width: '95%',
    backgroundColor: '#000',
    borderRadius: 12,
    paddingVertical: 12,
    marginLeft: 10,
    marginTop: 16,
    alignItems: 'center',
  },
  appleBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
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