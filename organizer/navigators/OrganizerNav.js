import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import AddEvent from '../screens/EventForm';
import { AntDesign } from '@expo/vector-icons';
import { COLORS } from '../../assets/colors.js';
import EventNav from '../navigators/EventsNav.js';
import ProfileNav from '../navigators/ProfileNav.js'; // Assurez-vous que le chemin est correct

const Tab = createBottomTabNavigator();

const OrganizerNav = ({ navigation }) => {
  return (
    <Tab.Navigator
      screenOptions={{
          tabBarActiveTintColor: COLORS.orange,
          tabBarInactiveTintColor: COLORS.grey,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: COLORS.darkblack,
            borderTopWidth: 0.5,
            borderTopColor: "rgba(255, 255, 255, 0.1)",
          },
        }}
      >
      <Tab.Screen
        name="MyEvents"
        component={EventNav}
        options={{
            tabBarIcon: ({size, color}) => (
              <AntDesign name="calendar" size={24} color={color} />
            ),
            headerShown: false,
          }}
      />
      <Tab.Screen
        name="AddEvent" 
        component={AddEvent} 
        options={{
            tabBarIcon: ({size, color}) => (
              <AntDesign name="pluscircleo" size={24} color={color} />
            ),
            headerShown: false,
          }}
      />
      <Tab.Screen 
        name="profile" 
        component={ProfileNav}
        options={{
            tabBarIcon: ({size, color}) => (
              <FontAwesome name="user" size={size} color={color} />
            ),
            headerShown: false,
          }}

      /> 
    </Tab.Navigator>
  );
}

export default OrganizerNav;
