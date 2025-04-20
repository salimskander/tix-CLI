import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS } from '../assets/colors';

const HeartButton = ({ onPress, isLiked, size }) => {
    const [liked, setLiked] = useState(isLiked);

    const toggleLike = () => {
        setLiked(!liked);
        onPress(!liked);
    };

    return (
        <TouchableOpacity onPress={toggleLike}>
            <Icon name={liked ? 'heart' : 'heart-o'} size={size } color={liked ? COLORS.orange : COLORS.white} />
        </TouchableOpacity>
    );
};

export default HeartButton;
