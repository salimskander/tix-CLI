// SearchBar.js
import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { COLORS } from '../assets/colors';
import { useNavigation } from '@react-navigation/native';

const SearchBar = ({navigation}) => {
    const [searchText, setSearchText] = useState('');

    const handleSearch = (text) => {
        // Mettre en œuvre la logique de recherche ici
        setSearchText(text);
    };

    const handleResearch = () => {
        navigation.navigate('ResearchNav', { screen: 'ResearchScreen', params: { searchText: searchText } });
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
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
    );
};

const styles = StyleSheet.create({
    container: {
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
    input: {
        color: 'white', // blanc
        flex: 1, // prend toute la largeur disponible
    },
});

export default SearchBar;
