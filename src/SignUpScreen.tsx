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
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { AuthService } from './services/AuthService';

export default function SignUpScreen({ navigation }: { navigation: any }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [venmo, setVenmo] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [profilePic, setProfilePic] = useState<string | undefined>(undefined);
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
      });

      Alert.alert(
        'Account Created',
        'Please check your email to verify your account, then log in.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setProfilePic(response.assets[0].uri);
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1, marginRight: 20 }]}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
          editable={!loading}
        />

        {/* Image upload button */}
        {<TouchableOpacity onPress={handleImagePick} style={styles.profileIcon} disabled={loading}>
          {profilePic ? (
            <Image source={{ uri: profilePic }} style={styles.profilePic} />
          ) : (
            <Image
              source={require('../images/blankImageIcon.jpg')}
              style={styles.profilePic}
            />
          )}
        </TouchableOpacity>}
      </View>

      <TextInput
        style={styles.lastName}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        editable={!loading}
      />
      <Text style={styles.note}>You must use a .edu email address</Text>

      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Venmo Username"
        value={venmo}
        onChangeText={setVenmo}
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
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
          <Text style={styles.signUpText}>Sign Up</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 14,
    marginRight: 10,
    marginLeft: 10,
  },
  lastName: {
    backgroundColor: '#f9f9f9',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 20,
    marginRight: 175,
    marginLeft: 10,
    marginTop: -60,
  },
  note: {
    fontSize: 12,
    color: '#666',
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  profileIcon: {
    width: 150,
    height: 150,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginRight: 5,
  },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 35,
    marginTop: 10,
    marginRight: 10,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
    marginBottom: 20,
  },
  signUpBtn: {
    backgroundColor: '#f1f1f1',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  disabledBtn: {
    opacity: 0.5,
  },
  signUpText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
});