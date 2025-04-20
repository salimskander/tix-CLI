import { createStackNavigator } from '@react-navigation/stack';

import TicketsScreen from '../screens/TicketsScreens/TicketsScreen';
import EventDetails from '../screens/TicketsScreens/EventDetails';

const Stack = createStackNavigator();

export default function TicketsNav() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Pour cacher le header
      }}
    >
      <Stack.Screen name="Tickets" component={TicketsScreen} />
      <Stack.Screen name="EventDetails" component={EventDetails} />
    </Stack.Navigator>
  );
}
