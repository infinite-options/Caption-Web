import React from "react";
import Pic from "../Assets/sd.jpg";
import { Row, Col, Card } from "reactstrap";
import "../Styles/Scoreboard.css";
import Report from "../Components/Report";
import { Button } from "../Components/Button";

function Scoreboard(props) {
  const title = props.title;
  const bestCaption = "Two dudes watching the Sharknado trailer";
  return (
    <div>
      <h1>{title}</h1>
      <h3> Scoreboard</h3>
      <img className="img2" src={Pic} />

      <h4 classname="row">Winning Caption:</h4>
      <h4>{bestCaption}</h4>
      <br></br>

      <Report
        // alias="Mickey"
        caption="Shrek and Donkey"
        // points="10"
        // totalPts="42"
        // votes="2"
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
      <br></br>
      <Button destination="/" children="back to the landing page" />
    </div>
  );
}

export default Scoreboard;
