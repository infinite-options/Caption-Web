import React, { useState } from "react";
import logo from "./Assets/logo.svg";
import "./App.css";
// import Pic from "./Assets/sd.jpg";
// import Page1 from "./Pages/Page";
// import Landing from "./Pages/Landing";
// import Collections from "./Pages/Collections";
// import Scoreboard from "./Pages/Scoreboard";
import Nav from "./Nav";

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
      {/* <Scoreboard
        title="Dreamworks"
        bestCaption="Just two dudes looking at something funny"
      /> */}
      {/* <Landing /> */}
      {/* <Collections /> */}
      <Nav />
    </div>
  );
}

export default App;
