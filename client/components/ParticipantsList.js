import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import ParticipantItem from './ParticipantsItem';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import * as actions from '../store/actions';

const ParticipantsScreen = () => {
  const route = useRoute();
  const { trip } = route.params;
  const participants = useSelector(state => state.trips.find(t => t.id === trip.id).participants);
  const tripAdmin = trip.participants.find(participant => participant.is_admin);
  const currentUser = useSelector(state => ({
    id: state.userid,
    admin: state.userid === tripAdmin.id
  }));
  const dispatch = useDispatch();

  const [ newParticipant, setNewParticipant ] = useState('');

  const addParticipant = () => {
    // TODO check if input is valid email address format
    dispatch(actions.includeUserInTripAsync(trip.id, newParticipant));
    setNewParticipant('');
  };

  const removeParticipant = (participantEmail) => {
    dispatch(actions.removeUserFromTripAsync(trip.id, participantEmail));
  };

  return (
    <>
      {currentUser.admin ? (
        <View style={styles.container}>
          <TextInput
            style={styles.inputStyle}
            placeholder="Add Participant"
            autoCapitalize="none"
            autoCorrect={false}
            value={newParticipant}
            onChangeText={ text => setNewParticipant(text) }
          />
          <TouchableOpacity style={styles.button}>
            <Ionicons
              style={{ justifyContent: 'center' }}
              name="md-add"
              size={32}
              color="black"
              onPress={addParticipant}
            />
          </TouchableOpacity>
        </View>
      ) : null}
      <FlatList
        data={participants}
        renderItem={({ item }) => {
          return (
            <ParticipantItem
              isCurrentUser={item.id === currentUser.id}
              name={item.name || item.email}
              coming={!!item.departure_time}
              hasAnswered={!!item.departure_time}
              removeParticipant={() => removeParticipant(item.email)}
            />
          );
        }}
        keyExtractor={(item) => item.id}
        style={styles.flatList}
      />
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    width: 100,
    paddingVertical: 25,
    paddingHorizontal: 25,
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
  },
  container: {
    flexDirection: 'row',
  },
  inputStyle: {
    flex: 1,
    fontSize: 18,
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
    paddingVertical: 25,
    paddingHorizontal: 25,
  },
});

export default ParticipantsScreen;