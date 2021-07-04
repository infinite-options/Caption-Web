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
      <h3>Selection</h3>
      <img className="img2" src={Pic} />

      <h4 classname="row">Select the Best Caption</h4>
      {/* <h4>{bestCaption}</h4>
      <br></br> */}

      {/* <Report
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
      /> */}
      <Button buttonStyle="btn--outline" children="Shrek and Donkey" />
      <br></br>
      <Button
        buttonStyle="btn--outline"
        children="Two really nice halloween costumes"
      />
      <br></br>
      <Button buttonStyle="btn--outline" children="Shrek Dead Redemption" />
      <br></br>
      <br></br>
      <Button destination="/scoreboard" children="Continue to Scoreboard" />
    </div>
  );
}

export default Scoreboard;
