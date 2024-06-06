// src/App.js

import React from 'react';
import FirestoreData from './FirestoreData';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to My Firebase App</h1>
        <FirestoreData />
      </header>
    </div>
  );
}

export default App;
