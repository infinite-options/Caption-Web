import React, { useState } from "react";
import SimpleForm from "../Components/SimpleForm";
import Background from "../Assets/sd.jpg";
import { Button } from "../Components/Button.jsx";
import background from "../Assets/landing.png";
// import "./Landing.css";

function Landing() {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");

  var sectionStyle = {
    width: "100%",
    height: "400px",
    backgroundImage: "url(" + { Background } + ")",
  };

  const handleCodeChange = (codeInput) => {
    setCode(codeInput);
  };

  const handleNameChange = (codeInput) => {
    setCode(codeInput);
  };

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
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      {/* <h1
        style={{
          color: "Black",
        }}
      >
        Captionary
      </h1> */}
      <br></br>
      <SimpleForm
        className="input1"
        field="Enter Game Code"
        onHandleChange={handleCodeChange}
      />
      <br></br>
      <SimpleForm
        className="input1"
        field="Your Name"
        onHandleChange={handleNameChange}
      />
      <br></br>
      <Button className="landing1" destination="/collections">
        Enter
      </Button>
      <br></br>
      <br></br>
      <Button className="landing2" destination="/collections">
        Create New Game
      </Button>
    </div>
  );
}

export default Landing;
