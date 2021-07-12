import React from "react";
import Pic from "../Assets/sd.jpg";
import { Row, Col, Card } from "reactstrap";
import "../Styles/Scoreboard.css";
import Report from "../Components/Report";
import { Button } from "../Components/Button";
import background from "../Assets/temp2.png";

function Scoreboard(props) {
  const title = props.title;
  const bestCaption = "Two dudes watching the Sharknado trailer";
  return (
    <div
      style={{
        maxWidth: "370px",
        height: "840px",
        //As long as I import the image from my package strcuture, I can use them like so
        backgroundImage: `url(${background})`,
        // backgroundImage:
        //   "url('https://images.unsplash.com/photo-1557683325-3ba8f0df79de?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTZ8fHxlbnwwfHx8fA%3D%3D&w=1000&q=80')",
      }}
    >
      <h1>Name of Deck</h1>
      <br></br>
      <h3> Scoreboard</h3>
      <img className="img2" src={Pic} />

      <br></br>
      <br></br>
      {/* <Card>{bestCaption}</Card>
      <h4 style={{ color: "white" }}>Winning Caption!</h4> */}
      <br></br>

      <Report
        isWinner="true"
        alias="Mickey"
        caption="Shrek and Donkey"
        points="10"
        totalPts="42"
        votes="2"
      />

      <Report
        alias="Mickey"
        caption="Scooby Doo and Shaggy"
        points="10"
        totalPts="42"
        votes="2"
      />
      <Report
        alias="Mickey"
        caption="Shrek and Donkey"
        points="10"
        totalPts="42"
        votes="2"
      />
      <br></br>
      <Button className="fat" destination="/" children="Next Round" />
    </div>
  );
}

export default Scoreboard;
