import React, { useEffect, useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { COLORS } from '../../assets/colors';
import axios from 'axios';
import { API_URL } from '@env';
import EventCard from '../../components/EventCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createMaterialTopTabNavigator();

const TicketsScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <CustomHeader title="MyTix" />
      <Tab.Navigator
        tabBarOptions={{
          labelStyle: { fontSize: 14, fontWeight: 'bold'},
          style: { backgroundColor: COLORS.darkblack, height: 50},
          indicatorStyle: { backgroundColor: COLORS.orange },
          activeTintColor: COLORS.orange,
          inactiveTintColor: COLORS.grey,
        }}>
          
        <Tab.Screen
          name="Upcoming"
          component={UpcomingTicketsScreen}
          options={{ tabBarLabel: 'À venir' }}
        />
        <Tab.Screen
          name="Past"
          component={PastTicketsScreen}
          options={{ tabBarLabel: 'Passés' }}
        />
      </Tab.Navigator>
    </View>
  );
};

const CustomHeader = ({ title }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const UpcomingTicketsScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [events, setEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    getData();
    setTimeout(() => {
        setRefreshing(false);
    }, 300);
  }

  const getData = async () => {
    try {
        const value = await AsyncStorage.getItem('userData');
        setUserData(value)
        const url = API_URL + '/userData/' + value.replace(/"/g, '')
        axios.get(url)
        .then((response) => {
          setUserData(response.data);
          const eventsUrl = API_URL + '/tickets/' + response.data.uid + "/upcoming/";
          console.log('Events URL:', eventsUrl);
          axios.get(eventsUrl)
          .then((eventsResponse) => {
            console.log('Events:', eventsResponse.data);
            setEvents(eventsResponse.data);
          })
          .catch((error) => {
            if (error.response.status === 404) {
              setEvents([]);
            } else {
              console.error('Error getting user events:', error);
            }
          });
        })
        .catch((error) => {
            console.error('Error getting user data:', error);
        });
    } catch (error) {
        console.error('Error getting async storage:', error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <View style={styles.container}>
      {(events.length === 0) && (
          <Text style={{fontSize: 20, fontWeight: 'bold', color: COLORS.orange,}}>Vous n'avez pas d'événements futur</Text>
        )}
      {(events.length > 0) && (
      <FlatList
          data={events}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={COLORS.orange}
            />
          }
          renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigation.navigate('EventDetails', { id: item.id })}>
                  <EventCard
                      id={item.id}
                      eventName={item.name}
                      date={item.date}
                      location={item.location}
                      imageUrl={item.imageUrl}
                      price={item.price}
                      organizer={item.organizerName}
                  />
              </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
          style={{ width: '100%' }}
      />
      )}
    </View>
  );
};

const PastTicketsScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [events, setEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    getData();
    setTimeout(() => {
        setRefreshing(false);
    }, 300);
  }

  const getData = async () => {
    try {
        const value = await AsyncStorage.getItem('userData');
        setUserData(value)
        const url = API_URL + '/userData/' + value.replace(/"/g, '')
        axios.get(url)
        .then((response) => {
          setUserData(response.data);
          const eventsUrl = API_URL + '/tickets/' + response.data.uid + "/past/";
          console.log('Events URL:', eventsUrl);
          axios.get(eventsUrl)
          .then((eventsResponse) => {
            console.log('Events:', eventsResponse.data);
            setEvents(eventsResponse.data);
          })
          .catch((error) => {
            if (error.response.status === 404) {
              setEvents([]);
            } else {
              console.error('Error getting user events:', error);
            }
          });
        })
        .catch((error) => {
            console.error('Error getting user data:', error);
        });
    } catch (error) {
        console.error('Error getting async storage:', error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <View style={styles.container}>
      {(events.length === 0) && (
          <Text style={{fontSize: 20, fontWeight: 'bold', color: COLORS.orange,}}>Vous n'avez pas d'événements passés</Text>
      )}
      {(events.length > 0) && (
      <FlatList
          data={events}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={COLORS.orange}
            />
          }
          renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigation.navigate('EventDetails', { id: item.id })}>
                  <EventCard
                      id={item.id}
                      eventName={item.name}
                      date={item.date}
                      location={item.location}
                      imageUrl={item.imageUrl}
                      price={item.price}
                      organizer={item.organizerName}
                  />
              </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
          style={{ width: '100%' }}
      />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightblack,
  },
  header: {
    backgroundColor: COLORS.darkblack,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.orange,
  },
});

export default TicketsScreen;
