import React from "react";
import Pic from "../Assets/sd.jpg";
import { Row, Col, Card } from "reactstrap";
import "./Scoreboard.css";
import Report from "../Components/Report";

function Scoreboard(props) {
  const title = props.title;
  const bestCaption = props.bestCaption;

  return (
    <div>
      <h1>{title}</h1>
      <h3> Scoreboard</h3>
      <img src={Pic} />
      <Card>{bestCaption}</Card>
      <h4>Winning Caption!</h4>
      <br></br>

      <Report
        alias="Mickey"
        caption="Shrek and Donkey"
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
      <Report
        alias="Mickey"
        caption="Shrek and Donkey"
        points="10"
        totalPts="42"
        votes="2"
      />
    </div>
  );
}

export default Scoreboard;
