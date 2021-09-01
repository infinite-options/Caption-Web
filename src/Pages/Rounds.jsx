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
    const {code, rounds, roundDuration} = useContext(LandingContext);


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

    const pub = ()=> {
        console.log('sending players to start game');
        console.log("Log 1.5: Finish Posting");
        channel.publish({data: {gameStarted: true}});
        history.push("/page");
    };

    function postRoundInfo() {

        const payload = {
            number_of_rounds: rounds.toString(),
            game_code: code,
            round_duration: roundDuration,
            
        };
        console.log("pauload: ", payload);

        const postURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/changeRoundsAndDuration";
        async function postedPub() {
            await axios.post(postURL, payload).then((res) => {
                console.log(res);
            })
            console.log("Log 1: Finish Posting");
            pub();
            
        }
        postedPub();
  
    }



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
                // value="10"
                onHandleChange={handleRoundsChange}
            />
            {/* <form onHandleChange={handleRoundsChange} className="input1 grey" >
                <label for="number10">number10</label><br />
                <input type ="text" id="number10" name="number10" value="10" /><br />
            </form>
            <form onHandleChange={handleRoundsDurationChange} className="input1 grey" >
                <label for="number30">number30</label><br />
                <input type ="text" id="number30" name="number30" value="30" /><br />
            </form> */}
            <h5>This means how many images would you like to go through during your game. <br></br> (1 image = 1 round)
            </h5>

            <br></br>

            <h4>Time for each round (seconds)</h4>
            <Form
                className="input1 grey"
                field="30"
                // value="30"
                onHandleChange={handleRoundsDurationChange}
            />
            <h5>This defines how many seconds you would like to give everyone to caption an image. <br></br> We
                recommend 30 seconds!</h5>

            <br></br>

            <Button className="landing" conditionalLink={true} onClick={postRoundInfo}
                    children="Start Playing"/>

        </div>
    )
}
