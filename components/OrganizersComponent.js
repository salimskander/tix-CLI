import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../assets/colors';
import FollowButton from './FollowButton'; // Importez le composant FollowButton
import { Image } from 'expo-image';
import { API_URL } from '@env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrganizersComponent = ({ organizer }) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [userData, setUserData] = useState({});

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('userData');
            const url = API_URL + '/userData/' + value.replace(/"/g, '')
            axios.get(url)
            .then((response) => {
                setUserData(response.data);
                console.log(API_URL + '/follows/following/' + response.data.uid);
                axios.get(API_URL + '/follows/following/' + response.data.uid)
                .then((response) => {
                    console.log('Follows:', response.data);
                    for (let i = 0; i < response.data.length; i++) {
                        if (response.data[i].id === organizer.id) {
                            console.log('Following:', response.data[i].id);
                            setIsFollowing(true);
                        }
                    }
                })
                .catch((error) => {
                    console.error('Error getting follow:', error);
                });
            })
            .catch((error) => {
                console.error('Error getting user data:', error);
            });
        }
        catch(e) {
            console.error('Error getting userData:', e);
        }
    }

    const onFollowToggle = () => {
        axios.post(API_URL + '/follows/' + userData.uid + "/" + organizer.id)
        .then((response) => {
            if (response.data.message === "Follow effectué") {
                console.log('Follow added:', response.data);
                setIsFollowing(true);
            } else {
                console.log('Follow deleted:', response.data);
                setIsFollowing(false);
            }
        })
        .catch((error) => {
            console.error('Error adding follow:', error);
        });
    }

    return (
        <View style={styles.container}>
            <Image source={API_URL + "/images/organizers/" + organizer.pp } style={styles.profileImage} />
            <View style={styles.infoContainer}>
                <Text style={styles.name}>{organizer.name}</Text>
                <FollowButton isFollowing={isFollowing} onPress={onFollowToggle} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: COLORS.lightblack,
        padding: 10,
        marginVertical: 5,
        shadowColor: COLORS.darkblack,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 40,
        marginRight: 10,
    },
    infoContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.white,
    },
});

export default OrganizersComponent;
