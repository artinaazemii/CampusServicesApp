import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Button,
  Alert,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Rating } from 'react-native-ratings'; // Import the Rating component

const foodItems = [
  {
    id: '1',
    name: 'Cheeseburger',
    price: 8.99,
    description: 'Juicy beef patty with cheese',
    image: require('../assets/cafe-item.jpg'),
    sauces: [
      { id: 's1', name: 'Ketchup', price: 0.50 },
      { id: 's2', name: 'Mustard', price: 0.50 },
      { id: 's3', name: 'Mayo', price: 0.50 },
    ],
  },
  {
    id: '2',
    name: 'Caesar Salad',
    price: 6.99,
    description: 'Fresh romaine lettuce with dressing',
    image: require('../assets/caesar-salad.avif'),
    sauces: [
      { id: 's1', name: 'Ketchup', price: 0.50 },
      { id: 's2', name: 'Mustard', price: 0.50 },
      { id: 's3', name: 'Mayo', price: 0.50 },
    ],
  },
  {
    id: '3',
    name: 'Grilled Chicken Sandwich',
    price: 7.99,
    description: 'Grilled chicken breast with lettuce and tomato',
    image: require('../assets/sandwich.avif'),
    sauces: [
      { id: 's1', name: 'Ketchup', price: 0.50 },
      { id: 's2', name: 'Mustard', price: 0.50 },
      { id: 's3', name: 'Mayo', price: 0.50 },
    ],
  },
  {
    id: '4',
    name: 'Veggie Wrap',
    price: 5.99,
    description: 'Mixed vegetables wrapped in a tortilla',
    image: require('../assets/veggiewrap.avif'),
    sauces: [
      { id: 's1', name: 'Ketchup', price: 0.50 },
      { id: 's2', name: 'Mustard', price: 0.50 },
      { id: 's3', name: 'Mayo', price: 0.50 },
    ],
  },
  {
    id: '5',
    name: 'French Fries',
    price: 2.99,
    description: 'Crispy golden fries',
    image: require('../assets/frenchfries.avif'),
    sauces: [
      { id: 's1', name: 'Ketchup', price: 0.50 },
      { id: 's2', name: 'Mustard', price: 0.50 },
      { id: 's3', name: 'Mayo', price: 0.50 },
    ],
  },
  {
    id: '6',
    name: 'Spaghetti Bolognese',
    price: 9.99,
    description: 'Spaghetti with rich bolognese sauce',
    image: require('../assets/spaghetti.avif'),
    sauces: [
      { id: 's1', name: 'Ketchup', price: 0.50 },
      { id: 's2', name: 'Mustard', price: 0.50 },
      { id: 's3', name: 'Mayo', price: 0.50 },
    ],
  },
  {
    id: '7',
    name: 'Margherita Pizza',
    price: 10.99,
    description: 'Classic pizza with tomato, mozzarella, and basil',
    image: require('../assets/pizza.avif'),
    sauces: [
      { id: 's1', name: 'Ketchup', price: 0.50 },
      { id: 's2', name: 'Mustard', price: 0.50 },
      { id: 's3', name: 'Mayo', price: 0.50 },
    ],
  },
  {
    id: '8',
    name: 'Fish Tacos',
    price: 8.49,
    description: 'Crispy fish tacos with fresh salsa',
    image: require('../assets/fishtacos.avif'),
    sauces: [
      { id: 's1', name: 'Ketchup', price: 0.50 },
      { id: 's2', name: 'Mustard', price: 0.50 },
      { id: 's3', name: 'Mayo', price: 0.50 },
    ],
  },
];

