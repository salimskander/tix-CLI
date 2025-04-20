import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput, TouchableWithoutFeedback, Keyboard, } from 'react-native';
import { COLORS } from '../../assets/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '@env';
import { FlatList } from 'react-native-gesture-handler';
import EventCard from '../../components/EventCard';
import { useIsFocused } from '@react-navigation/native';

const ResearchScreen = ({ route, navigation }) => {
    const [searchText, setSearchText] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [priceAscChecked, setPriceAscChecked] = useState(false);
    const [priceDescChecked, setPriceDescChecked] = useState(false);
    const [dateChecked, setDateChecked] = useState(false);
    const [userData, setUserData] = useState({});
    const [events, setEvents] = useState([]);
    const isFocused = useIsFocused();



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
    };

    useEffect(() => {
        getData();
        if (route.params?.searchText) {
            setSearchText(route.params.searchText);
            handleResearch();
        }
        handleResearch();
        getData();
    }, [isFocused]);

    const handleSearch = (text) => {
        setSearchText(text);
        // Ajoutez ici la logique pour filtrer en fonction du texte de recherche
    };

    const handleResearch = () => {
        console.log('Search text:', searchText);
        url = API_URL + '/events/search/' + searchText;
        if (priceAscChecked) {
            url += '/priceAsc';
        } else if (priceDescChecked) {
            url += '/priceDesc';
        } else if (dateChecked) {
            url += '/dateAsc';
        } else {
            url += '/all';
        }
        console.log('URL:', url);
        axios.get(url)
        .then((response) => {
            console.log('Search results:', response.data);
            setEvents(response.data);
        })
        .catch((error) => {
            setEvents([]);
            console.error('Error searching events:', error);
        });
    };

    const handleCheckboxPress = () => {
        setIsChecked(!isChecked);
        // Désactiver les autres boutons
        setPriceAscChecked(false);
        setPriceDescChecked(false);
        setDateChecked(false);
    };

    const handlePriceAscPress = () => {
        setPriceAscChecked(!priceAscChecked);
        // Désactiver les autres boutons
        setIsChecked(false);
        setPriceDescChecked(false);
        setDateChecked(false);
    };

    const handlePriceDescPress = () => {
        setPriceDescChecked(!priceDescChecked);
        // Désactiver les autres boutons
        setIsChecked(false);
        setPriceAscChecked(false);
        setDateChecked(false);
    };

    const handleDatePress = () => {
        setDateChecked(!dateChecked);
        // Désactiver les autres boutons
        setIsChecked(false);
        setPriceAscChecked(false);
        setPriceDescChecked(false);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Rechercher..."
                            placeholderTextColor={COLORS.grey}
                            value={searchText}
                            keyboardType="default"
                            inputMode="search"
                            enterKeyHint="enter"
                            onChangeText={handleSearch}
                            onSubmitEditing={handleResearch}
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.filterButton, priceAscChecked ? styles.activeFilter : styles.inactiveFilter]}
                            onPress={handlePriceAscPress}
                        >
                            <Text style={styles.filterButtonText}>Prix croissant</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.filterButton, priceDescChecked ? styles.activeFilter : styles.inactiveFilter]}
                            onPress={handlePriceDescPress}
                        >
                            <Text style={styles.filterButtonText}>Prix décroissant</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.filterButton, dateChecked ? styles.activeFilter : styles.inactiveFilter]}
                            onPress={handleDatePress}
                        >
                            <Text style={styles.filterButtonText}>Bientôt</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <FlatList
                    data={events}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => navigation.navigate('HomeNav', { screen: 'EventDetails', params: { id: item.id } })}>
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
        </TouchableWithoutFeedback>
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
        paddingVertical: 50,
        paddingHorizontal: 20,
        flexDirection: 'column',
        alignItems: 'center',
    },
    searchContainer: {
        backgroundColor: COLORS.lightblack,
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: COLORS.grey,
    },
    searchInput: {
        color: 'white',
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: -20,
    },
    filterButton: {
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
    },
    filterButtonText: {
        color: COLORS.darkblack,
        fontSize: 14,
        fontWeight: '500',
    },
    activeFilter: {
        backgroundColor: COLORS.orange,
    },
    inactiveFilter: {
        backgroundColor: COLORS.grey,
        opacity: 0.5,
    },
});

export default ResearchScreen;
