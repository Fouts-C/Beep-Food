import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  useColorScheme,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

// Mock Data
const ACTIVE_DRIVERS = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    rating: '4.9',
    distance: '0.8 miles away',
    car: 'Silver Toyota Camry',
    image: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: '2',
    name: 'Michael Chen',
    rating: '4.7',
    distance: '1.2 miles away',
    car: 'Black Honda Accord',
    image: 'https://i.pravatar.cc/150?img=11'
  },
  {
    id: '3',
    name: 'David Rodriguez',
    rating: '5.0',
    distance: '2.5 miles away',
    car: 'White Tesla Model 3',
    image: 'https://i.pravatar.cc/150?img=12'
  },
  {
    id: '4',
    name: 'Emma Wilson',
    rating: '4.8',
    distance: '3.1 miles away',
    car: 'Blue Ford Fusion',
    image: 'https://i.pravatar.cc/150?img=5'
  }
];

export default function ActiveDriversScreen() {
  const navigation = useNavigation();
  const isDarkMode = useColorScheme() === 'dark';

  const theme = {
    background: isDarkMode ? '#121212' : '#F7F9FC',
    card: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#111827',
    textSecondary: isDarkMode ? '#A1A1AA' : '#6B7280',
    primary: '#4F46E5', // Indigo
    accent: '#10B981', // Emerald for active dot
    border: isDarkMode ? '#27272A' : '#E5E7EB',
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.cardHeader}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: item.image }} style={styles.avatar} />
          <View style={[styles.activeDot, { backgroundColor: theme.accent, borderColor: theme.card }]} />
        </View>
        
        <View style={styles.driverInfo}>
          <Text style={[styles.driverName, { color: theme.text }]}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <MaterialCommunityIcons name="star" size={16} color="#FBBF24" />
            <Text style={[styles.ratingText, { color: theme.textSecondary }]}> {item.rating}</Text>
          </View>
        </View>

        <TouchableOpacity style={[styles.requestButton, { backgroundColor: theme.primary }]}>
          <Text style={styles.requestButtonText}>Request</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />
      
      <View style={styles.cardFooter}>
        <View style={styles.footerItem}>
          <MaterialCommunityIcons name="map-marker-distance" size={18} color={theme.textSecondary} />
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>{item.distance}</Text>
        </View>
        <View style={styles.footerItem}>
          <MaterialCommunityIcons name="car-side" size={18} color={theme.textSecondary} />
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>{item.car}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Active Drivers</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.radarContainer}>
        <MaterialCommunityIcons name="radar" size={32} color={theme.primary} />
        <Text style={[styles.radarText, { color: theme.textSecondary }]}>Scanning for nearby drivers...</Text>
      </View>

      <FlatList
        data={ACTIVE_DRIVERS}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  placeholder: {
    width: 44,
  },
  radarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  radarText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  activeDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  driverInfo: {
    flex: 1,
    marginLeft: 14,
  },
  driverName: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
  },
  requestButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  requestButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginTop: 16,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '500',
  },
});
