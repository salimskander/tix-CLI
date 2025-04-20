import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, RefreshControl, SafeAreaView, ScrollView, ActivityIndicator} from 'react-native';
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

const AccountScreen = ({navigation, route}) => {
    const [isEnabled, setIsEnabled] = React.useState(false);
    const [userData, setUserData] = React.useState({});
    const [value, setValue] = React.useState(data[0].value);
    const [organizer, setOrganizer] = React.useState(false);
    const [ppUri, setPpUri] = React.useState(null);
    const [refreshing, setRefreshing] = React.useState(false);
    const [image, setImage] = React.useState(null);
    const [imageKey, setImageKey] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState(true);
    const [stats, setStats] = React.useState({});

    const isFocused = useIsFocused();

    const createdAccount = route.params;

    if (createdAccount) {
        setOrganizer(false);
    }

    const changeValue = item => {
        setValue(item);
        axios.put(API_URL + '/userData/' + userData.uid, {
            city: item,
        })
        .catch((error) => {
            console.error('Error updating user data:', error);
        });
    }

    const renderItem = item => {
        return (
        <View style={styles.item}>
            <Text style={styles.textItem}>{item ? item.label : ""}</Text>
            {item && item.value === value && (
                <Feather name="check" size={20} color={COLORS.blue} />
            )}
        </View>
        );
    };

    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('userData');
            if(value === null) {
                navigation.replace("Login");
            } else {
                console.log(value);
                const url = API_URL + '/userData/' + value.replace(/"/g, '')
                axios.get(url)
                .then((response) => {
                    setUserData(response.data);
                    setValue(response.data.city);
                    setImage(API_URL + "/images/users/"+  response.data.pp)
                    setImageKey(imageKey + 1);
                    setIsLoading(false);
                    if (response.data.role === "ORGANIZER") {
                        setOrganizer(true);
                    }
                    console.log(response.data);
                    const stats = API_URL + '/stats/' + response.data.uid;
                    axios.get(stats)
                    .then((statsResponse) => {
                        setStats(statsResponse.data);
                    })
                })
                .catch((error) => {
                    console.error('Error getting user data:', error);
                });
        }
        } catch(e) {
          // error reading value
        }
    }

    useEffect(() => {
        setIsLoading(true);
        getData();
    }, [isFocused])

    const handleDisconnect = () => {
        AsyncStorage.removeItem('userData')
        .then(() => {
            navigation.navigate('Login');
        })
        .catch((error) => {
            console.error('Error removing user data:', error);
        });
    }

    const handleFavoritesClick = () => {
        navigation.navigate('FavoritesNav')
    }

    const handleTicketsClick = () => {
        navigation.navigate('TicketsNav')
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setIsLoading(true);
        getData();
        setTimeout(() => {
            setRefreshing(false);
        }, 300);
    }, []);

    const handleOrganizerClick = () => {
        if (userData.role === "ORGANIZER"){
            navigation.navigate('OrganizerNav');
        } else {
            navigation.navigate('BecomeOrga');
        }
    }

    const pickImage = async () => {
        setIsLoading(true);
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

            console.log('File name:', fileName);
            console.log('File uri:', result.assets[0].uri);
    
            axios.post(API_URL + '/images/users', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    // Add any additional headers here
                },
            })
            .then((response) => {
                console.log('Image uploaded:', response.data);
                setImage(API_URL + "/images/users/"+  userData.pp)
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error uploading image:', error);
                setIsLoading(false);
            });
        } else {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={{ width: "100%"}} refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={COLORS.blue}
                />
            }>
                <View style={styles.info}>
                { isLoading ? (
                    <ActivityIndicator size="large" color={COLORS.blue} />
                ) : !image ? (
                    <Feather name="user" size={100} color={COLORS.blue} />
                ) : (
                <Image
                    style={{ width: 100, height: 100, borderRadius: 75}}
                    source={{ uri: image}}
                    cachePolicy={"none"}
                /> 
                )}
                <View style={styles.name}>
                    <TouchableOpacity style={styles.nameContainer} onPress={() => pickImage()}>
                        <Text style={styles.title}>{userData.firstName} {userData.lastName}</Text>
                        <Feather name="edit-2" size={22} color={COLORS.blue} />
                    </TouchableOpacity>
                </View>
                <View style={styles.stats}>
                    <View style={styles.allStat}>
                        <TouchableOpacity onPress={handleFavoritesClick}>
                            <Text style={styles.number}>{stats.likes}</Text>
                            <Text style={styles.statName}>Favoris</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.allStat}>
                        <TouchableOpacity onPress={handleTicketsClick}>      
                            <Text style={styles.number}>{stats.tickets}</Text>
                            <Text style={styles.statName}>MyTix</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex: 1, flexDirection: "column", alignItems: 'center', borderRightWidth: 1}}>
                        <TouchableOpacity onPress={handleFavoritesClick}>   
                            <Text style={styles.number}>{stats.followers}</Text>
                            <Text style={styles.statName}>Suivi(e)s</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.settings}>
                    <View style={{height: 1, width: "100%", position: "absolute", backgroundColor: COLORS.grey, marginTop: 15}}/>
                    <Text style={{fontSize: 24, fontWeight: 'bold', color: COLORS.white, marginTop: 30, marginBottom: 15, borderTopWidth: 1, borderTopColor: COLORS.grey, marginLeft: 10}}>Paramètres</Text>
                    <View style={styles.param}>
                        <Text style={styles.paramText}>Ville principal</Text>
                        <Text style={{color: COLORS.blue, marginRight: 50}}>{value}</Text>
                        <Dropdown
                            style={styles.dropdown}
                            data={data}
                            maxHeight={300}
                            onChange={item => {
                                changeValue(item.value);
                            }}
                            renderItem={renderItem}
                        />
                    </View>
                    <View style={styles.param}>
                        <Text style={styles.paramText}>Copier les évènements dans le calendrier</Text>
                        <Switch value={isEnabled} style={{ 
                            transform: [{ scaleX: .8 }, { scaleY: .8 }]
                        }}
                        onChange={() => {{setIsEnabled(previousState => !previousState);}}}
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
                    <TouchableOpacity style={styles.param} onPress={handleDisconnect}>
                        <Text style={styles.paramText}>Deconnexion</Text>
                        <MaterialIcons name="keyboard-arrow-right" size={24} color="grey" />
                    </TouchableOpacity>
                    {organizer ? (
                    <TouchableOpacity style={styles.param} onPress={handleOrganizerClick}>
                        <Text style={styles.paramText}>Passer au mode organisteur</Text>
                        <MaterialIcons name="keyboard-arrow-right" size={24} color="grey" />
                    </TouchableOpacity>
                    ) : (
                    <TouchableOpacity style={styles.param} onPress={handleOrganizerClick}>
                        <Text style={styles.paramText}>Devenir organisateur</Text>
                        <MaterialIcons name="keyboard-arrow-right" size={24} color="grey" />
                    </TouchableOpacity>
                    )}
                </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: COLORS.lightblack,
        width: '100%',
    },
    nameContainer:{
        flexDirection: 'row',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.white,
        marginRight: 10,
    },
    info: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginTop: 20
    },
    name: {
        flexDirection: "row",
        alignItems: 'center',
        marginTop: 20
    },
    stats: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 20
    },
    allStat: {
        flex: 1,
        flexDirection: "column",
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
        marginTop: 5,
        fontSize: 18,
        color: COLORS.blue
    },
    settings: {
        flexDirection: "column",
        alignItems: 'flex-start',
        alignSelf: 'flex-start',
    },
    param: {
        flexDirection: "row",
        justifyContent: "space-between",
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
    icon: {
        marginRight: 5,
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
    image: {
        width: 100,
        height: 100,
        borderRadius: 75,
    },
});


export default AccountScreen;
