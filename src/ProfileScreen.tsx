import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Image, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { supabase } from './lib/supabase';
import { useNavigation } from '@react-navigation/native';
import { AuthService, UserProfile } from './services/AuthService';
import { launchImageLibrary } from 'react-native-image-picker';

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const user = await AuthService.getCurrentUser();
      if (user) {
        const userProfile = await AuthService.getUserProfile(user.id);
        setProfile(userProfile);
      }
    } catch (error) {
      console.error('Error loading profile', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo', includeBase64: true }, async (response) => {
      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        if (asset.base64 && asset.type) {
          try {
            setUploading(true);
            const user = await AuthService.getCurrentUser();
            if (!user) {
               Alert.alert('Error', 'User not logged in');
               return;
            }
            await AuthService.uploadProfilePicture(user.id, asset.base64, asset.type);
            await loadProfile();
            Alert.alert('Success', 'Profile picture updated successfully');
          } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to update profile picture');
          } finally {
            setUploading(false);
          }
        }
      }
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleImagePick} disabled={uploading}>
        {profile?.profile_picture_url ? (
          <Image 
            source={{ uri: profile.profile_picture_url }} 
            style={styles.profilePic} 
          />
        ) : (
          <View style={[styles.profilePic, styles.placeholderPic]} />
        )}
        {uploading && (
          <View style={styles.uploadOverlay}>
            <ActivityIndicator color="#000" />
          </View>
        )}
      </TouchableOpacity>
      <Text style={styles.title}>
        {profile?.first_name || 'Profile'} {profile?.last_name || ''}
      </Text>
      {profile?.username && (
        <Text style={styles.subtitle}>@{profile.username}</Text>
      )}
      <Button title="Logout" onPress={handleLogout} color="#ff3b30" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#fff' 
  },
  title: { 
    fontSize: 24, 
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333'
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    backgroundColor: '#eee',
  },
  uploadOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderPic: {
    backgroundColor: '#ccc',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
  },
});
