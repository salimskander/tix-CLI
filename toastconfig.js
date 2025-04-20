import Toast from 'react-native-toast-message';

export const toastConfig = {
  success: ({ text1 }) => (
    <View style={{ height: 60, width: '100%', backgroundColor: 'green' }}>
      <Text style={{ color: 'white', textAlign: 'center' }}>{text1}</Text>
    </View>
  ),
  error: ({ text1 }) => (
    <View style={{ height: 60, width: '100%', backgroundColor: 'red' }}>
      <Text style={{ color: 'white', textAlign: 'center' }}>{text1}</Text>
    </View>
  ),
  info: ({ text1 }) => (
    <View style={{ height: 60, width: '100%', backgroundColor: 'blue' }}>
      <Text style={{ color: 'white', textAlign: 'center' }}>{text1}</Text>
    </View>
  ),
};
