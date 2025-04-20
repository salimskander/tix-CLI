import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { COLORS } from '../assets/colors';


const Button = ({ title, onPress }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: COLORS.orange,
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: COLORS.darkblack,
        textAlign: 'center',
    },
});

export default Button;