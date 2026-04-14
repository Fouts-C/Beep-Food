import React, { useState } from 'react';
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
} from 'react-native';

export default function BeepScreen() {
  const [car, setCar] = useState('2003 Ford Ranger');
  const [capacity, setCapacity] = useState('10');
  const [singlesRate, setSinglesRate] = useState('6');
  const [groupRate, setGroupRate] = useState('3');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Beep</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startButtonText}>Start Beeping</Text>
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
