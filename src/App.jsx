import React from 'react';
import './App.css';
import './homepage.css';
import { useEffect } from 'react';
import LudoBoard from './components/LudoBoard';
import redPlayerContext from './context/RedPlayerContext';
function App() {
  return (
    <>
      <LudoBoard />
    </>
  );
}

export default App;