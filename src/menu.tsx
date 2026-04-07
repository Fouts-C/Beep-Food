// terminal 1:
// cd ~/Desktop/Beep-Food/Beep-Food 
// npx react-native start
// terminal 2 paste:
// cd ~/Desktop/Beep-Food/Beep-Food
// npx react-native run-ios --simulator="iPhone 15 Pro"
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';

const restaurants = [
  {
    id: '1',
    name: 'Chick-fil-A',
    category: 'Chicken • Sandwiches',
    time: '15-25 min',
    rating: '4.8',
    image: 'https://via.placeholder.com/400x220.png?text=Chick-fil-A',
  },
  {
    id: '2',
    name: 'McDonald\'s',
    category: 'Burgers • Fast Food',
    time: '10-20 min',
    rating: '4.3',
    image: 'https://via.placeholder.com/400x220.png?text=McDonalds',
  },
  {
    id: '3',
    name: 'Taco Bell',
    category: 'Mexican • Tacos',
    time: '12-22 min',
    rating: '4.1',
    image: 'https://via.placeholder.com/400x220.png?text=Taco+Bell',
  },
  {
    id: '4',
    name: 'Starbucks',
    category: 'Coffee • Breakfast',
    time: '8-18 min',
    rating: '4.6',
    image: 'https://via.placeholder.com/400x220.png?text=Starbucks',
  },
];

export default function Menu({ navigation }: { navigation: any }) {
  const renderRestaurant = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          // later:
          // navigation.navigate('RestaurantDetails', { restaurant: item });
        }}
      >
        <Image source={{ uri: item.image }} style={styles.image} />

        <View style={styles.cardContent}>
          <Text style={styles.restaurantName}>{item.name}</Text>
          <Text style={styles.category}>{item.category}</Text>

          <View style={styles.infoRow}>
            <Text style={styles.rating}>⭐ {item.rating}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Beep Food</Text>
      <Text style={styles.subheader}>Find something good nearby</Text>

      <TextInput
        style={styles.searchBar}
        placeholder="Search food or restaurants"
        placeholderTextColor="#888"
      />

      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id}
        renderItem={renderRestaurant}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000',
    marginTop: 10,
  },
  subheader: {
    fontSize: 15,
    color: '#666',
    marginBottom: 14,
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 16,
    fontSize: 16,
    color: '#000',
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e6e6e6',
  },
  image: {
    width: '100%',
    height: 170,
  },
  cardContent: {
    padding: 12,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  category: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  infoRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  time: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
  },
});