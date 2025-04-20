import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { COLORS } from '../../assets/colors';
import Button from '../../components/Button';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { API_URL } from '@env';

const EditProfileScreen = ({route, navigation}) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [bio, setBio] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const { uid } = route.params;
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        })();
    }, []);

    const pickImage = async () => {
        setLoading(true);

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            const formData = new FormData();
            // Get the file name without extension
    
            const fileName = uid
            console.log('File name:', fileName);
            formData.append('image', {
                uri: result.assets[0].uri,
                type: 'image/jpeg', // or whatever your image type is
                name: fileName, // Ensure file name has extension
            });
    
            axios.post(API_URL + '/images/users', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    // Add any additional headers here
                },
            })
            .then((response) => {
                console.log('Image uploaded:', response.data);
                navigation.navigate('Account');
                
            })
            .catch((error) => {
                console.error('Error uploading image:', error);
                setLoading(false);
            });
        }
    };

    return (
        <View style={styles.container}>
            { loading ? ( <ActivityIndicator size="large" color={COLORS.orange} /> ) : (
            <View style={styles.form}>
                {selectedImage && <Image source={{ uri: selectedImage }} style={{ width: 200, height: 200 }} />}
                <Button
                    title="Selectionnez une image"
                    onPress={pickImage}
                    style={styles.button}
                />
            </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.lightblack,
    },
    input: {
        width: '80%',
        height: 48,
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 50,
        marginBottom: 16,
        backgroundColor: 'white',
    },
    form: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginTop: 20
    },
});

export default EditProfileScreen;
