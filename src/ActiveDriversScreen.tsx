import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  DeviceEventEmitter,
  StatusBar,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { supabase } from './lib/supabase';

export default function ActiveDriversScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { pickupLocation, deliveryLocation, items } = (route.params as any) || { pickupLocation: 'Current Location', deliveryLocation: '', items: 'Standard Order' };
  
  const [activeDrivers, setActiveDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestedDriverId, setRequestedDriverId] = useState<string | null>(null);

  const fetchActiveDrivers = async () => {
    try {
      const { data, error } = await supabase
        .from('active_drivers')
        .select(`
          driver_id,
          car,
          is_active,
          profiles (
            first_name,
            last_name,
            profile_picture_url
          )
        `)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching drivers:', error);
        return;
      }

      if (data) {
        const formattedDrivers = data.map((d: any) => {
          const firstName = d.profiles?.first_name || '';
          const lastName = d.profiles?.last_name || '';
          const displayName = `${firstName} ${lastName}`.trim();
          
          return {
            id: d.driver_id,
            name: displayName.length > 0 ? displayName : (d.profiles?.username || 'Unknown Driver'),
            rating: '5.0', // Placeholder
            distance: 'Calculating...', // Placeholder since location isn't implemented
            car: d.car,
            image: d.profiles?.profile_picture_url || 'https://i.pravatar.cc/150?img=1'
          };
        });
        setActiveDrivers(formattedDrivers);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveDrivers();

    const channel = supabase
      .channel('active_drivers_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'active_drivers' },
        (payload) => {
          console.log('Realtime change received!', payload);
          fetchActiveDrivers(); // Simplest way to handle joins is to refetch
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const theme = {
    background: '#000000',
    card: '#1E1E1E',
    text: '#ffffff',
    textSecondary: '#8E8E93',
    primary: '#FFCC00',
    accent: '#22c55e',
    border: '#333333',
  };

  const handleRequestDriver = (driverId: string) => {
    setRequestedDriverId(driverId);
    
    // Dispatch mock order
    DeviceEventEmitter.emit('MOCK_NEW_ORDER', {
      id: Math.random().toString(),
      customerName: 'You',
      pickupLocation: pickupLocation,
      deliveryLocation: deliveryLocation,
      items: items,
      status: 'pending'
    });
  };

  const renderItem = ({ item }: { item: any }) => {
    const isRequested = requestedDriverId === item.id;
    return (
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

        <TouchableOpacity 
          style={[styles.requestButton, { backgroundColor: isRequested ? '#22c55e' : theme.primary }]}
          onPress={() => handleRequestDriver(item.id)}
          disabled={isRequested}
        >
          <Text style={[styles.requestButtonText, { color: isRequested ? '#fff' : '#000' }]}>{isRequested ? 'Requested ✓' : 'Request'}</Text>
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
  )};

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
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

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : activeDrivers.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: theme.textSecondary, fontSize: 16 }}>No active beeps right now.</Text>
        </View>
      ) : (
        <FlatList
          data={activeDrivers}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
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
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
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
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
  },
  requestButtonText: {
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
