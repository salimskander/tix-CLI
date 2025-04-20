import 'react-native-gesture-handler';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Entypo, FontAwesome, FontAwesome6 } from '@expo/vector-icons';

import HomeNav from '../navigators/HomeNav';
import ResearchNav from '../navigators/ResearchNav';
import TicketsNav from '../navigators/TicketsNav.js';
import FavoritesNav from '../navigators/FavoritesNav';
import AccountNav from '../navigators/AccountNav';

import { COLORS } from '../assets/colors.js'; 

const Tab = createBottomTabNavigator();


export default function Home() {
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
          name="HomeNav"
          component={HomeNav}
          options={{
            headerShown: false,
            tabBarIcon: ({size, color}) => (
              <Entypo name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="ResearchNav"
          component={ResearchNav}
          options={{
            headerShown: false,
            tabBarIcon: ({size, color}) => (
              <FontAwesome name="search" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="TicketsNav"
          component={TicketsNav}
          options={{
            headerShown: false,
            tabBarIcon: ({size, color}) => (
              <FontAwesome6 name="ticket" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="FavoritesNav"
          component={FavoritesNav}
          options={{
            headerShown: false,
            tabBarIcon: ({size, color}) => (
              <FontAwesome name="heart" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="AccountNav"
          component={AccountNav}
          options={{
            headerShown: false,
            tabBarIcon: ({size, color}) => (
              <FontAwesome name="user" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
  );
}
