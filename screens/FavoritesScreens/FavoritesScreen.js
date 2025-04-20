import React, { useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { COLORS } from '../../assets/colors';
import EventsScreen from './EventsScreen';
import OrganizersScreen from './OrganizersScreen';
import CollectionsScreen from './CollectionsScreen';
import { View, Text, StyleSheet } from 'react-native';

const Tab = createMaterialTopTabNavigator();

const FavoritesScreen = () => {

    return (
            <Tab.Navigator
                screenOptions={{
                    tabBarLabelStyle: { 
                        fontWeight: 'bold',
                        width: 150,
                    }
                }}
                tabBarOptions={{
                    style: { backgroundColor: COLORS.darkblack }, // Fond noir
                    labelStyle: { color: COLORS.orange }, // Texte orange
                    indicatorStyle: { backgroundColor: COLORS.orange }, // Barre orange
                    activeTintColor: COLORS.orange, // Texte orange
                    inactiveTintColor: COLORS.grey, // Texte gris
                }}
            >
                <Tab.Screen name="Événements" component={EventsScreen} />
                <Tab.Screen name="Organisateurs" component={OrganizersScreen} />
                <Tab.Screen name="Collections" component={CollectionsScreen} />
            </Tab.Navigator>
    );
};

const CustomHeader = ({ title }) => {
    return (
        <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: COLORS.darkblack, // Fond noir
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.orange, // Texte orange
    },
});

export default () => {
    return (
        <View style={{ flex: 1 }}>
            <CustomHeader title="Favoris" />
            <FavoritesScreen />
        </View>
    );
};
