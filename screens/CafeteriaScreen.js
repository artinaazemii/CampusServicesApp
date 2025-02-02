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
  TextInput,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

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
  // Add sauces for other food items similarly
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

function MenuItem({ item, onAddToCart }) {
  const [selectedSauces, setSelectedSauces] = useState([]);

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
      </View>
      <Button
        title="Add"
        onPress={() => onAddToCart({ ...item, sauces: selectedSauces })}
      />
    </View>
  );
}

function MenuScreen({ navigation, cart, setCart }) {
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

  const totalCartQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.column}>
          <Text style={styles.sectionTitle}>Drinks</Text>
          <FlatList
            data={drinkItems}
            renderItem={({ item }) => (
              <MenuItem item={item} onAddToCart={addToCart} />
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
              <MenuItem item={item} onAddToCart={addToCart} />
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

function CartScreen({ navigation, cart, setCart }) {
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
                  ${(item.price * item.quantity).toFixed(2)}
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

  return (
    <Stack.Navigator>
      <Stack.Screen name="Menu">
        {(props) => (
          <MenuScreen {...props} cart={cart} setCart={setCart} />
        )}
      </Stack.Screen>
      <Stack.Screen name="Cart">
        {(props) => (
          <CartScreen {...props} cart={cart} setCart={setCart} />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  // General Container Styles
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f0f0f0', // Light background for a soft appearance
  },
  column: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff', // Clean white background for menu items
    borderRadius: 10,
    margin: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  separator: {
    width: 1,
    backgroundColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 15,
  },

  // Menu Item Styles
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f9f9f9', // Subtle background for items
    padding: 10,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    marginRight: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  itemPrice: {
    fontSize: 16,
    color: '#000',
    marginTop: 10,
  },
  sauceContainer: {
    marginTop: 10,
  },
  sauceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  sauceButton: {
    padding: 5,
    marginVertical: 5,
    backgroundColor: '#eee',
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  sauceButtonSelected: {
    backgroundColor: '#d1e7dd',
  },

  // Cart Button Styles
  cartButton: {
    padding: 15,
    backgroundColor: '#FF8C00', // Orange for contrast and vibrancy
    alignItems: 'center',
    margin: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  cartButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  // Cart Screen Styles
  cartContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  flatListContent: {
    paddingBottom: 100, // Ensure there's space for the checkout button
  },
  emptyCart: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: '#888',
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#f7f7f7', // Light grey background for cart items
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    shadowColor: '#ddd',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  saucesList: {
    marginTop: 10,
  },
  sauceItem: {
    fontSize: 14,
    color: '#555',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 15,
    color: '#444',
  },
  itemTotal: {
    fontSize: 16,
    width: 70,
    textAlign: 'right',
    color: '#333',
  },

  // Checkout Button Styles
  checkoutContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    zIndex: 1,
    shadowColor: '#ddd',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 10,
    color: '#333',
  },
  checkoutButton: {
    backgroundColor: '#28a745', // Fresh green for the checkout button
    paddingVertical: 15,
    borderRadius: 8,
    shadowColor: '#28a745',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },

  // Review Styles
  reviewContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  reviewInput: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
  },
  reviewButton: {
    marginTop: 10,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  reviewButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});