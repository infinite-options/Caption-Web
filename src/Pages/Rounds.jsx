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
import {useHistory} from "react-router-dom";
import validator from 'validator';

export default function Rounds({setRounds, setRoundDuration, channel }) {
    const history = useHistory();
    const {code, rounds, roundDuration, host, setImageURL, roundNumber, alias} = useContext(LandingContext);
    const [error, setError] = useState("")

    // Needs integer typecheck
    const handleRoundsChange = (roundsInput) => {
        let num = Number(roundsInput);
         if(validator.isFloat(roundsInput)&&(validator.isInt(roundsInput)===false)){
             num = validator.toInt(roundsInput);
         }
         if(validator.isInt(roundsInput)||num >0){
             setRounds(num);
         }
         else if (Number.isNaN(num)){
             alert('please put integer');
         }
    };

    // Needs integer typecheck
    const handleRoundsDurationChange = (durationInput) => {
        let num = Number(durationInput);
         if(validator.isFloat(durationInput)&&(validator.isInt(durationInput)===false)){
             num = validator.toInt(durationInput);
         }
         if(validator.isInt(durationInput)||num>0){
             console.log((num));
             setRoundDuration(num);
         }
         else if (Number.isNaN(num)){
             alert('please put integer');
         }
    };



    return (
        <div style={{
                maxWidth: "375px",
                height: "812px",
        }}>

            <img className="innerImage1" src={circle}/>
            <img className="innerImage2" src={thing}/>

            <div className="spacer"/>

            <h4> Enter the number of rounds and time for each round</h4>

            <br></br>

            <h4>Number of Rounds</h4>

            <Form
                className="input1 grey"
                field="10"
                onHandleChange={handleRoundsChange}
            />
            
            <h5>This means how many images would you like to go through during your game. <br></br> (1 image = 1 round) </h5>

            <br></br>

            <h4>Time for each round (seconds)</h4>

            <Form
                className="input1 grey"
                field="30"
                onHandleChange={handleRoundsDurationChange}
            />
            
            <h5>This defines how many seconds you would like to give everyone to caption an image. <br></br> We
                recommend 30 seconds!</h5>

            <br></br>

            <Button className="landing" conditionalLink={true} destination="/scoretype"
                    children="Continue"/>


        </div>
    )
}
