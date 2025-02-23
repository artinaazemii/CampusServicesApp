// TransportScreen.web.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TransportScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.webMessage}>Map functionality is not available on the web, please use the phone.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f1f1', // Light background color
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  webMessage: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333', // Darker text for better contrast
    marginBottom: 20,
    textTransform: 'uppercase', // Makes the message look more impactful
    letterSpacing: 1.5,
    lineHeight: 28, // Adding more line height for better readability
    paddingHorizontal: 15,
    backgroundColor: '#ff5722', // Fancy background color
    color: '#fff', // White text color
    paddingVertical: 12,
    borderRadius: 10, // Rounded corners for the message box
    shadowColor: '#000', // Adding shadow for depth
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
});