const drinkItems = [
  {
    id: '9',
    name: 'Iced Coffee',
    price: 3.49,
    description: 'Cold brew coffee with ice',
    image: require('../assets/icecoffe.avif'),
  },
  {
    id: '10',
    name: 'Lemonade',
    price: 2.99,
    description: 'Refreshing lemonade with a hint of mint',
    image: require('../assets/lemonade.avif'),
  },
  {
    id: '11',
    name: 'Hot Chocolate',
    price: 2.49,
    description: 'Warm and creamy hot chocolate',
    image: require('../assets/hotChocolate.avif'),
  },
  {
    id: '12',
    name: 'Green Tea',
    price: 1.99,
    description: 'Fresh brewed green tea',
    image: require('../assets/greenttea.avif'),
  },
  {
    id: '13',
    name: 'Smoothie',
    price: 4.99,
    description: 'Blended fruit smoothie',
    image: require('../assets/smoothie.avif'),
  },
  {
    id: '14',
    name: 'Soda',
    price: 1.49,
    description: 'Carbonated soft drink',
    image: require('../assets/soda.avif'),
  },
  {
    id: '15',
    name: 'Espresso',
    price: 2.99,
    description: 'Strong and rich espresso',
    image: require('../assets/espresso.avif'),
  },
];

function MenuItem({ item, onAddToCart, onAddReview }) {
  const [selectedSauces, setSelectedSauces] = useState([]);
  const [rating, setRating] = useState(0); // State for star rating

  const handleSauceToggle = (sauce) => {
    if (selectedSauces.includes(sauce)) {
      setSelectedSauces(selectedSauces.filter((s) => s !== sauce));
    } else {
      setSelectedSauces([...selectedSauces, sauce]);
    }
  };

  return (
    <View style={styles.menuItem}>
      <Image source={item.image} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
        {item.sauces && (
          <View style={styles.sauceContainer}>
            <Text style={styles.sauceTitle}>Extra Sauces:</Text>
            {item.sauces.map((sauce) => (
              <TouchableOpacity
                key={sauce.id}
                style={[
                  styles.sauceButton,
                  selectedSauces.includes(sauce) && styles.sauceButtonSelected,
                ]}
                onPress={() => handleSauceToggle(sauce)}
              >
                <Text>{sauce.name} (${sauce.price.toFixed(2)})</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingTitle}>Rate this item:</Text>
          <Rating
            type="star"
            ratingCount={5}
            imageSize={30}
            startingValue={rating}
            onFinishRating={(value) => setRating(value)}
            style={styles.ratingStars}
          />
        </View>
        <Button
          title="Submit Review"
          onPress={() => {
            onAddReview(item.id, rating);
            setRating(0); // Reset rating after submission
            Alert.alert('Review Submitted', 'Thank you for your review!');
          }}
        />
      </View>
      <Button
        title="Add"
        onPress={() => onAddToCart({ ...item, sauces: selectedSauces })}
      />
    </View>
  );
}

function MenuScreen({ navigation, cart, setCart, reviews, setReviews }) {
  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === item.id);
      if (existingItem) {
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const addReview = (itemId, rating) => {
    setReviews((prevReviews) => ({
      ...prevReviews,
      [itemId]: [...(prevReviews[itemId] || []), rating],
    }));
  };

  const totalCartQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.column}>
          <Text style={styles.sectionTitle}>Drinks</Text>
          <FlatList
            data={drinkItems}
            renderItem={({ item }) => (
              <MenuItem item={item} onAddToCart={addToCart} onAddReview={addReview} />
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
        <View style={styles.separator}></View>
        <View style={styles.column}>
          <Text style={styles.sectionTitle}>Foods</Text>
          <FlatList
            data={foodItems}
            renderItem={({ item }) => (
              <MenuItem item={item} onAddToCart={addToCart} onAddReview={addReview} />
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
      <TouchableOpacity
        style={styles.cartButton}
        onPress={() => navigation.navigate('Cart')}
      >
        <Text style={styles.cartButtonText}>
          View Cart ({totalCartQuantity})
        </Text>
      </TouchableOpacity>
    </>
  );
}

function CartScreen({ navigation, cart, setCart, reviews }) {
  const total = cart.reduce((sum, item) => {
    const saucesTotal = item.sauces
      ? item.sauces.reduce((sauceSum, sauce) => sauceSum + sauce.price, 0)
      : 0;
    return sum + (item.price + saucesTotal) * item.quantity;
  }, 0);

  const updateQuantity = (itemId, change) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === itemId) {
            const newQuantity = item.quantity + change;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handleCheckout = () => {
    Alert.alert(
      'Order Submitted',
      'Your order has been placed successfully!',
      [
        {
          text: 'OK',
          onPress: () => {
            setCart([]);
            navigation.navigate('Menu');
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.cartContainer}>
      {cart.length === 0 ? (
        <Text style={styles.emptyCart}>Your cart is empty.</Text>
      ) : (
        <>
          <FlatList
            data={cart}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <Text style={styles.itemName}>{item.name}</Text>
                <View style={styles.quantityControls}>
                  <Button
                    title="-"
                    onPress={() => updateQuantity(item.id, -1)}
                  />
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <Button
                    title="+"
                    onPress={() => updateQuantity(item.id, 1)}
                  />
                </View>
                <Text style={styles.itemTotal}>
                  ${((item.price + item.sauces.reduce((sum, sauce) => sum + sauce.price, 0)) * item.quantity).toFixed(2)}
                </Text>
                {item.sauces && (
                  <View style={styles.saucesList}>
                    {item.sauces.map((sauce) => (
                      <Text key={sauce.id} style={styles.sauceItem}>
                        {sauce.name} (${sauce.price.toFixed(2)})
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.flatListContent}
          />
          <View style={styles.checkoutContainer}>
            <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
            <TouchableOpacity
              style={[styles.checkoutButton, { pointerEvents: 'auto' }]}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutButtonText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const Stack = createStackNavigator();

export default function CafeteriaStack() {
  const [cart, setCart] = useState([]);
  const [reviews, setReviews] = useState({});

  return (
    <Stack.Navigator>
      <Stack.Screen name="Menu">
        {(props) => (
          <MenuScreen {...props} cart={cart} setCart={setCart} reviews={reviews} setReviews={setReviews} />
        )}
      </Stack.Screen>
      <Stack.Screen name="Cart">
        {(props) => (
          <CartScreen {...props} cart={cart} setCart={setCart} reviews={reviews} />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  column: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,  },
    cartButton: {
      backgroundColor: '#007BFF',
      padding: 10,
      borderRadius: 5,
      position: 'absolute',
      bottom: 20,
      alignSelf: 'center',
    },
    cartButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    menuItem: {
      flexDirection: 'row',
      marginVertical: 10,
      padding: 10,
      backgroundColor: '#fff',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 3,
    },
    itemImage: {
      width: 80,
      height: 80,
      borderRadius: 10,
      marginRight: 10,
    },
    itemInfo: {
      flex: 1,
      justifyContent: 'space-between',
    },
    itemName: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    itemDescription: {
      fontSize: 14,
      color: '#666',
    },
    itemPrice: {
      fontSize: 16,
      color: '#333',
    },
    sauceContainer: {
      marginVertical: 10,
    },
    sauceTitle: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    sauceButton: {
      padding: 5,
      marginVertical: 5,
      backgroundColor: '#f0f0f0',
      borderRadius: 5,
    },
    sauceButtonSelected: {
      backgroundColor: '#c0c0c0',
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    ratingTitle: {
      fontSize: 14,
      marginRight: 10,
    },
    ratingStars: {
      flex: 1,
    },
    cartContainer: {
      flex: 1,
      padding: 10,
    },
    emptyCart: {
      fontSize: 18,
      textAlign: 'center',
      marginVertical: 20,
    },
    cartItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    quantityControls: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    quantityText: {
      marginHorizontal: 10,
      fontSize: 16,
    },
    itemTotal: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    saucesList: {
      marginTop: 5,
    },
    sauceItem: {
      fontSize: 14,
      color: '#666',
    },
    flatListContent: {
      paddingBottom: 80, // To avoid overlapping with the checkout button
    },
    checkoutContainer: {
      padding: 10,
      borderTopWidth: 1,
      borderTopColor: '#ccc',
    },
    total: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    checkoutButton: {
      backgroundColor: '#007BFF',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    checkoutButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
  });
  
  