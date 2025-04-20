import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreens/HomeScreen';
import EventDetails from '../screens/HomeScreens/EventDetails';
import BuyedTicket from '../screens/HomeScreens/BuyedTicket';

import { COLORS } from '../assets/colors';

const Stack = createStackNavigator();

export default function HomeNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{
        headerShown: false
      }}/>
      <Stack.Screen name="EventDetails" component={EventDetails} options={{
        headerShown: false
      }}/>
      <Stack.Screen name="BuyedTicket" component={BuyedTicket} options={{
        headerShown: false
      }}/>
    </Stack.Navigator>
  );
}