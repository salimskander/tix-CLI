import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, signInWithCredential } from "firebase/auth";
import firebase from "firebase/app";
import { COLORS } from '../../assets/colors';
import Button from '../../components/Button';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AppleAuthentication from 'expo-apple-authentication';
import axios from 'axios';
import { API_URL } from '@env';

const RegisterScreen = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const surnameInputRef = useRef(null);
    const emailInputRef = useRef(null);
    const passwordInputRef = useRef(null);
    const nameInputRef = useRef(null);
    const usernameInputRef = useRef(null);

    const isFocused = useIsFocused();

    useEffect(() => {
        const getData = async () => {
            try {
              const value = await AsyncStorage.getItem('userData');
              if(value !== null) {
                navigation.navigate("Account");
              }
            } catch(e) {
              // error reading value
            }
        }
        getData();
    }, [isFocused])

    // const signUpWithApple = async () => {
    //     try {
    //       const { identityToken, nonce } = await AppleAuthentication.signInAsync({
    //         requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL],
    //       });
      
    //       const credential = firebase.auth.AppleAuthProvider.credential(identityToken, nonce);
    //       await firebase.auth().createUserWithCredential(credential);
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   };

    const handleNameSubmit = () => {
        surnameInputRef.current.focus();
    };

    const handleSurnameSubmit = () => {
        emailInputRef.current.focus();
    };

    const handleEmailSubmit = () => {
        passwordInputRef.current.focus();
    };


    const handleRegister = () => {
        setLoading(true);
        if (email === '' || password === '' || name === '' || surname === '' || username === '') {
            setError('Veuillez remplir tous les champs');
            setLoading(false);
            return;
        }
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            axios.post(API_URL + "/register", {
                firstName: name,
                lastName: surname,
                uid: user.uid,
                username: username,
            })
            .then((response) => {
                if (response.status !== 200) {
                    setError(response.data.error);
                    setLoading(false);
                    return;
                } else {
                    setError('');
                    AsyncStorage.setItem('userData', JSON.stringify(user.uid))
                    .then(() => {
                        navigation.navigate("Account");
                    })
                    .catch((error) => {
                        console.error('Error storing user data:', error);
                    });
                }
            })
            .catch((error) => {
                console.log(error);
                console.error('Error storing user data in database:', error.message);
                setError('Erreur interne, veuillez réessayer');
            })
          }).catch((error) => {
            setLoading(false);
            const errorCode = error.code;
            if (errorCode === 'auth/email-already-in-use') {
                setError('Email déjà utilisé');
            } else if (errorCode === 'auth/invalid-email') {
                setError('Email invalide');
            } else if (errorCode === 'auth/invalid-password') {
                setError('Mot de passe trop faible (6 caractères minimum)');
            } else if (errorCode === 'auth/internal-error'){
                setError('Erreur interne, veuillez réessayer');
                console.error(error);
            } else {
                setError("Erreur inconnue");
                console.error(error);
            }
          });
    };

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <TextInput
                    placeholder='Pseudo'
                    style={styles.input}
                    autoComplete="username"
                    autoCorrect={false}
                    autoCapitalize='none'
                    onSubmitEditing={handleNameSubmit}
                    enterKeyHint='next'
                    ref={usernameInputRef}
                    value={username}
                    onChangeText={(value) => setUsername(value)}
                />
                <TextInput 
                    ref={surnameInputRef}
                    placeholder="Prénom"
                    value={surname}
                    onChangeText={(value) => {
                        value.length - surname.length > 1
                        ? (nameInputRef.current?.focus(),
                          setSurname(value))
                        : setSurname(value)
                    }}
                    style={styles.input}
                    autoComplete="given-name"
                    autoCorrect={false}
                    autoCapitalize='words'
                    onSubmitEditing={handleNameSubmit}
                    enterKeyHint='next'
                />
                <TextInput
                    ref={nameInputRef}
                    placeholder="Nom"
                    value={name}
                    onChangeText={(value) => {
                        value.length - name.length > 1
                        ? (emailInputRef.current?.focus(),
                          setName(value))
                        : setName(value)
                    }}
                    style={styles.input}
                    autoComplete="family-name"
                    autoCorrect={false}
                    autoCapitalize='words'
                    onSubmitEditing={handleSurnameSubmit}
                    enterKeyHint='next'
                />
                <TextInput
                    ref={emailInputRef}
                    placeholder="Email"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    style={styles.input}
                    autoComplete="email"
                    autoCorrect={false}
                    autoCapitalize='none'
                    keyboardType='email-address'
                    onSubmitEditing={handleEmailSubmit}
                    enterKeyHint='next'
                />
                <TextInput
                    ref={passwordInputRef}
                    placeholder="Mot de passe"
                    secureTextEntry
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    style={styles.input}
                    autoComplete="new-password"
                    autoCorrect={false}
                    autoCapitalize='none'
                    onSubmitEditing={handleRegister}
                    enterKeyHint='done'
                />
                <Button title="Créer un compte" onPress={handleRegister} />
                {loading && <ActivityIndicator size="large" />}
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text style={{color: 'white', marginTop: 10}}>déjà un compte ? Connectez vous</Text>
                </TouchableOpacity>
                <Text style={{color: 'red', marginTop: 10}}>{error}</Text>
                {/* <View style={{ width: 200, height: 5, backgroundColor: 'lightgrey', borderRadius: 50, marginBottom: 40, marginTop: 25}}/>
                <AppleAuthentication.AppleAuthenticationButton
                    buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP}
                    buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                    cornerRadius={5}
                    style={styles.apple}
                    onPress={signUpWithApple}
                /> */}
            </View>
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: COLORS.lightblack,
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
        marginTop: 20
    },
    apple: {
        width: 200,
        height: 50,
        marginBottom: 20
    }
});

export default RegisterScreen;