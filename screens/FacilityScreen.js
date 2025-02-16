import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, StyleSheet, Button, TextInput, Platform, Alert } from 'react-native';

// Updated facilities data...
const facilities = [
  { id: '1', name: 'Basketball Court', type: 'Sports', capacity: 20, slots: [{ time: '09:00 - 10:00', booked: false }, { time: '10:00 - 11:00', booked: false }, { time: '11:00 - 12:00', booked: true }, { time: '14:00 - 15:00', booked: false }] },
  { id: '2', name: 'Conference Room A', type: 'Meeting', capacity: 10, slots: [{ time: '09:00 - 10:00', booked: false }, { time: '10:00 - 11:00', booked: false }, { time: '13:00 - 14:00', booked: false }] },
  { id: '3', name: 'Swimming Pool', type: 'Recreation', capacity: 30, slots: [{ time: '08:00 - 09:00', booked: false }, { time: '10:00 - 11:00', booked: false }, { time: '12:00 - 13:00', booked: true }, { time: '15:00 - 16:00', booked: false }] },
  { id: '4', name: 'Tennis Court', type: 'Sports', capacity: 4, slots: [{ time: '07:00 - 08:00', booked: false }, { time: '09:00 - 10:00', booked: false }, { time: '11:00 - 12:00', booked: false }, { time: '13:00 - 14:00', booked: true }] },
  { id: '5', name: 'Conference Room B', type: 'Meeting', capacity: 15, slots: [{ time: '09:00 - 10:00', booked: false }, { time: '11:00 - 12:00', booked: false }, { time: '14:00 - 15:00', booked: false }] },
  { id: '6', name: 'Gym', type: 'Sports', capacity: 50, slots: [{ time: '06:00 - 07:00', booked: false }, { time: '07:00 - 08:00', booked: true }, { time: '08:00 - 09:00', booked: false }, { time: '09:00 - 10:00', booked: false }] },
  { id: '7', name: 'Yoga Studio', type: 'Recreation', capacity: 15, slots: [{ time: '06:00 - 07:00', booked: false }, { time: '07:00 - 08:00', booked: false }, { time: '08:00 - 09:00', booked: true }, { time: '10:00 - 11:00', booked: false }] },
  { id: '8', name: 'Outdoor Amphitheater', type: 'Event', capacity: 100, slots: [{ time: '10:00 - 11:00', booked: false }, { time: '11:00 - 12:00', booked: false }, { time: '13:00 - 14:00', booked: false }] },
  { id: '9', name: 'Art Gallery', type: 'Exhibit', capacity: 25, slots: [{ time: '09:00 - 10:00', booked: false }, { time: '10:00 - 11:00', booked: false }, { time: '11:00 - 12:00', booked: true }] },
  { id: '10', name: 'Library', type: 'Study', capacity: 30, slots: [{ time: '09:00 - 10:00', booked: false }, { time: '10:00 - 11:00', booked: false }, { time: '14:00 - 15:00', booked: false }] },
];

function FacilityItem({ facility, onPress }) {
  const availableSlots = facility.slots.filter(slot => !slot.booked).length;

  return (
    <TouchableOpacity style={styles.facilityItem} onPress={() => onPress(facility)}>
      <Text style={styles.facilityName}>{facility.name}</Text>
      <Text style={styles.facilityDetails}>Type: {facility.type}</Text>
      <Text style={styles.facilityDetails}>Capacity: {facility.capacity}</Text>
      <Text style={styles.availability}>
        Available slots: {availableSlots}/{facility.slots.length}
      </Text>
    </TouchableOpacity>
  );
}

function BookingModal({ visible, facility, onClose, onBook }) {
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleBooking = () => {
    if (selectedSlot) {
      onBook(facility.id, selectedSlot);
      
      // Cross-platform alert handling
      if (Platform.OS === 'web') {
        window.alert(`You have successfully booked the ${facility.name} at ${selectedSlot}`);
      } else {
        Alert.alert('Booking Confirmed', `You have successfully booked the ${facility.name} at ${selectedSlot}`);
      }

      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Book {facility?.name}</Text>

          <FlatList
            data={facility?.slots}
            numColumns={2}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.slotButton,
                  item.booked && styles.bookedSlot,
                  selectedSlot === item.time && styles.selectedSlot
                ]}
                onPress={() => !item.booked && setSelectedSlot(item.time)}
                disabled={item.booked}
              >
                <Text style={styles.slotText}>{item.time}</Text>
                {item.booked && <Text style={styles.bookedText}>Booked</Text>}
              </TouchableOpacity>
            )}
          />

          <View style={styles.modalButtons}>
            <Button title="Cancel" onPress={onClose} color="#666" />
            <Button
              title="Confirm Booking"
              onPress={handleBooking}
              disabled={!selectedSlot}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function FacilityScreen() {
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [facilityData, setFacilityData] = useState(facilities);
  const [searchText, setSearchText] = useState('');

  const handleBookSlot = (facilityId, slotTime) => {
    setFacilityData(prev => prev.map(facility => {
      if (facility.id === facilityId) {
        return {
          ...facility,
          slots: facility.slots.map(slot =>
            slot.time === slotTime ? { ...slot, booked: true } : slot
          )
        };
      }
      return facility;
    }));

    const facility = facilityData.find(f => f.id === facilityId);
    setBookings(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        facility: facility.name,
        time: slotTime,
        date: new Date().toLocaleDateString()
      }
    ]);
  };

  const filteredFacilities = facilityData.filter(facility => {
    return (
      facility.name.toLowerCase().includes(searchText.toLowerCase()) ||
      facility.type.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search Facilities"
        value={searchText}
        onChangeText={setSearchText}
      />

      <FlatList
        data={filteredFacilities}
        renderItem={({ item }) => (
          <FacilityItem
            facility={item}
            onPress={(facility) => {
              setSelectedFacility(facility);
              setModalVisible(true);
            }}
          />
        )}
        keyExtractor={item => item.id}
      />

      <BookingModal
        visible={modalVisible}
        facility={selectedFacility}
        onClose={() => setModalVisible(false)}
        onBook={handleBookSlot}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdf6e3',
    padding: 20,
  },
  searchBar: {
    height: 45,
    borderColor: '#bbb',
    borderWidth: 1,
    borderRadius: 25,
    paddingLeft: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
    color: '#333',
    fontSize: 16,
  },
  facilityItem: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 5,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  facilityName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  facilityDetails: {
    fontSize: 14,
    color: '#777',
  },
  availability: {
    fontSize: 16,
    color: '#4caf50',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  slotButton: {
    backgroundColor: '#7bbf7b',
    borderRadius: 10,
    padding: 12,
    margin: 10,
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookedSlot: {
    backgroundColor: '#f44336',
  },
  selectedSlot: {
    backgroundColor: '#2196f3',
  },
  slotText: {
    color: '#fff',
    fontSize: 14,
  },
  bookedText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 20,
    width: '100%',
    justifyContent: 'space-between',
  },
});
