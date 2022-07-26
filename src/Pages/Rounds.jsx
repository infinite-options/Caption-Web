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


export default function Rounds({setRounds, setRoundDuration, channel }) {
    const history = useHistory();
    const {code, rounds, roundDuration, host, setImageURL, roundNumber, alias, photosFromAPI} = useContext(LandingContext);
    const [error, setError] = useState("")


    {/*Need some way to check that the input is an integer*/
    }
    const handleRoundsChange = (roundsInput) => {
        setRounds(parseInt(roundsInput));
    };

    {/*Need some way to check that the input is an integer*/
    }
    const handleRoundsDurationChange = (durationInput) => {
        setRoundDuration(durationInput);
    };


    useEffect(() => 
    console.log('Currently in Rounds', "Alias:",alias, "Current Round: ", roundNumber), 
    []);


    return (
        <div
            style={{
                maxWidth: "375px",
                height: "812px",
            }}
        >

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

            {photosFromAPI.length > 0 
                ? <h4>Max Rounds: {photosFromAPI.length}</h4>
                : "" 
            }

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
            { photosFromAPI.length > 0 && rounds > photosFromAPI.length
                ? ""
                : <Button className="landing" conditionalLink={true} destination="/scoretype"
                    children="Continue"/>
            }


        </div>
    )
}
