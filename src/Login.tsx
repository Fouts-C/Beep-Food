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
  StatusBar,
  Image,
} from 'react-native';
import { AuthService } from './services/AuthService';
import appleAuth from '@invertase/react-native-apple-authentication';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
      const credential = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      if (!credential.identityToken) {
        throw new Error('Apple Sign-In failed — no identity token returned');
      }

      const credentialState = await appleAuth.getCredentialStateForUser(credential.user);
      if (credentialState !== appleAuth.State.AUTHORIZED) {
        throw new Error('Apple credentials are not authorized');
      }

      await AuthService.signInWithApple(credential.identityToken, {
        email: credential.email,
        firstName: credential.fullName?.givenName,
        lastName: credential.fullName?.familyName,
      });

      navigation.navigate('MainDrawer');
    } catch (error: any) {
      if (error.code === appleAuth.Error.CANCELED) {
        return;
      }
      Alert.alert('Apple Sign-In Failed', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <View style={styles.header}>
        <Image
          source={require('../images/beep_food_icon_final.jpg')}
          style={styles.logo}
        />
        <Text style={styles.title}>Beep Food</Text>
        <Text style={styles.subtitle}>Food delivery for students, without the fees.</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#555"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#555"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />

        <TouchableOpacity
          style={styles.forgotLink}
          onPress={() => navigation.navigate('PasswordReset')}
          disabled={loading}
        >
          <Text style={styles.forgotLinkText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.loginBtn, loading && styles.disabledBtn]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.loginBtnText}>Sign In</Text>
          )}
        </TouchableOpacity>

        {Platform.OS === 'ios' && (
          <TouchableOpacity
            style={[styles.appleBtn, loading && styles.disabledBtn]}
            onPress={handleAppleSignIn}
            disabled={loading}
          >
            <View style={styles.appleBtnInner}>
                <Ionicons name="logo-apple" size={18} color="#ffffff" />
                <Text style={styles.appleBtnText}>Sign in with Apple</Text>
              </View>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')} disabled={loading}>
          <Text style={styles.signUpText}> Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  header: {
    alignItems: 'center',
    marginBottom: 44,
  },
  logo: {
    width: 110,
    height: 110,
    borderRadius: 26,
    marginBottom: 18,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFCC00',
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '400',
    letterSpacing: 0.2,
  },
  form: {
    gap: 14,
  },
  input: {
    height: 52,
    borderColor: '#222222',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#141414',
    color: '#ffffff',
    fontSize: 15,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginTop: -2,
  },
  forgotLinkText: {
    color: '#555555',
    fontSize: 13,
  },
  loginBtn: {
    backgroundColor: '#FFCC00',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  loginBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  disabledBtn: {
    opacity: 0.5,
  },
  appleBtn: {
    backgroundColor: '#141414',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222222',
  },
  appleBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  appleBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 36,
  },
  footerText: {
    color: '#555555',
    fontSize: 14,
  },
  signUpText: {
    color: '#FFCC00',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default Login;
