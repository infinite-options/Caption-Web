import React, { useState } from "react";
import axios from "axios";
import SimpleForm from "../Components/SimpleForm";
import Background from "../Assets/sd.jpg";
import { Button } from "../Components/Button.jsx";
import background from "../Assets/landing.png";
import "../Styles/Landing.css";

function Landing() {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [zipCode, setZipCode] = useState("");

  var sectionStyle = {
    width: "100%",
    height: "400px",
    backgroundImage: "url(" + { Background } + ")",
  };

  const handleCodeChange = (codeInput) => {
    setCode(codeInput);
  };

  const handleNameChange = (nameInput) => {
    setName(nameInput);
  };

  const handleEmailChange = (emailInput) => {
    setEmail(emailInput);
  };

  const handleZipCodeChange = (zipCodeInput) => {
    setZipCode(zipCodeInput);
  };

  function createGame() {
    const postURL =
      "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/createGame";
    const payload = {
      rounds: "6",
      round_time: "0000-00-00 00:00:10",
    };

    axios.post(postURL, payload).then((res) => console.log(res));
  }

  function joinGame() {
    const getURL =
      "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/checkGame";

    axios.get(getURL + "/" + code).then((res) => {
      console.log(res);
    });
  }

  return (
    <div
      style={{
        maxWidth: "375px",
        height: "812px",
        // backgroundImage: `url(${background})`,
      }}
    >
      <div
        className="testBlur"
        style={{
          backgroundImage: `url(${background})`,
        }}
      ></div>
      <div className="testBlur2">
        <div className="spacer" />
        <SimpleForm
          className="input1"
          field="Your Name"
          onHandleChange={handleNameChange}
        />
        <br></br>
        <SimpleForm
          className="input1"
          field="Email Address"
          onHandleChange={handleEmailChange}
        />
        <br></br>
        <SimpleForm
          className="input1"
          field="Zip Code"
          onHandleChange={handleZipCodeChange}
        />
        <br></br>
        <br></br>
        <br></br>

        <Button
          // onClick={createGame}
          className="landing"
          destination="/collections"
        >
          Create New Game
        </Button>
        <div className="middleText">OR</div>
        <SimpleForm
          className="input1"
          field="Enter Game Code"
          onHandleChange={handleCodeChange}
        />
        <br></br>
        <Button
          // onClick={joinGame}
          className="landing"
          destination="/collections"
        >
          Join Game
        </Button>
      </div>
    </div>
  );
}

export default Landing;
