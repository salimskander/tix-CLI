import React, { useState, useEffect } from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../assets/colors';

const ToastBar = ({ message, duration = 3000 }) => {
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(animation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }, duration);
    });
  }, []);

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 15,
    left: 100,
    right: 100,
    backgroundColor: COLORS.grey,
    borderRadius: 120,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    color: COLORS.white,
    fontSize: 16,
  },
});

export default ToastBar;
