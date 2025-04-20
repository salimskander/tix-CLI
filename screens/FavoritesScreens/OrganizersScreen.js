import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { COLORS } from '../../assets/colors';
import OrganizersComponent from '../../components/OrganizersComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '@env';
import { useIsFocused } from '@react-navigation/native';


const OrganizersScreen = () => {
    // Définir l'état des organisateurs
    const [organizers, setOrganizers] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState();

    const isFocused = useIsFocused();


    const getFollow = async () => {
        try {
            const userData = await AsyncStorage.getItem('userData');
            setUserData(userData.replace(/"/g, ''));
            const url = API_URL + "/follows/following/" + userData.replace(/"/g, '')
            axios.get(url)
                .then((response) => {
                    console.log('Following:', response.data);
                    setOrganizers(response.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error getting following:', error);
                    setOrganizers([]);
                });
        } catch (error) {
            console.error('Error getting async storage:', error);
        }
    }

    useEffect(() => {
        setLoading(true);
        getFollow();
        setLoading(false);
    }, [isFocused]);

    const onRefresh = () => {
        setRefreshing(true);
        setLoading(true);
        getFollow();
        setTimeout(() => {
            setRefreshing(false);
            setLoading(false);
        }, 300);
    }

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color={COLORS.orange} />
            ) : (
                <FlatList
                    data={organizers}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={COLORS.orange}
                        />}
                    renderItem={({ item }) => (
                        <OrganizersComponent
                            organizer={item}
                        />
                    )}
                    keyExtractor={item => item.id.toString()}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightblack, 
    },
});

export default OrganizersScreen;