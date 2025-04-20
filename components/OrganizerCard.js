import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../assets/colors';
import FollowButton from './FollowButton'; // Importez le composant FollowButton
import { Image } from 'expo-image';
import { API_URL } from '@env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrganizerCard = ({ name, image, id }) => {
    const [userData, setUserData] = useState();
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        setLoading(true);
        const getData = async () => {
            try {
                const value = await AsyncStorage.getItem('userData');
                setUserData(value)
                const url = API_URL + '/userData/' + value.replace(/"/g, '')
                axios.get(url)
                .then((response) => {
                    setUserData(response.data);
                    const followUrl = API_URL + '/follows/' + response.data.uid;
                    axios.get(followUrl)
                    .then((followResponse) => {
                        followResponse.data.forEach(element => {
                            if (element.idOrganizer === id) {
                                setIsFollowing(true);
                            }
                        });
                        setLoading(false);
                    })
                    .catch((error) => {
                        console.error('Error getting likes data:', error);
                    });
                })
                .catch((error) => {
                    console.error('Error getting user data:', error);
                });
            } catch (error) {
                console.error('Error getting async storage:', error);
            }
        }
        getData();
    }, []);
    
    const handleFollow = () => {
        axios.post(API_URL + '/follows/' + userData.uid + "/ " + id)
        .then((response) => {
            if (response.data.message === "Follow effectué") {
                setIsFollowing(true);
                console.log('Follow added:', response.data);
            } else {
                setIsFollowing(false);
                console.log('Follow removed:', response.data);
            }
        })
    }

    

    return (
        <View style={styles.card}>
            <Image source={API_URL + "/images/organizers/" + image} style={styles.profileImage} />
            <Text style={styles.name}>{name}</Text>
            <FollowButton isFollowing={isFollowing} onPress={handleFollow} />
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.darkblack,
        borderRadius: 10,
        padding: 20,
        marginRight: 5,
        marginLeft: 5,
        alignItems: 'center',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: COLORS.white,
    },
});

export default OrganizerCard;
