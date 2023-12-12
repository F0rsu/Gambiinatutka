import React, { useState, useEffect } from "react";
import { FlatList, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useDatabase } from './DatabaseContext';
import { useFocusEffect } from '@react-navigation/native';

export default function GokousMuistiot() {
  const db = useDatabase();
  const [data, setData] = useState([]);

 
 // after searching, this was the easiest way to get the updated data to show
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );
  
  
  // This function fetches data from the database
  const fetchData = () => {
    if (!db) {
      console.log('db not loaded');
    } else {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM muistio;',
          [],
          (_, { rows }) => {
            setData(rows._array);
          },
          (_, error) => {
            console.error(error);
          }
        );
      });
    }
  };


  // for deleting data from the database
  const handleDelete = (id) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM muistio WHERE id = ?;',
        [id],
        (_, result) => {
          // Update the data state after deletion
          setData(data.filter(item => item.id !== id));
        },
        (_, error) => {
          console.error('Delete error:', error);
        }
      );
    });
  };



 
 // if there is no data, show this
 
  if (data.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Ei muistioita</Text>
      </View>
    );
  }
  
  
  
  
  
  return (
   
   <View>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Text style={styles.deleteButton}>X</Text>
            </TouchableOpacity>
            <Text style={styles.itemText}>Aloitusaika: {item.aloitusTime}</Text>
            <Text style={styles.itemText}>Paikka: {item.paikka}</Text>
            <Text style={styles.itemText}>PJ: {item.pj}</Text>
            <Text style={styles.itemText}>Sihteeri: {item.sihteeri}</Text>
            <Text style={styles.itemText}>Paikalla: {item.paikalla}</Text>
            <Text style={styles.itemText}>Kokouksen laillisuus:</Text>
            <Text style={styles.itemText}>{item.kokousLaillinen}</Text>
            <Text style={styles.itemText}>
              Ilmoitusasiat ja posti: {item.ilmoitusasiat}
            </Text>
            <Text style={styles.itemText}>
              Uusien kannatusjäsenten hyväksyminen: {item.uudetKannatusjasenet}
            </Text>
            <Text style={styles.itemText}>
              Muut esille tulevat asiat: {item.muutEsilleTulevatAsiat}
            </Text>
            <Text style={styles.itemText}>Lopetusaika:{item.nytTime}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
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
  itemContainer: {
    backgroundColor: "pink",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 10,
  },
  deleteButton: {
    fontSize: 18,
    color: "red",
    marginRight: 10,
  },
  itemText: {
    fontSize: 18,
  },
});
