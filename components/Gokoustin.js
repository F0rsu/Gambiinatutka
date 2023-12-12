import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import moment from 'moment';




import { useDatabase } from './DatabaseContext';

export default function Gokoustin() {
  
  
  const db = useDatabase();
 
 
 
  const [aloitusTime, setAloitusTime] = useState("");
  const [paikka, setPaikka] = useState("");
  const [pj, setPj] = useState("");
  const [sihteeri, setSihteeri] = useState("");
  const [paikalla, setPaikalla] = useState("");
  const [kokousLaillinen, setKokousLaillinen] = useState(false);
  const [ilmoitusasiat, setIlmoitusasiat] = useState("");
  const [uudetKannatusjasenet, setUudetKannatusjasenet] = useState("");
  const [muutEsilleTulevatAsiat, setMuutEsilleTulevatAsiat] = useState("");
  const [muistio, setMuistio] = useState([]);
  const [nytTime, setNytTime] = useState("");
 // const [isLoading, setIsLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
 
 





  

  const saveData = () => {
    const data = {
      paikka,
      pj,
      sihteeri,
      paikalla,
      kokousLaillinen,
      ilmoitusasiat,
      uudetKannatusjasenet,
      muutEsilleTulevatAsiat,
      aloitusTime,
      nytTime,
    };
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO muistio (paikka, pj, sihteeri, paikalla, kokousLaillinen, ilmoitusasiat, uudetKannatusjasenet, muutEsilleTulevatAsiat, aloitusTime, nytTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
        [paikka, pj, sihteeri, paikalla, kokousLaillinen, ilmoitusasiat, uudetKannatusjasenet, muutEsilleTulevatAsiat, aloitusTime, nytTime],
        (_, { insertId }) => {
          setMuistio([...muistio, { id: insertId, ...data }]);
         console.log(muistio);
         
          // Reset form fields to empty values
          setPaikka("");
          setPj("");
          setSihteeri("");
          setPaikalla("");
          setKokousLaillinen(false);
          setIlmoitusasiat("");
          setUudetKannatusjasenet("");
          setMuutEsilleTulevatAsiat("");
          setAloitusTime("");
          setNytTime("");
        },
        (_, error) => console.error(error)
      );
    });
  };
 



  const handleAloitusPress = () => {
    const currentTime = moment().format('HH:mm:ss');
    setAloitusTime(currentTime);
  };

  const handleNytPress = () => {
    const currentTime = moment().format('HH:mm:ss');
    setNytTime(currentTime);
  };
 
 
 
 
 
 
 
 
  return (

   <View style={styles.container}>
  
  
      
      <Text style={styles.title}>Kokousmuistio</Text>
      <Text style={styles.headline}>Kokous alkaa</Text>
      
      <Button title="Aloitus" onPress={handleAloitusPress} />
      <Text style={styles.itemText}>Aloitus aika: {aloitusTime}</Text>
      <TextInput
        style={styles.input}
        placeholder="Paikka"
        onChangeText={(text) => setPaikka(text)}
        value={paikka}
      />
      <TextInput
        style={styles.input}
        placeholder="PJ"
        onChangeText={(text) => setPj(text)}
        value={pj}
      />
      <TextInput
        style={styles.input}
        placeholder="Sihteeri"
        onChangeText={(text) => setSihteeri(text)}
        value={sihteeri}
      />
      <TextInput
        style={styles.input}
        placeholder="Paikalla"
        onChangeText={(text) => setPaikalla(text)}
        value={paikalla}
      />

      <Text style={styles.headline}>
        Kokouksen laillisuus ja päätösvaltaisuus
      </Text>
      <RNPickerSelect
        onValueChange={(value) => setKokousLaillinen(value)}
        items={[
          {
            label: "Kokous on laillinen ja päätösvaltainen",
            value: "Kokous on laillinen ja päätösvaltainen",
          },
          {
            label: "Kokous ei ole laillinen ja päätösvaltainen",
            value: "Kokous ei ole laillinen ja päätösvaltainen",
          },
          { label: "Muu", value: "Muu" },
        ]}
      />

      <TextInput
        style={styles.input}
        placeholder="Ilmoitusasiat ja posti"
        onChangeText={(text) => setIlmoitusasiat(text)}
        value={ilmoitusasiat}
      />
      <TextInput
        style={styles.input}
        placeholder="Uusien kannatusjäsenten hyväksyminen"
        onChangeText={(text) => setUudetKannatusjasenet(text)}
        value={uudetKannatusjasenet}
      />
      <TextInput
        style={styles.input}
        placeholder="Muut esille tulevat asiat"
        onChangeText={(text) => setMuutEsilleTulevatAsiat(text)}
        value={muutEsilleTulevatAsiat}
      />
     
     <Text style={styles.headline}>Kokouksen päättäminen</Text>
     <Button title="Nyt" onPress={handleNytPress} />
     <Text style={styles.itemText}>Päättymis aika: {nytTime}</Text>
     
     
      <Button title="Tallenna" onPress={saveData} />
   
     
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  headline: {
    fontSize: 15,
    fontWeight: "bold",
   
    
}
 ,
  input: {
    height: 40,
    width: "80%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkboxLabel: {
    marginRight: 8,
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  itemText: {
    fontSize: 18,
  },
});

