import React, { useState } from "react";
import Pic from "../Assets/sd.jpg";
import Countdown from "react-countdown";
import SimpleForm from "../Components/SimpleForm";
import { Button } from "../Components/Button";
import "../Styles/Scoreboard.css";

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
    <div>
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
              date={Date.now() + 10 * 1000}
              onComplete={countdownComplete}
            />
          </div>
        )}
      </div>
    </div>
  );
}
