import React, { useState } from "react";
import Pic from "../Assets/sd.jpg";
import Countdown from "react-countdown";
import SimpleForm from "../Components/SimpleForm";
import { Button } from "../Components/Button";
import "../Styles/Scoreboard.css";
import background from "../Assets/landing.png";

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
      backgroundImage: `url(${background})` 
      // backgroundImage:
      //   "url('https://images.unsplash.com/photo-1557683325-3ba8f0df79de?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTZ8fHxlbnwwfHx8fA%3D%3D&w=1000&q=80')",
    }}
  >
      <div style={{ padding: "20px" }}>
        <img className="img2" src={Pic} />
        <br></br>
        <br></br>
        {timeUp ? (
          <div>
            <h1>You have captioned the above image as: "{caption}"</h1>
            <Button destination="/selection" children="navigate to selection" />
          </div>
        ) : (
          <div>
            <SimpleForm
              field="Caption The Image Before the Timer runs out"
              onHandleChange={handleCaptionChange}
            />
            <br></br>
            <button onClick={countdownComplete}> Submit</button>
            <br></br>
            10s Timer:{" "}
            <Countdown
              date={Date.now() + 100 * 1000}
              onComplete={countdownComplete}
            />
          </div>
        )}
      </div>
    </div>
  );
}
