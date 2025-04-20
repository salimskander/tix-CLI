import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../assets/colors';

const CollectionsScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Des événements sélectionnés pour vous par nos experts, en un seul endroit.</Text>
            {/* Contenu spécifique à l'onglet Collections */}
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
        fontSize: 16,
        color: COLORS.grey, // Texte orange
        paddingHorizontal: 20,
    },
});

export default CollectionsScreen;
