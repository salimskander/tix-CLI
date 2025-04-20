import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard, Modal, Image } from 'react-native';
import { Entypo, AntDesign } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import ToastBar from '../component/Toastbar';
import { COLORS } from '../../assets/colors';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EventForm = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(['', '', '', '', '', '', '', '']);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [numPhases, setNumPhases] = useState(1);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userData, setUserData] = useState('');
  const [fileName, setFileName] = useState('');

  const navigation = useNavigation();

  const questions = [
    'Nom de l\'événement:',
    'Date:',
    'Lieu:',
    'Nombre de phases:',
    ...Array.from({ length: numPhases }, (_, i) => `Prix des billets de la phase ${i + 1}:`),
    'Image:',
    'Description:',
  ];

  const CustomHeader = ({ title }) => (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleBackButton}>
        <AntDesign name="left" size={27} color={COLORS.orange} />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );

  const handleBackButton = () => setCurrentQuestionIndex(prevIndex => prevIndex > 0 ? prevIndex - 1 : prevIndex);

  const handleAnswer = (text) => setAnswers(prevAnswers => {
    const updatedAnswers = [...prevAnswers];
    updatedAnswers[currentQuestionIndex] = text;
    return updatedAnswers;
  });

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      if (currentQuestionIndex === 1 && selectedDate < new Date()) {
        alert('Veuillez choisir une date future.');
        return;
      }
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } 
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setSelectedDate(currentDate);
    const formattedDate = currentDate.toLocaleDateString('fr-FR');
    handleAnswer(formattedDate);
    setShowDatePickerModal(false);
  };

  useEffect(() => {
    const getData = async () => {
      try {
          const value = await AsyncStorage.getItem('userData');
          setUserData(value)
          const url = API_URL + '/organizers/' + value.replace(/"/g, '')
          axios.get(url)
          .then((response) => {
            setUserData(response.data);
          })
          .catch((error) => {
              console.error('Error getting user data:', error);
          });
      } catch (error) {
          console.error('Error getting async storage:', error);
      }
    }
    getData();
  }, []);

  const decrementPhases = () => setNumPhases(prevNum => prevNum > 1 ? prevNum - 1 : prevNum);

  const incrementPhases = () => setNumPhases(prevNum => prevNum < 5 ? prevNum + 1 : prevNum);

  const handleSubmit = async () => {
    try {
      const eventResponse = await axios.post(API_URL + '/events', {
        name: answers[0],
        date: selectedDate,
        location: answers[2],
        price: answers[4],
        description: answers[6],
        idOrganizer: userData.id,
      });

      console.log('Réponses soumises :', answers);
      setAnswers(['', '', '', '', '', '', '', '']);
      setCurrentQuestionIndex(0);
      setToastMessage('Événement ajouté !'); 
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      navigation.navigate('MyEvents');

      // Upload image if selected
      if (selectedImage) {
        console.log('Uploading image...');
        const eventId = eventResponse.data.eventId;
        const formData = new FormData();
        formData.append('image', {
          uri: selectedImage,
          type: 'image/jpeg',
          name: `${eventId}`,
        });

        await axios.post(API_URL + `/images/events/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          console.log('Image uploaded:', response.data);
        })
        .catch((error) => {
          console.error('Error uploading image:', error);
        });

      } else {
      }
    } catch (error) {
      console.error('Error submitting event:', error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
    });

    if (!result.cancelled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const progressPercentage = (currentQuestionIndex + 1) / questions.length * 100;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <CustomHeader title="Ajouter un événement" />
        <View style={styles.progressBar}>
          <View style={{ width: `${progressPercentage}%`, backgroundColor: COLORS.orange, height: 5 }} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.questionText}>{questions[currentQuestionIndex]}</Text>
          {currentQuestionIndex === 1 ? (
            <>
              <TouchableOpacity style={[styles.input, styles.datePickerContainer]} onPress={() => setShowDatePickerModal(true)}>
                <Text style={styles.datePickerText}>{selectedDate.toLocaleDateString('fr-FR')}</Text>
              </TouchableOpacity>
              <Modal
                visible={showDatePickerModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowDatePickerModal(false)}
              >
                <TouchableWithoutFeedback onPress={() => setShowDatePickerModal(false)}>
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      <DateTimePicker
                        value={selectedDate}
                        mode="date"
                        display="spinner"
                        onChange={handleDateChange}
                      />
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
            </>
          ) : currentQuestionIndex === 3 ? (
            <View style={styles.numericInput}>
              <TouchableOpacity style={styles.phaseButton} onPress={decrementPhases}>
                <Entypo name="minus" size={24} color="black" /> 
              </TouchableOpacity>
              <Text style={styles.phaseInput}>{numPhases}</Text>
              <TouchableOpacity style={styles.phaseButton} onPress={incrementPhases}>
                <Entypo name="plus" size={24} color="black" /> 
              </TouchableOpacity>
            </View>
          ) : currentQuestionIndex >= 4 && currentQuestionIndex < questions.length - 2 ? (
            <View style={styles.input}>
              <TextInput
                style={[
                  styles.textInput,
                  answers[currentQuestionIndex] === '' ? styles.emptyInput : null
                ]}
                value={answers[currentQuestionIndex]}
                onChangeText={handleAnswer}
                placeholder="Réponse"
                placeholderTextColor={COLORS.grey}
                keyboardType={'numeric'}
              />
              <Text style={styles.currencySymbol}>€</Text>
            </View>
          ) : currentQuestionIndex === questions.length-2 ? (
            <>
              {selectedImage ? (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
                  <TouchableOpacity style={styles.input} onPress={pickImage}>
                  <Text style={styles.datePickerText}>Choisir une image</Text>
                </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.input} onPress={pickImage}>
                  <Text style={styles.datePickerText}>Choisir une image</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <TextInput
              style={[styles.input, answers[currentQuestionIndex] === '' ? styles.emptyInput : null]}
              value={answers[currentQuestionIndex]}
              onChangeText={handleAnswer}
              placeholder="Réponse"
              placeholderTextColor={COLORS.grey}
            />
          )}
        </View>
  
        <TouchableOpacity
          style={styles.button}
          onPress={currentQuestionIndex < questions.length - 1 ? handleNextQuestion : handleSubmit}
        >
          <Text style={styles.buttonText}>
            {currentQuestionIndex < questions.length - 1 ? 'Question suivante' : 'Ajouter l\'événement'}
          </Text>
        </TouchableOpacity>
        {showToast && <ToastBar message={toastMessage} />}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightblack,
  },
  header: {
    height: 110,
    backgroundColor: COLORS.darkblack,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.orange,
    marginLeft: 60,
  },
  progressBar: {
    height: 5,
    backgroundColor: COLORS.grey,
    marginBottom: 20,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: 100,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    alignItems: 'center',
  },
  input: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    width: '90%',
    marginBottom: 10,
    marginTop: 60,
    color: COLORS.white,
    borderColor: COLORS.grey,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  textInput: {
    flex: 1,
    color: COLORS.white,
  },
  currencySymbol: {
    color: COLORS.white,
    fontSize: 20,
    marginRight: 10,
  },
  emptyInput: {
    borderColor: COLORS.grey,
  },
  datePickerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  datePickerText: {
    color: COLORS.white,
    fontSize: 16,
  },
  numericInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '55%',
  },
  buttonText: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    backgroundColor: COLORS.orange,
    width: '90%',
    paddingVertical: 15,
    borderRadius: 5,
    shadowColor: COLORS.darkblack,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginHorizontal: 20,
  },
  phaseButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 65,
  },
  phaseInput: {
    fontSize: 34,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: 65,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.lightblack,
    borderRadius: 10,
    padding: 20,
  },
  imagePreviewContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 5,
  },
});

export default EventForm;
