import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Share, Alert, Dimensions, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';
import { AntDesign, Entypo, Feather, Fontisto } from '@expo/vector-icons';
import HeartButton from '../../components/HeartButton';
import { Buffer } from "buffer";
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import OrganizersComponent from '../../components/OrganizersComponent';


import { COLORS } from '../../assets/colors';

const EventDetails = ({route, navigation}) => {
    const { id } = route.params;
    const [event, setEvent] = useState(null);
    const [imageData, setImageData] = useState(null);
    const isFocused = useIsFocused();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState({});
    const [liked, setLiked] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [organizer, setOrganizer] = useState({});

    const likeUpdate = () => {
        axios.post(API_URL + '/likes/' + userData.uid, {
            eventId: id,
        })
        .then((response) => {
            if (response.data.message === "like enregistré") {
                setLiked(true)
            } else {
                setLiked(false);
            }
            console.log('Like added:', response.data);
        })
        .catch((error) => {
            console.error('Error adding like:', error);
        });
    };

    useEffect(() => {
        setLoading(true);
        getData();
    }, [isFocused]);

    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('userData');
            const url = API_URL + '/userData/' + value.replace(/"/g, '')
            axios.get(url)
            .then((response) => {
                setUserData(response.data);    
                const likesUrl = API_URL + '/likes/' + response.data.uid;
                axios.get(likesUrl)
                .then((likesResponse) => {
                    likesResponse.data.forEach(element => {
                        if (element.eventId === id) {
                            setLiked(true);
                        }
                    });
                })
                .catch((error) => {
                    if (error.response.status !== 404) {
                        console.error('Error getting likes data:', error);
                    }
                });

                const eventUrl = API_URL + '/events/' + id;
                axios.get(eventUrl)
                .then((eventResponse) => {
                    setEvent(eventResponse.data);
                    const organizer = {
                        name: eventResponse.data.organizerName,
                        pp: eventResponse.data.organizerPP,
                        id: eventResponse.data.idOrganizer,
                    }
                    setOrganizer(organizer);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error getting event data:', error);
                });
            })
            .catch((error) => {
                console.error('Error getting user data:', error);
            });
        } catch(e) {
            console.error('Error reading value:', e);
        }
    }
    
    
    const onShare = async () => {
        try {
            const result = await Share.share({
                url:
                    'https://docs.expo.io/',
                message:
                    'React Native | A framework for building native apps using React',
            });
        } catch (error) {
            Alert.alert(error.message);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        getData();
        setTimeout(() => {
            setRefreshing(false);
        }, 300);
    }
        

    return (
        <View style={styles.container}>
            <StatusBar
                animated={true}
                barStyle="light-content"
            />
            {loading ? (
                <ActivityIndicator size="large" color={COLORS.orange} />
            ) : (
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name="left" size={27} color={COLORS.orange}  style={{marginTop: 60, marginBottom: 15 }}/>
                </TouchableOpacity>
                <View style={{display: "flex", flexDirection: "row"}}>
                    <View style={styles.buttonContainer}>
                        <HeartButton isLiked={liked} size={27} onPress={() => likeUpdate()} />
                    </View>
                    <TouchableOpacity onPress={onShare}>
                        <Entypo name="share-alternative" size={27} color={COLORS.orange}  style={{marginTop: 57, marginBottom: 10, marginRight: 17 }}/>
                    </TouchableOpacity>
                    <Feather name="more-vertical" size={27} color={COLORS.orange}  style={{marginTop: 60, marginBottom: 10 }} />
                </View>
            </View>
            )}
            <ScrollView style={styles.info} refreshControl={
            <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={COLORS.orange}
            />}>
                {loading ? (
                    <ActivityIndicator size="large" color={COLORS.orange} />
                ) : (
                    <View>
                        <Image
                            style={styles.eventImage}
                            source={{ uri: API_URL + event.imageUrl }}
                        />
                        <View style={styles.tagContainer}>
                            <View style={styles.tag}>
                                <Text style={{fontSize: 16, color: COLORS.white, fontWeight: 'bold', padding: 2}}>Popular</Text>
                            </View>
                        </View>
                        <Text style={styles.title}>{event.name}</Text>
                        <OrganizersComponent organizer={organizer} />
                        <Text style={{color: COLORS.white, fontSize: 16, marginTop: 10}}>{event.description}</Text>
                        <View style={styles.dateContainer}>
                            <Fontisto name="date" size={30} color={COLORS.orange} />
                            <Text style={{color: COLORS.white, fontSize: 20, fontWeight: 'bold', marginLeft: 30, marginTop: 3}}>{event.date}</Text>     
                        </View>
                        <View style={styles.dateContainer}>
                            <Entypo name="location-pin" size={30} color={COLORS.orange} />
                            <Text style={{color: COLORS.white, fontSize: 20, fontWeight: 'bold', marginLeft: 30, marginTop: 3, marginBottom: 20}}>{event.location}</Text>
                        </View>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightblack,
        width: '100%',
        shadowColor: COLORS.darkblack,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    header: {
        backgroundColor: COLORS.darkblack,
        paddingHorizontal: 20,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buttonContainer: {
        alignItems: 'center',
        marginTop: 60,
        marginRight: 25,
    },
    eventImage: {
        width: Dimensions.get('window').width - 40,
        height: 300,
        borderRadius: 8,
        marginBottom: 8,
    }, 
    info: {
        padding: 20,
    },
    tag: {
        fontSize: 16,
        color: COLORS.white,
        fontWeight: 'bold',
        marginBottom: 10,
        backgroundColor: COLORS.orange,
        padding: 5,
        borderRadius: 4,
    },
    tagContainer: {
        marginTop: 10,
        display: 'flex',
        flexDirection: 'row',
    },
    dateContainer: {
        flexDirection: 'row',
        marginTop: 30,
        marginBottom: 10,
    },
    ticketContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginBottom: 30,
        marginTop: 15,
    },    
});

export default EventDetails;
