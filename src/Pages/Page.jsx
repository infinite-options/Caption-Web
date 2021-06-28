import React, { useState } from "react";
import Pic from "../Assets/sd.jpg";
import Countdown from "react-countdown";
import SimpleForm from "../Components/SimpleForm";

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
        <img src={Pic} />
        <br></br>
        <br></br>
        {timeUp ? (
          <h1>You have captioned the above image as: "{caption}"</h1>
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
              date={Date.now() + 5 * 1000}
              onComplete={countdownComplete}
            />
          </div>
        )}
      </div>
    </div>
  );
}
