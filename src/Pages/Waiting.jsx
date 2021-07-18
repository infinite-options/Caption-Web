import React from 'react'

import circle from "../Assets/circle.png";
import thing from "../Assets/idk.png";
import { Button } from '../Components/Button';
import "../Styles/Waiting.css";
import { Row, Col, Card } from "reactstrap";
import Deck from "../Components/Deck";

export default function Waiting() {

  const names = [
    "Mike",
    "Ron", 
    "Emma", 
    "Flo", 
    "Lola",
];


    return (
        <div
        style={{
          maxWidth: "375px",
          height: "812px",
          //As long as I import the image from my package strcuture, I can use them like so
          // backgroundImage: `url(${background})`
          // backgroundImage:
          //   "url('https://images.unsplash.com/photo-1557683325-3ba8f0df79de?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTZ8fHxlbnwwfHx8fA%3D%3D&w=1000&q=80')",
        }}
      >

        <img className="innerImage1" src={circle} />
        <img className="innerImage2" src={thing} />

        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>

            {/* <div className = "spacer"/> */}
        
        <h4>Waiting for all players to join</h4>


            <ul className="flex-container">
        {names.map((item) => (
            <li className="flex-item">
                <Row>
                <Col>  <Button className="circle"/></Col>
                <Col>{item}</Col>
                </Row>
            </li>
        ))}
            </ul>

        <Button
          className="cardStyle"
          children = "Game Code: CYTHLI "
        />
      <br></br>

        <Button
          className="landing"
          children = "Share with other players"
        />

       <br></br>

        <Button
          className="landing"
          children = "Start Game"
        />
        
      </div>
    )
}
