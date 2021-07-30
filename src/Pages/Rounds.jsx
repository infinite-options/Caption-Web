import React, {useContext, useEffect, useState} from 'react'
import axios from "axios";
import circle from "../Assets/circle.png";
import thing from "../Assets/idk.png";
import {Button} from '../Components/Button';
import "../Styles/Waiting.css";
import {Row, Col, Card} from "reactstrap";
import Deck from "../Components/Deck";
import {LandingContext} from "../App";
import Form from "../Components/Form";



export default function Rounds() {

    const {setRounds, setRoundDuration} = useContext(LandingContext);


    {/*Need some way to check that the input is an integer*/}
    const handleRoundsChange = (roundsInput) => {
        setRounds(roundsInput);
    };

    {/*Need some way to check that the input is an integer*/}
    const handleRoundsDurationChange = (durationInput) => {
        setRoundDuration(durationInput);
    };


    return (
        <div
            style={{
                maxWidth: "375px",
                height: "812px",
            }}
        >

            <img className="innerImage1" src={circle}/>
            <img className="innerImage2" src={thing}/>

            <div className ="spacer"/>


            <h4> Enter the number of rounds and time for each round</h4>

            <br></br>

            <h4>Number of Rounds</h4>
            <Form
                className="input1"
                field="10"
                onHandleChange={handleRoundsChange}
            />
            <h5>This means how many images would you like to go through during your game. <br></br> (1 image = 1 round)</h5>

            <br></br>

            <h4>Time for each round (seconds)</h4>
            <Form
                className="input1"
                field="30"
                onHandleChange={handleRoundsDurationChange}
            />
            <h5>This defines how many seconds you would like to give everyone to caption an image. <br></br> We recommend 30 seconds!</h5>

            <br></br>

            <Button className="landing" children = "Start Playing" conditionalLink={true}/>

        </div>
    )
}

// export function joinGame() {
//
//     const {code, name, alias, email, zipCode} = useContext(LandingContext);
//
//
//     if (name !== "" && email !== "" && zipCode !== "") {
//         const getURL =
//             "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/checkGame";
//
//         axios.get(getURL + "/" + code).then((res) => {
//             console.log(res);
//         })
//
//     } else {
//         window.alert("To join a game, fill out the necessary information and the correct gamecode.");
//     }
// }