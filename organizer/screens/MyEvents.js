import React, { useEffect, useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { COLORS } from '../../assets/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '@env';
import EventCard from '../../components/EventCard';

const Tab = createMaterialTopTabNavigator();

const MyEventsScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <CustomHeader title="MyEvents" />
      <Tab.Navigator
        tabBarOptions={{
          labelStyle: { fontSize: 14, fontWeight: 'bold'},
          style: { backgroundColor: COLORS.darkblack, height: 50},
          indicatorStyle: { backgroundColor: COLORS.orange },
          activeTintColor: COLORS.orange,
          inactiveTintColor: COLORS.grey,
        }}>
          
        <Tab.Screen
          name="All"
          component={AllEventsScreen}
          options={{ tabBarLabel: 'Tous' }}
        />
        <Tab.Screen
          name="Past"
          component={PastEventsScreen}
          options={{ tabBarLabel: 'Passés' }}
        />
        <Tab.Screen
          name="Upcoming"
          component={UpcomingEventsScreen}
          options={{ tabBarLabel: 'À venir' }}
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

const UpcomingEventsScreen = () => {
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
        const url = API_URL + '/organizers/' + value.replace(/"/g, '')
        axios.get(url)
        .then((response) => {
          setUserData(response.data);
          const eventsUrl = API_URL + '/events/organizer/' + response.data.id + "/upcoming/";
          axios.get(eventsUrl)
          .then((eventsResponse) => {
            console.log('Events:', eventsResponse.data);
            setEvents(eventsResponse.data);
          })
          .catch((error) => {
            console.error('Error getting user events:', error);
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
    </View>
  );
};

const PastEventsScreen = () => {
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
        const url = API_URL + '/organizers/' + value.replace(/"/g, '')
        axios.get(url)
        .then((response) => {
          setUserData(response.data);
          const eventsUrl = API_URL + '/events/organizer/' + response.data.id + "/past/";
          axios.get(eventsUrl)
          .then((eventsResponse) => {
            console.log('Events:', eventsResponse.data);
            setEvents(eventsResponse.data);
          })
          .catch((error) => {
            console.error('Error getting user events:', error);
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
    </View>
  );
};

const AllEventsScreen = ({navigation}) => {
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
        const url = API_URL + '/organizers/' + value.replace(/"/g, '')
        axios.get(url)
        .then((response) => {
          setUserData(response.data);
          const eventsUrl = API_URL + '/events/organizer/' + response.data.id + "/all/";
          axios.get(eventsUrl)
          .then((eventsResponse) => {
            console.log('Events:', eventsResponse.data);
            setEvents(eventsResponse.data);
          })
          .catch((error) => {
            console.error('Error getting user events:', error);
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

export default MyEventsScreen;
