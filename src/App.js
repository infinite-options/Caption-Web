import React, { useState } from "react";
import logo from "./Assets/logo.svg";
import "./App.css";
import Pic from "./Assets/sd.jpg";
import Page1 from "./Pages/Page";

import Scoreboard from "./Pages/Scoreboard";

function App() {
  const [gameStart, setGameStart] = useState(false);

  function startGame() {
    setGameStart(true);
  }

  return (
    <div className="App">
      {/* {gameStart ? (
        <Page1 />
      ) : (
        <div>
          <button onClick={startGame}>Begin the Game</button>
          <h4>Click the button to begin</h4>
        </div>
      )} */}
      <Scoreboard
        title="Dreamworks"
        bestCaption="Just two dudes looking at something funny"
      />
    </div>
  );
}

export default App;
