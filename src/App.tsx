import React from 'react';
import Player from './components/Player/Player';
import World from './components/World/World';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <Player>
        <World></World>
      </Player>
    </div>
  );
}

export default App;
