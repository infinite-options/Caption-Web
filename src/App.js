import React, { useState } from "react";
import logo from "./images/logo.svg";
import "./App.css";
import Pic from "./images/sd.jpg";
import Page1 from "./Components/Page";

function App() {
  const [gameStart, setGameStart] = useState(false);

  function startGame() {
    setGameStart(true);
  }

  return (
    <div className="App">
      {gameStart ? (
        <Page1 />
      ) : (
        <div>
          <button onClick={startGame}>Begin the Game</button>
          <h4>Click the button to begin</h4>
        </div>
      )}
    </div>
  );
}

export default App;
