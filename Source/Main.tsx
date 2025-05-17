import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
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
  const [items, setItems] = useState('');
  const navigation = useNavigation();
  //isDarkMode will hold true if the device is set to dark mode
  const isDarkMode = useColorScheme() === 'dark';
  
  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#000' : '#fff',
  };

  const textStyle = {
    color: isDarkMode ? '#fff' : '#000',
  };

  const inputStyle = {
    backgroundColor: isDarkMode ? '#1c1c1e' : '#f9f9f9',
    color: isDarkMode ? '#fff' : '#000',
    borderColor: isDarkMode ? '#444' : '#ccc',
  };

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
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <Text style={[styles.header, textStyle]}>Beep Food 📍</Text>

      <MapView style={styles.map} region={region}>
        <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
      </MapView>

      <TextInput
        style={[styles.input, inputStyle]}
        placeholder="Enter pickup location (e.g. Chick-fil-A)"
        placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
        value={pickupLocation}
        onChangeText={setPickupLocation}
      />

      <TextInput
        style={[styles.input, inputStyle, { height: 80 }]}
        placeholder="Enter items to be picked up (e.g. Coffee, Fries)"
        placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
        value={items}
        onChangeText={setItems}
        multiline
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  map: {
    width: '100%',
    height: '40%',
  },
  input: {
    backgroundColor: '#f9f9f9',
    marginHorizontal: 20,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    fontSize: 16,
  },
});