import React, { useState } from "react";
import SimpleForm from "../Components/SimpleForm";
import Background from "../Assets/sd.jpg";
// import "./Landing.css";

function Landing() {
  const [code, setCode] = useState("");

  var sectionStyle = {
    width: "100%",
    height: "400px",
    backgroundImage: "url(" + { Background } + ")",
  };

  const existingCode = (codeInput) => {
    setCode(codeInput);
  };

  const newCode = (codeInput) => {
    setCode(codeInput);
  };

  return (
    <div
      style={{
        maxWidth: "1000px",
        height: "1080px",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1557683325-3ba8f0df79de?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTZ8fHxlbnwwfHx8fA%3D%3D&w=1000&q=80')",
      }}
    >
      <br></br>
      <h1>Captionary</h1>
      <br></br>
      <SimpleForm field="Enter Game Code" onHandleChange={existingCode} />
      <br></br>
      <SimpleForm field="Create New Game" onHandleChange={newCode} />
    </div>
  );
}

export default Landing;
