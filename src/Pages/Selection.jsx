import React from "react";
import Pic from "../Assets/sd.jpg";
import { Row, Col, Card } from "reactstrap";
import "../Styles/Scoreboard.css";
import Report from "../Components/Report";
import { Button } from "../Components/Button";
import background from "../Assets/temp.png";

function Scoreboard(props) {
  const title = props.title;
  const bestCaption = "Two dudes watching the Sharknado trailer";
  return (
    <div
    style={{
      maxWidth: "375px",
      height: "812px",
      //As long as I import the image from my package strcuture, I can use them like so
      backgroundImage: `url(${background})` 
      // backgroundImage:
      //   "url('https://images.unsplash.com/photo-1557683325-3ba8f0df79de?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTZ8fHxlbnwwfHx8fA%3D%3D&w=1000&q=80')",
    }}
  >
      {/* <h1>{title}</h1> */}
      <h1>Name of Deck</h1>
      <br></br>

      <h4 classname="row">Pick Your Favorite Caption</h4>
      <br></br>
      <img className="img2" src={Pic} />
      <br></br>
      <br></br>
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
      <Button  buttonStyle="btn--outline" children="Shrek and Donkey" />
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
