// DatabaseContext.js
import React, { createContext, useContext, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';

// Create a context object
const DatabaseContext = createContext();
// Create a provider for components to consume and subscribe to changes
const db = SQLite.openDatabase('muistio.db');


// Create a provider component
export const DatabaseProvider = ({ children }) => {
// Create the database tables
  useEffect(() => {
    console.log('DatabaseContext useEffect');
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS muistio (id INTEGER PRIMARY KEY AUTOINCREMENT, paikka TEXT, pj TEXT, sihteeri TEXT, paikalla TEXT, kokousLaillinen INTEGER, ilmoitusasiat TEXT, uudetKannatusjasenet TEXT, muutEsilleTulevatAsiat TEXT, aloitusTime TEXT, nytTime TEXT);',
        [],
        (_, result) => {
          console.log('Table creation result:', result);
        },
        (_, error) => {
          console.error('Table creation error:', error);
        }
      );
    });
  }, [db]);

 
  
  
  
  
  
  
  
  
  
  
  return (
    <DatabaseContext.Provider value={db}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const db = useContext(DatabaseContext);
  if (!db) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return db;
};
