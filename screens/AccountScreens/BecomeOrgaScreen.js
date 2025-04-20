import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { COLORS } from '../../assets/colors';
import Button from '../../components/Button';
import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BecomeOrgaScreen = ({navigation}) => {
    const [name, setName] = useState('');
    const [userData, setUserData] = useState({});

    const handleNameChange = (text) => {
        setName(text);
    };

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
            });
        } catch (error) {
            console.error('Error getting user data:', error);
        }
    }

    const handleSubmit = () => {
        axios.post(API_URL + '/organizers', {
            name: name,
            uid: userData.uid,
            city: "Paris"
        })
        .then((response) => {
            console.log('Organizer added:', response.data);
            navigation.navigate('OrganizerNav');
        })
        .catch((error) => {
            console.error('Error adding organizer:', error);
        });
    };

    return (
        <View style={styles.container}>
            <View style={{marginBottom: 20}}>
                <Text style={styles.title}>
                    Entrez votre nom d'organisateur
                </Text>
            </View>
            <TextInput
                placeholder="Entrer votre nom"
                style={styles.input}
                value={name}
                onChangeText={handleNameChange}
            />
            <Button title="Confirmer" onPress={handleSubmit} />
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
    input: {
        width: '80%',
        padding: 10,
        marginBottom: 10,
        backgroundColor: COLORS.white,
        borderRadius: 100,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.white,
    }
});

export default BecomeOrgaScreen;