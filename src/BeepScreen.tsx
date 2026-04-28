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
  DeviceEventEmitter,
} from 'react-native';
import { supabase } from './lib/supabase';
import { AuthService } from './services/AuthService';

interface Order {
  id: string;
  customerName: string;
  pickupLocation: string;
  deliveryLocation: string;
  items: string;
  status: 'pending' | 'accepted' | 'denied';
}

export default function BeepScreen() {
  const [deliveryRate, setDeliveryRate] = useState('6');
  const [isBeeping, setIsBeeping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //Mock Orders Data
  const [orders, setOrders] = useState<Order[]>([
    /*{
      id: '1',
      customerName: 'Alice',
      pickupLocation: 'Chick-fil-A',
      items: 'Spicy Chicken Sandwich, Medium Waffle Fries',
      status: 'pending'
    },
    {
      id: '2',
      customerName: 'Bob',
      pickupLocation: 'Starbucks',
      items: 'Venti Iced Caramel Macchiato',
      status: 'pending'
    }*/
  ]);

  const handleAcceptOrder = (id: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: 'accepted' } : o));
  };

  const handleDenyOrder = (id: string) => {
    // We could mark it as denied, or just remove it from the screen for now
    setOrders(orders.filter(o => o.id !== id));
  };

  useEffect(() => {
    checkInitialBeepStatus();

    // Listen for incoming mock orders globally
    const orderListener = DeviceEventEmitter.addListener('MOCK_NEW_ORDER', (newOrder: Order) => {
      setOrders(prevOrders => [...prevOrders, newOrder]);
    });

    return () => {
      orderListener.remove();
    };
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
        setDeliveryRate(data.singles_rate.toString());
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
          car: "N/A", // Default fallback for deprecated column
          capacity: 1, // Default fallback
          singles_rate: parseFloat(deliveryRate) || 0,
          group_rate: 0,
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
        {/* Delivery Rate Section */}
        <View style={styles.section}>
          <Text style={styles.label}>Delivery Rate</Text>
          <View style={styles.inputContainerWithPrefix}>
            <Text style={styles.currencyPrefix}>$</Text>
            <TextInput
              style={styles.inputWithPrefix}
              value={deliveryRate}
              onChangeText={setDeliveryRate}
              keyboardType="numeric"
              placeholderTextColor="#888"
            />
          </View>
          <Text style={styles.subtext}>
            Price for delivering a food order
          </Text>
        </View>

        {/* Orders Section */}
        <View style={styles.section}>
          <Text style={styles.label}>Incoming Orders</Text>
          {!isBeeping ? (
            <Text style={styles.subtext}>Start beeping to view incoming orders...</Text>
          ) : orders.length === 0 ? (
            <Text style={styles.subtext}>No pending orders right now.</Text>
          ) : (
            orders.map(order => (
              <View key={order.id} style={styles.orderCard}>
                <Text style={styles.orderCustomer}>{order.customerName}</Text>

                <View style={styles.orderLocationRow}>
                  <Text style={styles.orderLocationLabel}>Pickup</Text>
                  <Text style={styles.orderLocationValue}>{order.pickupLocation}</Text>
                </View>

                <View style={styles.orderLocationRow}>
                  <Text style={styles.orderLocationLabel}>Deliver to</Text>
                  <Text style={styles.orderLocationValue}>{order.deliveryLocation || 'Not specified'}</Text>
                </View>

                <View style={styles.orderItemsContainer}>
                  <Text style={styles.orderLocationLabel}>Items</Text>
                  <Text style={styles.orderItems}>{order.items}</Text>
                </View>

                {order.status === 'pending' ? (
                  <View style={styles.orderActions}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.denyButton]}
                      onPress={() => handleDenyOrder(order.id)}
                    >
                      <Text style={styles.denyButtonText}>Deny</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.acceptOrderButton]}
                      onPress={() => handleAcceptOrder(order.id)}
                    >
                      <Text style={styles.acceptButtonText}>Accept</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>ACCEPTED</Text>
                  </View>
                )}
              </View>
            ))
          )}
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
  },
  headerRight: {
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
  orderCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  orderCustomer: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 12,
  },
  orderLocationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  orderLocationLabel: {
    color: '#FFCC00',
    fontSize: 13,
    fontWeight: '700',
    width: 72,
    paddingTop: 1,
  },
  orderLocationValue: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
  orderItemsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 8,
  },
  orderItems: {
    color: '#cccccc',
    fontSize: 15,
    flex: 1,
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  denyButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#EF4444',
    marginRight: 8,
  },
  acceptOrderButton: {
    backgroundColor: '#FFCC00',
    marginLeft: 8,
  },
  denyButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
  },
  acceptButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    backgroundColor: '#22c55e20', // transparent green tint
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#22c55e',
  },
  statusText: {
    color: '#22c55e',
    fontWeight: 'bold',
  },
});
