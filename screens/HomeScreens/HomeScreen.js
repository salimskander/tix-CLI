import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl, TextInput } from 'react-native'; // Importez ScrollView
import EventCard from '../../components/EventCard';
import SearchBar from '../../components/SearchBar';
import OrganizerCard from '../../components/OrganizerCard'; // Importez le composant OrganizerCard
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { COLORS } from '../../assets/colors';

const HomeScreen = ({navigation}) => { 
    const isFocused = useIsFocused();
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);
    const [organizers, setOrganizers] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [userData, setUserData] = useState({});
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        getEvents();
        getData();
    }, [])

    const handleSearch = (text) => {
        setSearchText(text);
    }

    const handleResearch = () => {
        navigation.navigate('ResearchNav', { screen: 'Research', params: { searchText: searchText } });
    }

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
                    setLoading(false);
                })
            })
        } catch (error) {
            console.error('Error getting user data:', error);
        }
    }

    const getEvents = () => {
        setLoading(true);
        const url = API_URL + '/events/';
        axios.get(url)
        .then((response) => {
            setEvents(response.data);
            setLoading(false);
        })
        .catch((error) => {
            console.error('Error getting events data:', error);
        });
        axios.get(API_URL + "/organizers/")
        .then((response) => {
            setOrganizers(response.data);
            console.log(response.data)
        })
        .catch((error) => {
            console.error('Error getting organizers data:', error);
        });
    }

    const handleFollowToggle = (id) => {
        setOrganizers(prevOrganizers => (
            prevOrganizers.map(organizer => {
                if (organizer.id === id) {
                    return { ...organizer, isFollowing: !organizer.isFollowing };
                }
                return organizer;
            })
        ));
    };

    const onRefresh = () => {
        setRefreshing(true);
        getEvents();
        setTimeout(() => {
            setRefreshing(false);
        }, 300);
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.PrincipalTitle}>Tix</Text>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={{flex: 1, color: COLORS.white}}
                        placeholder="Recherchez..."
                        placeholderTextColor={COLORS.grey}
                        value={searchText}
                        onChangeText={handleSearch}
                        keyboardType="default"
                        inputMode="search"
                        enterKeyHint="enter"
                        onSubmitEditing={handleResearch}
                    />
                </View>
            </View>
            {/* Section: Organisateurs à suivre */}
            <ScrollView style={styles.container} refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={COLORS.orange}
                />}
            >
            <View style={styles.section}>
                <Text style={styles.title}>Organisateurs à suivre</Text>
                {!loading ? (
                <FlatList
                    data={organizers}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <OrganizerCard
                            name={item.name}
                            image={item.pp}
                            isFollowing={item.isFollowing}
                            id={item.id}
                        />
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ width: '100%' }}
                />
                ) : (
                    <ActivityIndicator size="large" color={COLORS.orange} />
                )}
            </View>
            
            {/* Section: Événements populaires autour de vous */}
            {loading ? (
                    <ActivityIndicator size="large" color={COLORS.orange} />
                ) : (
                <View style={styles.section}>
                    <Text style={styles.title}>Événements populaires autour de vous</Text>
                    <FlatList
                        data={events}
                        keyExtractor={(item) => item.id.toString()}
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
    header: {
        backgroundColor: COLORS.darkblack,
        paddingVertical: 20,
    },
    section: {
        marginTop: 20,
    },
    
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        marginHorizontal: 16,
        color: COLORS.white,

    },
    PrincipalTitle: {
        position: 'absolute',
        fontSize: 38,
        fontWeight: '700', // 'bold
        color: COLORS.orange,
        marginLeft: 35,
        marginTop: 55,
        
    },
    searchContainer: {
        backgroundColor: '#363636', // gris foncé
        borderRadius: 20, // arrondi
        marginTop: 40, // Déplacer un peu plus bas
        marginLeft: 120, // Déplacer un peu plus à gauche
        paddingVertical: 10, // Réduire la hauteur verticale
        paddingHorizontal: 10,
        flexDirection: 'row', // aligner les éléments horizontalement
        justifyContent: 'flex-end', // aligner à droite
        width: '70%', // prendre 70% de la largeur
        borderWidth: 1, // Ajouter une bordure
        borderColor: COLORS.grey, // Couleur de la bordure gris clair
    },
});

export default HomeScreen;
