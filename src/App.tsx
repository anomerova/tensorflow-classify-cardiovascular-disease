import React from 'react'
import './App.css'
import {train_model} from './model/train_data.js'

const App = () => {
    train_model()
  return (
    <div className="App">
      <header className="App-header">

      </header>
    </div>
  );
}

export default App;
