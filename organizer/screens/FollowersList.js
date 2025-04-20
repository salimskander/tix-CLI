import React, {useState, useEffect} from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { COLORS } from '../../assets/colors'; // Importez vos couleurs depuis votre fichier de couleurs
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '@env';
import { Image } from 'expo-image';

const FollowersList = ({ route }) => {
  const navigation = useNavigation(); // Hook de navigation
  const [followers, setFollowers] = useState([]); // Initialiser l'état des followers à une liste vide
  const [loading, setLoading] = useState(true); // Initialiser l'état de chargement à vrai
  const [refreshing, setRefreshing] = useState(false); // Initialiser l'état de rafraîchissement à faux

  const { userId } = route.params; // Récupérer les paramètres de la route

  useEffect(() => {
    setLoading(true); // Afficher l'indicateur de chargement
    getFollowers(); // Appeler la fonction getFollowers() lors du premier rendu
    setLoading(false); // Masquer l'indicateur de chargement
  }, []);

  const getFollowers = () => {
    axios.get(API_URL + '/follows/followers/' + userId)
    .then((response) => {
      setFollowers(response.data);
    })
    .catch((error) => {
      console.error('Error getting followers:', error);
    });
  }

  const onRefresh = () => {
    setRefreshing(true); // Afficher l'indicateur de rafraîchissement
    getFollowers(); // Appeler la fonction getFollowers()
    setTimeout(() => {
      setRefreshing(false); // Masquer l'indicateur de rafraîchissement
    }, 300);
  }
  
  // Render item for FlatList
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image source={API_URL + "/images/users/" + item.pp} style={styles.profileImage} />
      <Text style={styles.title}>{item.lastName} {item.firstName}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.orange} />
      ) : (
      <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconContainer}>
        <AntDesign name="left" size={27} color={COLORS.orange} />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.header}>Liste des followers</Text>
        <View style={styles.separator}></View>
      </View>
      <FlatList
        data={followers}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.orange}
          />
        }
        keyExtractor={item => item.id}
      />
      </View>
    )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightblack, // Utilisez votre couleur lightblack
    alignItems: 'stretch', // Permet aux éléments enfants de s'étirer sur toute la largeur
    justifyContent: 'center', 
  },
  titleContainer: {
    marginBottom: 10,
    backgroundColor: COLORS.darkblack, // Couleur de fond du titre
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.orange, // Couleur de l'en-tête
    textAlign: 'center', // Centrer le texte
    marginTop: 60, // Marge supérieure
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey,
    marginTop: 20,
    
  },
  item: {
    backgroundColor: COLORS.lightblack, // Couleur de fond des éléments de la liste
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5, // Ajoutez une bordure arrondie aux éléments
    flexDirection: 'row', // Aligner les éléments horizontalement
    alignItems: 'center', // Centrer les éléments verticalement
    shadowColor: COLORS.black, // Couleur de l'ombre
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Pour les ombres sur Android
  },
  title: {
    fontSize: 16,
    color: COLORS.white, // Couleur du texte
    textAlign: 'center', // Centrer le texte
    marginLeft: 20, // Marge à gauche pour séparer l'image du texte
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 250, // Pour arrondir l'image
  },
  iconContainer: {
    position: 'absolute',
    top: 62,
    left: 20,
    zIndex: 1, // Pour placer l'icône au-dessus du contenu
  },
});

export default FollowersList;
