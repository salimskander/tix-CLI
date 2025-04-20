import { createStackNavigator } from '@react-navigation/stack';

import FavoritesScreen from '../screens/FavoritesScreens/FavoritesScreen.js';
import EventDetails from '../screens/FavoritesScreens/EventDetails.js';

const Stack = createStackNavigator();

export default function FavoritesNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Favorites" component={FavoritesScreen} options={{
        headerShown: false
      }}/>
      <Stack.Screen name="EventDetails" component={EventDetails} options={{
        headerShown: false
      }}/>
    </Stack.Navigator>
  );
}