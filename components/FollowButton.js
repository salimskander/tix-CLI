import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../assets/colors';

const FollowButton = ({ isFollowing, onPress }) => {
    return (
        <TouchableOpacity
            style={[styles.button, isFollowing ? styles.followingButton : styles.notFollowingButton]}
            onPress={onPress}
        >
            <Text style={styles.buttonText}>{isFollowing ? "Abonné(e)" : "S'abonner"}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        minWidth: 110,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '400',

    },
    followingButton: {
        backgroundColor: COLORS.grey,
    },
    notFollowingButton: {
        backgroundColor: COLORS.blue
    },
});

export default FollowButton;
