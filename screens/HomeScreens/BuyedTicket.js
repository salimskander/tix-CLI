import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../assets/colors';
import { AntDesign } from '@expo/vector-icons';
import Button from '../../components/Button';

const BuyedTicket = ({ route, navigation}) => {
    ticketData = route.params.ticket;

    console.log(ticketData);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Billet acheté !</Text>
            <AntDesign name="check" size={100} color={COLORS.orange} />
            <Text style={{fontSize: 30, color: COLORS.white, marginTop: 50, marginBottom: 50}}>{ticketData.name}</Text>
            <Button title="Retour à l'accueil" onPress={() => navigation.navigate('Home')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.lightblack,
        width: '100%',
        shadowColor: COLORS.darkblack,
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        color: COLORS.orange,
    },
});

export default BuyedTicket;