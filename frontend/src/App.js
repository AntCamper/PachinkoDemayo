import React, { useState, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import Launcher from './components/Launcher';
import Scoreboard from './components/ScoreBoard';
import './assets/styles/index.css';

function App() {
  const [score, setScore] = useState(0);
  const [balls, setBalls] = useState([]);

  const launchBall = () => {
    // We'll implement this later
  };

  return (
    <div className="App">
      <Scoreboard score={score} />
      <GameBoard balls={balls} />
      <Launcher onLaunch={launchBall} />
    </div>
  );
}

export default App;