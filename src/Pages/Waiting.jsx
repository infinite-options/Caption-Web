import React, {useContext, useEffect, useState} from 'react'
import axios from "axios";
import circle from "../Assets/circle.png";
import thing from "../Assets/idk.png";
import {Button} from '../Components/Button';
import "../Styles/Waiting.css";
import {Row, Col, Card} from "reactstrap";
import Deck from "../Components/Deck";
import {LandingContext} from "../App";

export default function Waiting() {

    const {code} = useContext(LandingContext);

    let gameCodeText = "Game Code: " + code;

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
            }}
        >

            <img className="innerImage1" src={circle}/>
            <img className="innerImage2" src={thing}/>

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
                            <Col> <Button className="circle"/></Col>
                            <Col>{item}</Col>
                        </Row>
                    </li>
                ))}
            </ul>

            <Button
                className="cardStyle"
                children={gameCodeText}
            />
            <br></br>

            <Button
                className="landing"
                children="Share with other players"
            />

            <br></br>

            <Button
                className="landing"
                children="Start Game"
            />

        </div>
    )
}
