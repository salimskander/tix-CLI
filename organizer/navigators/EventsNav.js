import { createStackNavigator } from '@react-navigation/stack';
import EventDetails from '../screens/EventDetails';
import MyEventsScreen from '../screens/MyEvents';

const Stack = createStackNavigator();

export default function EventNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Events" component={MyEventsScreen} options={{
        headerShown: false
      }} />
      <Stack.Screen name="EventDetails" component={EventDetails} options={{
        headerShown: false
      }} />
    </Stack.Navigator>
  );
}