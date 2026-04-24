import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useColorScheme } from 'react-native';

export default function Main() {
  const [region, setRegion] = useState<Region>({
    latitude: 37.78825, // Default fallback location
    longitude: -122.4324,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [pickupLocation, setPickupLocation] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [items, setItems] = useState('');
  const navigation = useNavigation();
  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        setRegion({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      },
      (error) => {
        console.log(error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <Text style={styles.header}>Beep Food 📍</Text>

      <MapView style={styles.map} region={region}>
        <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
      </MapView>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Pickup Location</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Chick-fil-A"
          placeholderTextColor="#888"
          value={pickupLocation}
          onChangeText={setPickupLocation}
        />

        <Text style={styles.label}>Delivery Location</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 123 Rivers St"
          placeholderTextColor="#888"
          value={deliveryLocation}
          onChangeText={setDeliveryLocation}
        />

        <Text style={styles.label}>Items</Text>
        <TextInput
          style={[styles.input, { height: 56 }]}
          placeholder="e.g. Coffee, Fries"
          placeholderTextColor="#888"
          value={items}
          onChangeText={setItems}
          multiline
        />

        <TouchableOpacity
          style={styles.findDeliverButton}
          onPress={() => (navigation as any).navigate('ActiveDrivers', { pickupLocation, deliveryLocation, items })}
        >
          <Text style={styles.findDeliverButtonText}>Find Driver</Text>
        </TouchableOpacity>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
    color: '#ffffff',
  },
  map: {
    width: '100%',
    height: '40%',
  },
  scrollContent: {
    paddingTop: 4,
  },
  label: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#1E1E1E',
    color: '#ffffff',
    marginHorizontal: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderColor: '#333333',
    borderWidth: 1,
    fontSize: 16,
  },
  findDeliverButton: {
    backgroundColor: '#FFCC00',
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    //shadowColor: '#000000ff',
    //shadowOffset: { width: 0, height: 4 },
    //shadowOpacity: 0.3,
    //shadowRadius: 6,
    //elevation: 4,
  },
  findDeliverButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});