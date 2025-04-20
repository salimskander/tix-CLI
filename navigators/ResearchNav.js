import { createStackNavigator } from '@react-navigation/stack';

import ResearchScreen from '../screens/ResearchScreens/ResearchScreen';

const Stack = createStackNavigator();

export default function ResearchNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Research" component={ResearchScreen} options={{
        headerShown: false
      }}/>
    </Stack.Navigator>
  );
}