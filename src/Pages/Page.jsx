import React, { useState } from "react";
import Pic from "../Assets/sd.jpg";
import Countdown from "react-countdown";
import { Row, Col, Card } from "reactstrap";
import SimpleForm from "../Components/SimpleForm";
import { Button } from "../Components/Button";
import "../Styles/Scoreboard.css";
import background from "../Assets/temp.png";

//Documentation for the CountdownCircleTimer component
//https://github.com/vydimitrov/react-countdown-circle-timer#props-for-both-reactreact-native
import { CountdownCircleTimer } from "react-countdown-circle-timer";

export default function Page() {
  const [caption, setCaption] = useState("");
  const [timeUp, setTimeUp] = useState(false);

  const handleCaptionChange = (newCaption) => {
    setCaption(newCaption);
  };

  function countdownComplete() {
    setTimeUp(true);
  }

  return (
    <div
      style={{
        maxWidth: "375px",
        height: "812px",
        //As long as I import the image from my package strcuture, I can use them like so
        backgroundImage: `url(${background})`,
        // backgroundImage:
        //   "url('https://images.unsplash.com/photo-1557683325-3ba8f0df79de?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTZ8fHxlbnwwfHx8fA%3D%3D&w=1000&q=80')",
      }}
    >
      <div style={{ padding: "20px" }}>
        <h1>Name of Deck</h1>
        <br></br>
        <h4>Enter the Caption</h4>
        <img className="img2" src={Pic} />
        <br></br>
        <br></br>
        {timeUp ? (
          <div>
            <h1>You have captioned the above image as: "{caption}"</h1>
            <Button
              className="landing2"
              destination="/selection"
              children="Continue"
            />
          </div>
        ) : (
          <div>
            <SimpleForm
              className="input2"
              field="Caption The Image Before the Timer runs out"
              onHandleChange={handleCaptionChange}
            />
            <br></br>
            <Row>
              <Col>
                <br></br>{" "}
                <Button
                  className="landing3"
                  onClick={countdownComplete}
                  children="Submit"
                />
              </Col>
              <Col>
                <div
                  style={{
                    background: "yellow",
                    borderRadius: "60px",
                    width: "120px",
                  }}
                >
                  <CountdownCircleTimer
                    background="red"
                    size={120}
                    strokeWidth={5}
                    isPlaying
                    duration={100}
                    colors="#000000"
                  >
                    {({ remainingTime }) => remainingTime}
                  </CountdownCircleTimer>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </div>
    </div>
  );
}
