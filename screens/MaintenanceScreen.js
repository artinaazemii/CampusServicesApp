import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Image, Modal, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

const initialRequests = [
  {
    id: '1',
    category: 'Plumbing',
    description: 'Leaky faucet in bathroom',
    status: 'Completed',
    date: '2024-03-15',
    urgency: 'Medium',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: '2',
    category: 'Electrical',
    description: 'Flickering lights in classroom',
    status: 'In Progress',
    date: '2024-03-16',
    urgency: 'High',
    image: 'https://via.placeholder.com/150',
  },
];

export default function MaintenanceScreen() {
  const [requests, setRequests] = useState(initialRequests);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('Medium');
  const [image, setImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = () => {
    if (!category || !description) {
      if (Platform.OS === 'web') {
        window.alert('Please fill all required fields');
      } else {
        Alert.alert('Error', 'Please fill all required fields');
      }
      return;
    }

    const newRequest = {
      id: Date.now().toString(),
      category,
      description,
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

    if (Platform.OS === 'web') {
      window.alert('Request submitted successfully!');
    } else {
      Alert.alert('Success', 'Request submitted successfully!');
    }
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

  const viewImage = (uri) => {
    setSelectedImage(uri);
    setModalVisible(true);
  };

  const filteredRequests = requests.filter(request =>
    request.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity style={[styles.requestItem, styles[item.status.replace(/\s+/g, '')]]} onPress={() => { setSelectedRequest(item); setModalVisible(true); }}>
      <Ionicons name={item.category === 'Plumbing' ? 'water' : item.category === 'Electrical' ? 'flash' : 'build'} size={24} color="#333" />
      <Text style={styles.requestCategory}>{item.category}</Text>
      <Text style={styles.requestDescription}>{item.description}</Text>
      {item.image && (
        <TouchableOpacity onPress={() => viewImage(item.image)}>
          <Image source={{ uri: item.image }} style={styles.requestImageSmall} />
        </TouchableOpacity>
      )}
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>Status: {item.status}</Text>
        <Text style={styles.urgencyText}>Urgency: {item.urgency}</Text>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>New Maintenance Request</Text>
          <Picker selectedValue={category} onValueChange={(itemValue) => setCategory(itemValue)} style={styles.picker}>
            <Picker.Item label="Select Category" value="" />
            <Picker.Item label="Plumbing" value="Plumbing" />
            <Picker.Item label="Electrical" value="Electrical" />
            <Picker.Item label="HVAC" value="HVAC" />
            <Picker.Item label="Structural" value="Structural" />
          </Picker>
          <TextInput style={styles.input} placeholder="Description of the problem" multiline numberOfLines={4} value={description} onChangeText={setDescription} />
          
          <View style={styles.urgencyButtons}>
            <Button title="Low" onPress={() => setUrgency('Low')} color={urgency === 'Low' ? '#27ae60' : '#3498db'} />
            <Button title="Medium" onPress={() => setUrgency('Medium')} color={urgency === 'Medium' ? '#f39c12' : '#3498db'} />
            <Button title="High" onPress={() => setUrgency('High')} color={urgency === 'High' ? '#e74c3c' : '#3498db'} />
          </View>

          <Button title="Attach Photo" onPress={pickImage} />
          {image && <Image source={{ uri: image }} style={styles.previewImage} />}
          <Button title="Submit Request" onPress={handleSubmit} color="#2ecc71" />
        </View>
        
        <TextInput
          style={styles.searchInput}
          placeholder="Search Requests..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        
        <Text style={styles.sectionTitle}>Previous Requests</Text>
        <FlatList data={filteredRequests} renderItem={renderItem} keyExtractor={item => item.id} />
        
        <Modal visible={modalVisible} transparent={true} animationType="fade" onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={40} color="white" />
            </TouchableOpacity>
            <Image source={{ uri: selectedImage }} style={styles.modalImage} />
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 10, backgroundColor: '#f5f5f5' },
  formContainer: { marginBottom: 20, padding: 15, backgroundColor: '#ffffff', borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 5 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginVertical: 10, color: '#333' },
  picker: { backgroundColor: '#fff', marginVertical: 5 },
  input: { backgroundColor: '#fff', borderColor: '#ddd', borderWidth: 1, borderRadius: 5, padding: 10, marginVertical: 5, minHeight: 80 },
  previewImage: { width: 100, height: 100, marginVertical: 10, borderRadius: 10 },
  searchInput: { backgroundColor: '#fff', borderColor: '#ddd', borderWidth: 1, borderRadius: 5, padding: 10, marginVertical: 10, fontSize: 16 },
  urgencyButtons: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
  requestItem: { backgroundColor: '#fff', padding: 15, marginBottom: 10, borderRadius: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 5, flexDirection: 'column' },
  requestCategory: { fontWeight: 'bold', fontSize: 16, marginTop: 5 },
  requestDescription: { color: '#666', marginVertical: 5 },
  requestImageSmall: { width: 50, height: 50, marginVertical: 10, borderRadius: 10, alignSelf: 'flex-start' },
  statusContainer: { flexDirection: 'column', marginTop: 10 },
  statusText: { color: '#666', fontWeight: 'bold' },
  urgencyText: { color: '#666' },
  dateText: { color: '#666' },
  Completed: { borderLeftColor: '#2ecc71', borderLeftWidth: 5 },
  InProgress: { borderLeftColor: '#f1c40f', borderLeftWidth: 5 },
  Submitted: { borderLeftColor: '#3498db', borderLeftWidth: 5 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)' },
  modalImage: { width: '90%', height: '80%', borderRadius: 10 },
  modalCloseButton: { position: 'absolute', top: 20, right: 20 },
});
