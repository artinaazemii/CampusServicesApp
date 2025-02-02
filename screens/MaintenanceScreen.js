import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialRequests = [
  {
    id: '1',
    category: 'Plumbing',
    description: 'Leaky faucet in bathroom',
    status: 'Completed',
    date: '2023-03-15',
    urgency: 'Medium',
    image: null,
  },
  {
    id: '2',
    category: 'Electrical',
    description: 'Flickering lights in classroom',
    status: 'In Progress',
    date: '2023-03-16',
    urgency: 'High',
    image: null,
  },
];

export default function MaintenanceScreen() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('Medium');
  const [image, setImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Helper function for alerts, handles web platform
  const showAlert = (title, message) => {
    if (Platform.OS === 'web') {
      alert(`${title}\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  // Load requests from AsyncStorage when the component mounts
  useEffect(() => {
    const loadRequests = async () => {
      try {
        const savedRequests = await AsyncStorage.getItem('maintenanceRequests');
        if (savedRequests !== null) {
          setRequests(JSON.parse(savedRequests));
        } else {
          setRequests(initialRequests);
        }
      } catch (error) {
        console.error('Failed to load requests', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRequests();
  }, []);

  // Save requests to AsyncStorage whenever they change
  useEffect(() => {
    const saveRequests = async () => {
      try {
        await AsyncStorage.setItem('maintenanceRequests', JSON.stringify(requests));
      } catch (error) {
        console.error('Failed to save requests', error);
      }
    };

    if (!isLoading) {
      saveRequests();
    }
  }, [requests]);

  const handleSubmit = () => {
    if (!category.trim() || !description.trim()) {
      showAlert('Error', 'Please fill all required fields');
      return;
    }

    const newRequest = {
      id: Date.now().toString(),
      category: category.trim(),
      description: description.trim(),
      status: 'Submitted',
      date: new Date().toLocaleDateString(),
      urgency,
      image,
    };

    setRequests([newRequest, ...requests]);
    setCategory('');
    setDescription('');
    setUrgency('Medium');
    setImage(null);
    showAlert('Success', 'Request submitted successfully!');
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleImagePress = () => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  const openItemImage = (itemImage) => {
    setSelectedImage(itemImage);
    setModalVisible(true);
  };

  // Filter requests by search term
  const filteredRequests = requests.filter(
    (item) =>
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.urgency.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={[styles.requestItem, styles[item.status.replace(/\s+/g, '')]]}>
      <View style={styles.requestContent}>
        {item.image && (
          <TouchableOpacity onPress={() => openItemImage(item.image)}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: item.image }}
                style={styles.imageSmall}
                resizeMode="cover"
              />
            </View>
          </TouchableOpacity>
        )}
        <View style={styles.requestText}>
          <Text style={styles.requestCategory}>{item.category}</Text>
          <Text style={styles.requestDescription}>{item.description}</Text>
        </View>
      </View>
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>Status: {item.status}</Text>
        <Text style={styles.urgencyText}>Urgency: {item.urgency}</Text>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Requests...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>New Maintenance Request</Text>

        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Category" value="" />
          <Picker.Item label="Plumbing" value="Plumbing" />
          <Picker.Item label="Electrical" value="Electrical" />
          <Picker.Item label="HVAC" value="HVAC" />
          <Picker.Item label="Structural" value="Structural" />
        </Picker>

        <TextInput
          style={styles.input}
          placeholder="Description of the problem"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={(text) => setDescription(text)}
        />

        <View style={styles.urgencyContainer}>
          <Text style={styles.urgencyLabel}>Urgency:</Text>
          {['Low', 'Medium', 'High'].map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.urgencyButton,
                urgency === level && styles.selectedUrgency,
                styles[`urgency${level}`],
              ]}
              onPress={() => setUrgency(level)}
            >
              <Text style={styles.urgencyButtonText}>{level}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button title="Attach Photo" onPress={pickImage} />

        {image && (
          <View style={styles.imageRow}>
            <TouchableOpacity onPress={handleImagePress}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: image }}
                  style={styles.imageSmall}
                  resizeMode="cover"
                />
              </View>
            </TouchableOpacity>
          </View>
        )}

        <Button title="Submit Request" onPress={handleSubmit} color="#2ecc71" />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Requests"
          value={searchTerm}
          onChangeText={(text) => setSearchTerm(text)}
        />
      </View>

      <Text style={styles.sectionTitle}>Previous Requests</Text>

      <FlatList
        data={filteredRequests}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />

      {/* Modal for Enlarged Image */}
      {selectedImage && (
        <Modal visible={modalVisible} transparent={true} onRequestClose={handleCloseModal}>
          <View style={styles.modalBackground}>
            <TouchableOpacity style={styles.modalContainer} onPress={handleCloseModal} activeOpacity={1}>
              <Image source={{ uri: selectedImage }} style={styles.fullImage} resizeMode="contain" />
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f1f1f1',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
  },
  formContainer: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2ecc71',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 1,
  },
  // Form input styles
  picker: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginVertical: 10,
    minHeight: 80,
    fontSize: 16,
    color: '#333',
  },
  // Urgency button styles
  urgencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  urgencyLabel: {
    fontSize: 16,
    color: '#555',
    marginRight: 15,
  },
  urgencyButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3, // Shadow effect
  },
  selectedUrgency: {
    backgroundColor: '#2ecc71',
    borderColor: '#27ae60',
  },
  urgencyLow: {
    backgroundColor: '#c8e6c9',
  },
  urgencyMedium: {
    backgroundColor: '#fff3e0',
  },
  urgencyHigh: {
    backgroundColor: '#ffcdd2',
  },
  urgencyButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  // Image preview styles
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15,
  },
  imageContainer: {
    width: 70,
    height: 70,
    overflow: 'hidden',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
  },
  imageSmall: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  // Modal styles
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    height: '80%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fullImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  // List item styles
  requestItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 12,
    borderLeftWidth: 6,
    borderLeftColor: '#2ecc71',
    shadowColor: '#ccc',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  Submitted: {
    borderLeftColor: '#3498db',
  },
  InProgress: {
    borderLeftColor: '#f1c40f',
  },
  Completed: {
    borderLeftColor: '#2ecc71',
  },
  requestContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requestText: {
    flex: 1,
    paddingLeft: 15,
  },
  requestCategory: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  requestDescription: {
    color: '#666',
    marginVertical: 5,
    fontSize: 14,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statusText: {
    color: '#666',
    fontSize: 14,
  },
  urgencyText: {
    color: '#666',
    fontSize: 14,
  },
  dateText: {
    color: '#888',
    fontSize: 14,
  },
  list: {
    flex: 1,
    marginTop: 20,
  },
  // Button Styles
  button: {
    backgroundColor: '#2ecc71',
    paddingVertical: 12,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

