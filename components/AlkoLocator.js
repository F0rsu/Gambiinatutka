import { useState, useEffect } from "react";
import { Alert, StyleSheet, View, Button, Text } from "react-native";
import * as Location from "expo-location";
import MapView, { Marker, Callout } from "react-native-maps";

// web scraping libraries
const cheerio = require("cheerio");

import axios from "axios";

export default function AlkoLocator() {
  const [region, setRegion] = useState({
    latitude: 60.200692,
    longitude: 24.934302,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [alkos, setAlkos] = useState([]);
  const [loading, setLoading] = useState(false);
 
 // web scraping function for gambina stock
  const getStoreStock = async () => {
    try {
      const response = await axios.get(
        "https://www.alko.fi/INTERSHOP/web/WFS/Alko-OnlineShop-Site/fi_FI/-/EUR/ViewProduct-Include?SKU=319027&AppendStoreList=true&AjaxRequestMarker=true"
      );
      const $ = cheerio.load(response.data);
      const storeStock = $(".store-item.stockInStore")
        .map((i, store) => {
          const storeName = $(store).find(".store-in-stock").text();
          const gambinaStock = $(store).find(".number-in-stock").text();
          return { storeName, gambinaStock };
        })
        .get();
      return storeStock;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

 
 // fuction for getting alko locations, asking for permission to use user's location and setting the region to user's location. 
 // Also mapping the alkos array to markers on the map.
 const getAlkos = async () => {
  try {
    setLoading(true); // Set loading to true when starting the request

    const storeStock = await getStoreStock();

    // Ask for permission to use location
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("No permission to get location");
      return;
    }
    
    // Get user's location
    let location = await Location.getCurrentPositionAsync({});
    let latitude = location.coords.latitude;
    let longitude = location.coords.longitude;
    setRegion({
      latitude,
      longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
// Get alkos near user's location
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=4000&type=liquor_store&keyword=alko&key=${process.env.EXPO_PUBLIC_API_URL_Google}`
    );
    const jsonData = await response.json();

   // Map the results to markers on the map
    if (jsonData.results.length > 0) {
      const alkos = jsonData.results.map((result) => {
        const storeData = storeStock.find(
          (store) => store.storeName === result.name
        );
        return {
          id: result.place_id,
          title: result.name,
          description: result.vicinity,
          latlng: {
            latitude: result.geometry.location.lat,
            longitude: result.geometry.location.lng,
          },
          gambinaStock: storeData ? storeData.gambinaStock : "ei saatavilla",
        };
      });
      setAlkos(alkos);
    } else {
      Alert.alert("Alkojen haku ei onnistunut");
    }
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false); // Set loading to false after completing the request
  }
};

  return (
    <View style={styles.container}>
     <MapView style={styles.map} region={region}>
 
   
        {/* Marker for user's location */}
        <Marker
          coordinate={{
            latitude: region.latitude,
            longitude: region.longitude,
          }}
          title="Sijaintisi"
          pinColor="blue" 
        />
 
 
 
 
 
   {/* Markers for alkos  */}
 
  {alkos.map((alko) => (
    <Marker
      key={alko.id}
      coordinate={alko.latlng}
      title={alko.title}
      description={alko.description}
    >
      <Callout>
        <View>
          <Text>{alko.title}</Text>
          <Text>{alko.description}</Text>
          <Text>Gambinan saatavuus myymälässä: {alko.gambinaStock}</Text>
        </View>
      </Callout>
    </Marker>
  ))}
</MapView>
<Button title="Hae Alkoja" onPress={getAlkos} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  map: {
    width: "100%",
    height: "70%",
  },
});
