import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AlkoLocator from "./components/AlkoLocator";
import Gokoustin from "./components/Gokoustin";

import Ionicons from "react-native-vector-icons/Ionicons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import React from "react";

import GokousMuistiot from "./components/GokousMuistiot";

import { DatabaseProvider } from "./components/DatabaseContext";

export default function App() {
  const Tab = createBottomTabNavigator();

  return (
    <DatabaseProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              let IconLibrary;

              if (route.name === "Gokoustin") {
                iconName = "pencil";
                IconLibrary = Ionicons;
              } else if (route.name === "Muistiot") {
                iconName = "notebook";
                IconLibrary = MaterialCommunityIcons; // Change this to the library you want
              } else if (route.name === "Tutka") {
                iconName = "map";
                IconLibrary = MaterialCommunityIcons; // Change this to the library you want
              }

              // Return the icon component from the chosen library
              return <IconLibrary name={iconName} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Gokoustin" component={Gokoustin} />
          <Tab.Screen name="Muistiot" component={GokousMuistiot} />
          <Tab.Screen name="Tutka" component={AlkoLocator} />
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </DatabaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "normal",
    textAlign: "center",
  },
});
