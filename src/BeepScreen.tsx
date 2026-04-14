import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { supabase } from './lib/supabase';
import { AuthService } from './services/AuthService';

export default function BeepScreen() {
  const [car, setCar] = useState('2003 Ford Ranger');
  const [capacity, setCapacity] = useState('10');
  const [singlesRate, setSinglesRate] = useState('6');
  const [groupRate, setGroupRate] = useState('3');
  const [isBeeping, setIsBeeping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkInitialBeepStatus();
  }, []);

  const checkInitialBeepStatus = async () => {
    try {
      const user = await AuthService.getCurrentUser();
      if (!user) return;
      const { data, error } = await supabase
        .from('active_drivers')
        .select('*')
        .eq('driver_id', user.id)
        .single();
        
      if (data && data.is_active) {
        setIsBeeping(true);
        setCar(data.car);
        setCapacity(data.capacity.toString());
        setSinglesRate(data.singles_rate.toString());
        setGroupRate(data.group_rate.toString());
      }
    } catch (e) {
      console.log('No existing active driver found or error:', e);
    }
  };

  const toggleBeeping = async () => {
    setIsLoading(true);
    try {
      const user = await AuthService.getCurrentUser();
      if (!user) {
        Alert.alert('Error', 'You must be logged in to beep.');
        setIsLoading(false);
        return;
      }
      
      const newStatus = !isBeeping;
      
      const { error } = await supabase
        .from('active_drivers')
        .upsert({
          driver_id: user.id,
          car: car,
          capacity: parseInt(capacity) || 1,
          singles_rate: parseFloat(singlesRate) || 0,
          group_rate: parseFloat(groupRate) || 0,
          is_active: newStatus
        });

      if (error) throw error;
      
      setIsBeeping(newStatus);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update beeping status');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Beep</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={[styles.startButton, isBeeping && styles.stopButton]} 
            onPress={toggleBeeping}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.startButtonText}>
                {isBeeping ? 'Stop Beeping' : 'Start Beeping'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Car Section */}
        <View style={styles.section}>
          <Text style={styles.label}>Car</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={car}
              onChangeText={setCar}
              placeholderTextColor="#888"
            />
          </View>
        </View>

        {/* Max Rider Capacity Section */}
        <View style={styles.section}>
          <Text style={styles.label}>Max Rider Capacity</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={capacity}
              onChangeText={setCapacity}
              keyboardType="numeric"
              placeholderTextColor="#888"
            />
          </View>
          <Text style={styles.subtext}>
            Maximum number of riders you can safely fit in your car
          </Text>
        </View>

        {/* Singles Rate Section */}
        <View style={styles.section}>
          <Text style={styles.label}>Singles Rate</Text>
          <View style={styles.inputContainerWithPrefix}>
            <Text style={styles.currencyPrefix}>$</Text>
            <TextInput
              style={styles.inputWithPrefix}
              value={singlesRate}
              onChangeText={setSinglesRate}
              keyboardType="numeric"
              placeholderTextColor="#888"
            />
          </View>
          <Text style={styles.subtext}>
            Price for a single person riding alone
          </Text>
        </View>

        {/* Group Rate Section */}
        <View style={styles.section}>
          <Text style={styles.label}>Group Rate</Text>
          <View style={styles.inputContainerWithPrefix}>
            <Text style={styles.currencyPrefix}>$</Text>
            <TextInput
              style={styles.inputWithPrefix}
              value={groupRate}
              onChangeText={setGroupRate}
              keyboardType="numeric"
              placeholderTextColor="#888"
            />
          </View>
          <Text style={styles.subtext}>Price per person in a group</Text>
        </View>

        {/* Additional padding to clear the absolute tab bar */}
        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  headerRight: {
    position: 'absolute',
    right: 20,
  },
  startButton: {
    backgroundColor: '#FFCC00', // Bright blue matching the design
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  stopButton: {
    backgroundColor: '#EF4444', // Red for stop
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333333',
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 4,
  },
  inputContainerWithPrefix: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333333',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 4,
  },
  currencyPrefix: {
    color: '#ffffff',
    fontSize: 16,
    marginRight: 10,
  },
  input: {
    color: '#ffffff',
    fontSize: 16,
  },
  inputWithPrefix: {
    color: '#ffffff',
    fontSize: 16,
    flex: 1,
  },
  subtext: {
    color: '#8E8E93',
    fontSize: 14,
    marginTop: 8,
  },
});
