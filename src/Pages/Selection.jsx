import React, { useState } from "react";
import Pic from "../Assets/sd.jpg";
import { Row, Col, Card } from "reactstrap";
import "../Styles/Scoreboard.css";
import Report from "../Components/Report";
import { Button } from "../Components/Button";
import background from "../Assets/temp.png";



function Scoreboard(props) {
  const title = props.title;
  // const bestCaption = "Two dudes watching the Sharknado trailer";

  const [toggle1, setToggle1] = useState(false);
  const [toggle2, setToggle2] = useState(false);
  const [toggle3, setToggle3] = useState(false);

  function changeToggle1(){
    setToggle1(true);
    setToggle2(false);
    setToggle3(false);
  }

  function changeToggle2(){
    setToggle1(false);
    setToggle2(true);
    setToggle3(false);
  }

  function changeToggle3(){
    setToggle1(false);
    setToggle2(false);
    setToggle3(true);
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
      {/* <h1>{title}</h1> */}
      <h1>Name of Deck</h1>
      <br></br>

      <h4 classname="row">Pick Your Favorite Caption</h4>
      <br></br>
      {/*<img className="img2" src={Pic} />*/}
      <img  style = {{
        objectFit: "cover",
        height: "325px",
        width: "325px",
        borderRadius: "50px",
      }} src={Pic}/>

      <br></br>
      <br></br>

      <Button
        isSelected={toggle1}
        className="selectionBtn1"

        children="Shrek and Donkey"
        destination="/selection"
        onClick={changeToggle1}
        conditionalLink={true}
      />
      <br></br>
      <Button
          // isSelected={toggle2}
          className="selectionBtn2"

          children="Shrek and Donkey"
          destination="/selection"
          // onClick={changeToggle2}
          conditionalLink={true}
      />
      <br></br>
      <Button
          isSelected={toggle3}
          className="selectionBtn1"

          children="Shrek and Donkey"
          destination="/selection"
          onClick={changeToggle3}
          conditionalLink={true}
      />
      <br></br>
      <Button className="fat" destination="/scoreboard" children="Vote" conditionalLink={true} />
    </div>
  );
}

export default Scoreboard;
