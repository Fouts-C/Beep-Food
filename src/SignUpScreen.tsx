import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
  StatusBar,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { AuthService } from './services/AuthService';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function SignUpScreen({ navigation }: { navigation: any }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [venmo, setVenmo] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState<string | undefined>(undefined);
  const [profilePicBase64, setProfilePicBase64] = useState<string | undefined>(undefined);
  const [profilePicMimeType, setProfilePicMimeType] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !venmo.trim() ||
      !username.trim() ||
      !password.trim()
    ) {
      Alert.alert('Missing Info', 'Please fill in all fields before continuing.');
      return;
    }

    setLoading(true);
    try {
      await AuthService.signUp({
        email,
        password,
        firstName,
        lastName,
        phone,
        venmoUsername: venmo,
        username,
        profilePicBase64,
        profilePicMimeType,
      });

      Alert.alert(
        'Account Created',
        'Please check your email to verify your account, then log in.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo', includeBase64: true }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setProfilePic(response.assets[0].uri);
        setProfilePicBase64(response.assets[0].base64);
        setProfilePicMimeType(response.assets[0].type);
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} disabled={loading}>
            <Ionicons name="chevron-back" size={24} color="#FFCC00" />
          </TouchableOpacity>
          <Text style={styles.title}>Create Account</Text>
        </View>
        <Text style={styles.subtitle}>Join Beep Food today</Text>

        {/* Profile picture */}
        <TouchableOpacity style={styles.profilePicWrapper} onPress={handleImagePick} disabled={loading}>
          <Image
            source={profilePic ? { uri: profilePic } : require('../images/blankImageIcon.jpg')}
            style={styles.profilePic}
          />
          <View style={styles.cameraOverlay}>
            <Ionicons name="camera" size={15} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Name row */}
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="First Name"
            placeholderTextColor="#555"
            value={firstName}
            onChangeText={setFirstName}
            editable={!loading}
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Last Name"
            placeholderTextColor="#555"
            value={lastName}
            onChangeText={setLastName}
            editable={!loading}
          />
        </View>

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
        <Text style={styles.note}>Must be a .edu email address</Text>

        <TextInput
          style={styles.input}
          placeholder="Phone"
          placeholderTextColor="#555"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Venmo Username"
          placeholderTextColor="#555"
          value={venmo}
          onChangeText={setVenmo}
          autoCapitalize="none"
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#555"
          value={username}
          onChangeText={setUsername}
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
          style={[styles.signUpBtn, loading && styles.disabledBtn]}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.signUpBtnText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={loading}>
            <Text style={styles.loginLink}> Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scroll: {
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 48,
  },
  backBtn: {
    marginRight: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFCC00',
    letterSpacing: 0.4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    letterSpacing: 0.2,
    marginBottom: 16,
    textAlign: 'center',
  },
  profilePicWrapper: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFCC00',
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 0,
  },
  halfInput: {
    flex: 1,
    marginBottom: 14,
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
    marginBottom: 14,
  },
  note: {
    fontSize: 12,
    color: '#555555',
    marginTop: -8,
    marginBottom: 14,
    marginLeft: 4,
  },
  signUpBtn: {
    backgroundColor: '#FFCC00',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 6,
  },
  signUpBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  disabledBtn: {
    opacity: 0.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
  },
  footerText: {
    color: '#555555',
    fontSize: 14,
  },
  loginLink: {
    color: '#FFCC00',
    fontSize: 14,
    fontWeight: '700',
  },
});
