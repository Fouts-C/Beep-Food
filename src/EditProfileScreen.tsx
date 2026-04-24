import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';
import { supabase } from './lib/supabase';
import { AuthService } from './services/AuthService';
import { launchImageLibrary } from 'react-native-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function EditProfileScreen({ navigation }: { navigation: any }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [venmo, setVenmo] = useState('');
  const [username, setUsername] = useState('');
  
  const [profilePic, setProfilePic] = useState<string | undefined>(undefined);
  const [profilePicBase64, setProfilePicBase64] = useState<string | undefined>(undefined);
  const [profilePicMimeType, setProfilePicMimeType] = useState<string | undefined>(undefined);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const user = await AuthService.getCurrentUser();
      if (!user) {
        Alert.alert('Error', 'Not logged in');
        navigation.goBack();
        return;
      }

      const profile = await AuthService.getUserProfile(user.id);
      if (profile) {
        setFirstName(profile.first_name || user.user_metadata?.first_name || '');
        setLastName(profile.last_name || user.user_metadata?.last_name || '');
        setPhone(profile.phone || user.user_metadata?.phone || '');
        setVenmo(profile.venmo_username || user.user_metadata?.venmo_username || '');
        setUsername(profile.username || user.user_metadata?.username || '');
        if (profile.profile_picture_url || user.user_metadata?.profile_picture_url) {
          setProfilePic(profile.profile_picture_url || user.user_metadata?.profile_picture_url);
        }
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not load profile data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim() || !phone.trim() || !username.trim()) {
      Alert.alert('Missing Info', 'Please fill in all core fields.');
      return;
    }

    setSaving(true);
    try {
      const user = await AuthService.getCurrentUser();
      if (!user) throw new Error('Not logged in');

      // Update Database
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          venmo_username: venmo,
          username: username,
        })
        .eq('id', user.id);

      if (error) throw error;

      // Update Image if changed natively in this session
      if (profilePicBase64 && profilePicMimeType) {
        await AuthService.uploadProfilePicture(user.id, profilePicBase64, profilePicMimeType);
      }

      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (e: any) {
      Alert.alert('Update Failed', e.message || 'Something went wrong');
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#FFCC00" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={{ padding: 20 }}>
        <View style={styles.topProfileContainer}>
          <TouchableOpacity onPress={handleImagePick} style={styles.profileIcon} disabled={saving}>
            {profilePic ? (
              <Image source={{ uri: profilePic }} style={styles.profilePic} />
            ) : (
              <View style={[styles.profilePic, { backgroundColor: '#333' }]} />
            )}
            <View style={styles.editBadge}>
              <MaterialCommunityIcons name="pencil" size={16} color="#000" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <View style={[styles.fieldContainer, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              placeholderTextColor="#888"
              value={firstName}
              onChangeText={setFirstName}
              editable={!saving}
            />
          </View>

          <View style={[styles.fieldContainer, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              placeholderTextColor="#888"
              value={lastName}
              onChangeText={setLastName}
              editable={!saving}
            />
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#888"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            editable={!saving}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Venmo</Text>
          <TextInput
            style={styles.input}
            placeholder="Venmo Username"
            placeholderTextColor="#888"
            value={venmo}
            onChangeText={setVenmo}
            editable={!saving}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#888"
            value={username}
            onChangeText={setUsername}
            editable={!saving}
          />
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.disabledBtn]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.saveText}>Update Profile</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#1E1E1E',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    color: '#CCC',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#1E1E1E',
    borderColor: '#333',
    color: '#FFF',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  topProfileContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  profileIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFCC00',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  saveBtn: {
    backgroundColor: '#FFCC00',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledBtn: {
    opacity: 0.5,
  },
  saveText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
});
