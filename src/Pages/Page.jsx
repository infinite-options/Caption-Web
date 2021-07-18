import React, { useState } from "react";
import Pic from "../Assets/sd.jpg";
import Countdown from "react-countdown";
import { Row, Col, Card } from "reactstrap";
import Form from "../Components/Form";
import { Button } from "../Components/Button";
// import "../Styles/Scoreboard.css";
import "../Styles/Page.css";
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

  function transition(){
    window.location.href = "/selection";
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
        <br></br>

        <h1
          style={{
            fontSize: "20px",
          }}
        >
          Name of Deck
        </h1>
        <br></br>

        <img className="centerPic" src={Pic} />

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
            <Form
              className="input2"
              field="Enter your caption here"
              onHandleChange={handleCaptionChange}
            />
            <br></br>
            <Row>
              <span style={{ marginLeft: "50px" }}></span>
              <div
                style={{
                  background: "yellow",
                  borderRadius: "30px",
                  width: "60px",
                }}
              >
                <CountdownCircleTimer
                  background="red"
                  size={60}
                  strokeWidth={5}
                  isPlaying
                  duration={100}
                  colors="#000000"
                  onComplete={transition}
                >
                  {({ remainingTime }) => (
                    <div className="countdownText">{remainingTime}</div>
                  )}
                </CountdownCircleTimer>
              </div>
              <span style={{ marginLeft: "60px" }}></span>
              <br></br>{" "}
              <Button
                className="fat"
                // onClick={countdownComplete}
                children="Submit"
              />
            </Row>
          </div>
        )}
      </div>
    </div>
  );
}
