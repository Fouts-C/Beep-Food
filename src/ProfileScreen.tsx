import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity, Alert, SafeAreaView, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
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

  const MENU_ITEMS = [
    { id: 'profile', icon: '🧑🏽', title: 'Profile', desc: 'Configure your profile.', action: () => navigation.navigate('EditProfile') },
    { id: 'beeps', icon: '🚕', title: 'Beeps', desc: "View beeps you've participated in.", action: () => {} },
    { id: 'ratings', icon: '⭐', title: 'Ratings', desc: 'View your driver and rider ratings.', action: () => {} },
    { id: 'cars', icon: '🚙', title: 'Cars', desc: 'View your cars used for beeping.', action: () => {} },
    { id: 'premium', icon: '👑', title: 'Premium', desc: 'Manage your premium subscription.', action: () => {} },
    { id: 'feedback', icon: '💬', title: 'Feedback', desc: 'Send us your feedback and suggestions.', action: () => {} },
  ];

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Profile</Text>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Header Section */}
        <View style={styles.userSection}>
          <View style={styles.userInfo}>
            <Text style={styles.nameText}>
              {profile?.first_name || 'Profile'} {profile?.last_name || ''}
            </Text>
            <Text style={styles.emailText}>{profile?.email || 'Loading...'}</Text>
          </View>

          <TouchableOpacity onPress={handleImagePick} disabled={uploading}>
            {profile?.profile_picture_url ? (
              <Image source={{ uri: profile.profile_picture_url }} style={styles.profilePic} />
            ) : (
              <View style={[styles.profilePic, styles.placeholderPic]} />
            )}
            {uploading && (
              <View style={styles.uploadOverlay}>
                <ActivityIndicator color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.action}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDesc}>{item.desc}</Text>
              </View>
              <Icon name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 15,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  userSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  userInfo: {
    flex: 1,
    paddingRight: 20,
  },
  nameText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  emailText: {
    color: '#aaa',
    fontSize: 15,
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#333',
  },
  placeholderPic: {
    backgroundColor: '#333',
  },
  uploadOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  menuDesc: {
    color: '#888',
    fontSize: 13,
  },
  logoutButton: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'center',
  },
  logoutText: {
    color: '#ff453a',
    fontSize: 16,
    fontWeight: '600',
  },
});
