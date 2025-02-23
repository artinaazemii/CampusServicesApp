// TransportScreen.native.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';

// Mock vehicle data
const initialVehicles = [
  {
    id: 'bus1',
    name: 'Campus Shuttle A',
    route: 'Main Campus Loop',
    latitude: 37.7749,
    longitude: -122.4194,
    status: 'On Time'
  },
  {
    id: 'bus2',
    name: 'Campus Shuttle B',
    route: 'North Campus Express',
    latitude: 37.7760,
    longitude: -122.4180,
    status: 'Delayed'
  }
];

export default function TransportScreen() {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [userLocation, setUserLocation] = useState(null);

  // Get user location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);
    })();
  }, []);

  // Simulate vehicle movement
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles(prevVehicles => 
        prevVehicles.map(vehicle => ({
          ...vehicle,
          latitude: vehicle.latitude + (Math.random() * 0.001 - 0.0005),
          longitude: vehicle.longitude + (Math.random() * 0.001 - 0.0005)
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.7749,
          longitude: -122.4194,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude
            }}
            title="Your Location"
            pinColor="blue"
          />
        )}
        
        {vehicles.map(vehicle => (
          <Marker
            key={vehicle.id}
            coordinate={{
              latitude: vehicle.latitude,
              longitude: vehicle.longitude
            }}
          >
            <View style={styles.marker}>
              <Text>🚌</Text>
            </View>
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.vehicleName}>{vehicle.name}</Text>
                <Text>Route: {vehicle.route}</Text>
                <Text>Status: {vehicle.status}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <TouchableOpacity 
        style={styles.refreshButton}
        onPress={() => setVehicles([...vehicles])}
      >
        <Text style={styles.refreshText}>🔄 Refresh</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  marker: {
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  callout: {
    width: 200,
    padding: 10,
  },
  vehicleName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  refreshButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  refreshText: {
    fontWeight: 'bold',
  }
});