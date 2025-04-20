import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';
import FollowersList from '../screens/FollowersList';

const Stack = createStackNavigator();

export default function ProfileNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} options={{
        headerShown: false
      }} />
      <Stack.Screen name="Followers" component={FollowersList} options={{
        headerShown: false
      }} />
    </Stack.Navigator>
  );
}