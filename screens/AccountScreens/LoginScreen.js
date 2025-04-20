import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import Button from '../../components/Button';
import { COLORS } from '../../assets/colors';
import { getAuth, signInWithEmailAndPassword, } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const isFocused = useIsFocused();

    useEffect(() => {
        const getData = async () => {
            try {
              const value = await AsyncStorage.getItem('userData');
              if(value !== null) {
                navigation.replace("Account");
              }
            } catch(e) {
              // error reading value
            }
        }
        getData();
    }, [isFocused])
    
    const handlePress = () => {
        setLoading(true);
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            // Store user data in AsyncStorage
            AsyncStorage.setItem('userData', JSON.stringify(user.uid))
            .then(() => {
                navigation.replace('Account');
            })
            .catch((error) => {
                console.error('Error storing user data:', error);
            });
        })
        .catch((error) => {
            setLoading(false);
            const errorCode = error.code;
            if(errorCode === 'auth/internal-error'){
                setError('Erreur interne, veuillez réessayer');
                console.error(error);
            } else if(errorCode === 'auth/invalid-argument' || errorCode === 'auth/invalid-email' || errorCode === 'auth/user-not-found' || errorCode === 'auth/invalid-credential' || errorCode === 'auth/invalid-password') {
                setError('Email ou mot de passe invalide');
            } else if(errorCode === 'auth/too-many-requests	') {
                setError('Trop de tentatives, veuillez réessayer plus tard');
            } else {
                setError("Erreur inconnue");
                console.error(error);
            }
        });
    }

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoComplete='email'
                    autoCapitalize='none'
                    keyboardType='email-address'
                    keyboardAppearance='dark'
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    autoComplete='password'
                    autoCapitalize='none'
                    keyboardAppearance='dark'
                />
                <View style={{marginBottom: 10}}>
                    <Button title="SE CONNECTER" onPress={handlePress}/>
                </View>
                {loading && <ActivityIndicator size="large" />}
                <TouchableOpacity>
                    <Text style={{color: 'white', marginBottom: 10}}>Mot de passe oublié ?</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                    <Text style={{color: 'white'}}>Pas encore de compte ? S'inscrire</Text>
                </TouchableOpacity>
                <Text style={{color: 'red', marginTop: 10}}>{error}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
        flex: 1,
        alignItems: 'center',
        backgroundColor: COLORS.lightblack,
        paddingTop: 50,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
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
    button: {
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 4,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
    },
    googleButton: {
        backgroundColor: '#e9e9e9',
        padding: 12,
        borderRadius: 50,
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '80%',
    },
    form: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    }
});

export default LoginScreen;
