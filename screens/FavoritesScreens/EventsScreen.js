import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Touchable, TouchableOpacity, RefreshControl } from 'react-native';
import { COLORS } from '../../assets/colors';
import EventCard from '../../components/EventCard';
import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';


const EventsScreen = ({navigation}) => {
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState();
    const [events, setEvents] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const isFocused = useIsFocused();

    const onRefresh = () => {
        setRefreshing(true);
        getData();
        setTimeout(() => {
            setRefreshing(false);
        }, 300);
    };


    useEffect(() => {
        setLoading(true);
        
        getData();
    }, [isFocused]); // Empty dependency array to trigger useEffect only once

    const getData = async () => {
        setEvents([]);
        try {
            const value = await AsyncStorage.getItem('userData');             
            const likesUrl = API_URL + '/likes/' + value.replace(/"/g, '');
            axios.get(likesUrl)
            .then((likesResponse) => {
                // Create an array to store promises
                const promises = [];
                likesResponse.data.forEach(element => {
                    // Push each axios request promise to the array
                    promises.push(
                        axios.get(API_URL + '/events/' + element.eventId)
                        .then((eventResponse) => {
                            console.log('Event data:', eventResponse.data);
                            return eventResponse.data; // Return the event data
                        })
                        .catch(error => {
                            console.error('Error fetching event:', error);
                            return null; // Return null if an error occurs
                        })
                    );
                });

                // Wait for all promises to resolve
                Promise.all(promises)
                .then(eventData => {
                    // Filter out null values (in case of errors)
                    const filteredEventData = eventData.filter(data => data !== null);
                    // Update state with filtered event data
                    setEvents(prevEvents => [...prevEvents, ...filteredEventData]);
                    setLoading(false);
                });
            })
            .catch((error) => {
                if (error.response.status === 404) {
                    setLoading(false);
                }
            });
        } catch (error) {
            console.error('Error getting user data:', error);
        }
    };

    

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color={COLORS.orange} />
            ) : (
                <>
                    <FlatList
                        data={events}
                        keyExtractor={(item) => item.id.toString()}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                tintColor={COLORS.orange}
                            />}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => navigation.navigate("EventDetails", {id: item.id})}>
                                <EventCard
                                    id={item.id}
                                    eventName={item.name}
                                    date={item.date}
                                    location={item.location}
                                    imageUrl={item.imageUrl}
                                    price={item.price}
                                    organizer={item.organizer}
                                />
                            </TouchableOpacity>
                        )}
                        showsVerticalScrollIndicator={false}
                        style={{ width: '100%' }}
                    />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.lightblack, // Fond noir
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default EventsScreen;
