// AccountScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { API_URL } from '@env';
import axios from 'axios';
import { Dropdown } from 'react-native-element-dropdown';
import { COLORS } from '../../assets/colors';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';

const data = [
    { label: 'Paris', value: 'Paris' },
    { label: 'Marseille', value: 'Marseille' },
    { label: 'Lyon', value: 'Lyon' },
    { label: 'Toulouse', value: 'Toulouse' },
    { label: 'Nice', value: 'Nice' },
    { label: 'Nantes', value: 'Nantes' },
    { label: 'Montpellier', value: 'Montpellier' },
    { label: 'Strasbourg', value: 'Strasbourg' },
    { label: 'Bordeaux', value: 'Bordeaux' },
    { label: 'Lille', value: 'Lille' },
];

const AccountScreen = ({ navigation }) => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [userData, setUserData] = useState({});
    const [value, setValue] = useState(data[0].value);
    const [image, setImage] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [followers, setFollowers] = useState(0);

    const isFocused = useIsFocused();

    const getData = async () => {
        setLoading(true);
        try {
            const value = await AsyncStorage.getItem('userData');
            if (value === null) {
                navigation.replace('Login');
            } else {
                const url = API_URL + '/organizers/' + value.replace(/"/g, '');
                axios.get(url)
                    .then((response) => {
                        setUserData(response.data);
                        setValue(response.data.city);
                        setImage(API_URL + "/images/organizers/"+  response.data.pp)
                        axios.get(API_URL + '/stats/followers/' + response.data.id)
                        .then((response) => {
                            setFollowers(response.data.followers)
                            setLoading(false);
                            console.log(response.data);
                        })
                        .catch((error) => {
                            console.error('Error getting followers:', error);
                        });
                    })
                    .catch((error) => {
                        console.error('Error getting user data:', error);
                    });
            }
        } catch (e) {
            // error reading value
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const handleFollowersClick = () => {
        navigation.navigate('Followers', {userId: userData.id});
    }

    const changeValue = item => {
        setValue(item);
        axios.put(API_URL + '/organizers/' + userData.uid, {
            city: item,
        })
        .catch((error) => {
            console.error('Error updating user data:', error);
        });
    };

    const onRefresh = () => {
        setRefreshing(true);
        getData();
        setTimeout(() => {
            setRefreshing(false);
        }, 300);
    }

    const pickImage = async () => {
        setLoading(true);
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (result.assets !== null) {
            const formData = new FormData();
            // Get the file name without extension
    
            const fileName = userData.uid
            formData.append('image', {
                uri: result.assets[0].uri,
                type: 'image/jpeg', // or whatever your image type is
                name: fileName, // Ensure file name has extension
            });
    
            axios.post(API_URL + '/images/organizers', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    // Add any additional headers here
                },
            })
            .then((response) => {
                console.log('Image uploaded:', response.data);
                setImage(API_URL + "/images/organizers/"+  userData.pp)
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error uploading image:', error);
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={{ width: "100%"}} refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={COLORS.blue}
                />
            }>
            <View style={styles.info}>
                {loading ? (
                <ActivityIndicator size="large" color={COLORS.orange} />
                ) : (
                <Image
                    style={{ width: 100, height: 100, borderRadius: 75}}
                    source={{ uri: image}}
                    cachePolicy={"none"}
                /> 
                )}
                <View style={styles.name}>
                    <TouchableOpacity style={styles.nameContainer} onPress={() => pickImage()}>
                        <Text style={styles.title}>{userData.name}</Text>
                        <Feather name="edit-2" size={22} color={COLORS.blue} />
                    </TouchableOpacity>
                </View>
                <View style={styles.stats}>
                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', borderRightWidth: 1 }}>
                        <TouchableOpacity onPress={handleFollowersClick} >
                            <Text style={styles.number}>{followers}</Text>
                            <Text style={styles.statName}>Followers</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.settings}>
                    <View style={{ height: 1, width: '100%', position: 'absolute', backgroundColor: COLORS.grey, marginTop: 15 }} />
                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white, marginTop: 30, marginBottom: 15, borderTopWidth: 1, borderTopColor: COLORS.grey, marginLeft: 10 }}>Paramètres</Text>
                    <View style={styles.param}>
                        <Text style={styles.paramText}>Ville principale</Text>
                        <Text style={{ color: COLORS.blue, marginRight: 50 }}>{value}</Text>
                        <Dropdown
                            style={styles.dropdown}
                            data={data}
                            maxHeight={300}
                            onChange={item => {
                                changeValue(item.value);
                            }}
                            renderItem={item => (
                                <View style={styles.item}>
                                    <Text style={styles.textItem}>{item ? item.label : ''}</Text>
                                    {item && item.value === value && (
                                        <Feather name="check" size={20} color={COLORS.blue} />
                                    )}
                                </View>
                            )}
                        />
                    </View>
                    <View style={styles.param}>
                        <Text style={styles.paramText}>Copier les évènements dans le calendrier</Text>
                        <Switch
                            value={isEnabled}
                            style={{
                                transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
                            }}
                            onValueChange={() => setIsEnabled(previousState => !previousState)}
                        />
                    </View>
                    <TouchableOpacity style={styles.param}>
                        <Text style={styles.paramText}>Gérer les évènements</Text>
                        <MaterialIcons name="keyboard-arrow-right" size={24} color="grey" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.param}>
                        <Text style={styles.paramText}>Gérer les options de connexion</Text>
                        <MaterialIcons name="keyboard-arrow-right" size={24} color="grey" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.param}>
                        <Text style={styles.paramText}>Paramètres du compte</Text>
                        <MaterialIcons name="keyboard-arrow-right" size={24} color="grey" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.param} onPress={() => navigation.replace('Home')}>
                        <Text style={styles.paramText}>Passer au mode utilisateur</Text>
                        <MaterialIcons name="keyboard-arrow-right" size={24} color="grey" />
                    </TouchableOpacity>
                </View>
            </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: COLORS.lightblack,
    },
    nameContainer: {
        flexDirection: 'row',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.white,
        marginRight: 10,
    },
    info: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 40,
    },
    name: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    allStat: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: COLORS.grey,
    },
    number: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.white,
        textAlign: 'center',
    },
    statName: {
        marginTop: 10,
        fontSize: 18,
        color: COLORS.blue,
    },
    settings: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        alignSelf: 'flex-start',
    },
    param: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBlockColor: COLORS.grey,
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 5,
    },
    paramText: {
        color: COLORS.white,
        flex: 1,
        paddingTop: 20,
        paddingBottom: 20,
    },
    dropdown: {
        width: 150,
        position: 'absolute',
        right: 0,
        margin: 16,
        height: 50,
        padding: 12,
        elevation: 2,
    },
    item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.lightblack,
    },
    textItem: {
        flex: 1,
        fontSize: 16,
        color: COLORS.white,
    },
});

export default AccountScreen;
