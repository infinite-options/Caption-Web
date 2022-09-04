import React, {useContext, useEffect, useState} from 'react'
import circle from "../Assets/circle.png";
import thing from "../Assets/idk.png";
import {Button} from '../Components/Button';
import "../Styles/Waiting.css";
import {LandingContext} from "../App";
import Form from "../Components/Form";
import {useHistory} from "react-router-dom";
import {Link} from "react-router-dom";
import * as ReactBootStrap from 'react-bootstrap';
import validator from 'validator';
import {CookieHelper} from "../Components/CookieHelper"


export default function Rounds() {
    const { userData, setUserData, cookies, setCookie } = useContext(LandingContext);
    const { getCookies } = CookieHelper()
    const history = useHistory();

    // Determine if we should display landing page (true) or loading icon (false)
    const [displayHtml, setDisplayHtml] = useState(false)


    // HOOK: useEffect()
    // DESCRIPTION: On first render, check if hooks are updated, load data from cookies if not
    useEffect(() => {
        // Check if userData is empty (after refresh/new user)
        if(userData.host === "" || userData.playerUID === "") {
            getCookies(["host", "playerUID"], setDisplayHtml)
        }
        else
            setDisplayHtml(true)
    }, [])


    // FUNCTION: handleRoundsChange()
    // DESCRIPTION: Actively sets/checks validity of rounds input
    const handleRoundsChange = (roundsInput) => {
        let num = Number(roundsInput);
         if(validator.isFloat(roundsInput)&&(validator.isInt(roundsInput)===false)){
             num = validator.toInt(roundsInput);
         }
         if(validator.isInt(roundsInput)||num > 0){
            console.log("set rounds")
            setUserData({
                ...userData, 
                rounds: num,
            })
         }
         else if (Number.isNaN(num)){
             alert('Round must be an integer');
         }
    };


    // FUNCTION: handleDurationChange()
    // DESCRIPTION: Actively sets/checks validity of rounds input
    const handleRoundsDurationChange = (durationInput) => {
        let num = Number(durationInput);
         if(validator.isFloat(durationInput)&&(validator.isInt(durationInput)===false)){
            console.log("first")
            num = validator.toInt(durationInput);
         }
         if(validator.isInt(durationInput)||num>0){
             console.log("setDuration");
             setUserData({
                ...userData, 
                roundDuration: num,
            })
         }
         else if (Number.isNaN(num)){
             alert('Round duration must be an integer');
         }
    };


    // FUNCTION: handleSubmit()
    // DESCRIPTION: On clicking "continue", save cookies and transition to scoretype
    function handleSubmit() {
        setCookie("userData", {
            ...cookies.userData,
            "rounds": userData.rounds,
            "roundDuration": userData.roundDuration
        })

        history.push("/scoretype")
    }


    return (
        displayHtml ?
            // Rounds page HTML
            <div 
                style={{
                    maxWidth: "375px",
                    height: "812px",
                    }}
            >
                <img 
                    className="innerImage1" 
                    src={circle}
                />
                <img 
                    className="innerImage2" 
                    src={thing}
                />

                <div className="spacer"/>

                <Link to="/gamerules">
                    <i
                        style={{
                            position: "absolute",
                            top: "150px",
                            left: "30px",
                            paddingBottom:'20px',
                            color: "blue",
                        }}
                        className="fas fa-info-circle"
                        children=' Game Rules'
                    />
                </Link>

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

                <Button 
                    className="landing" 
                    conditionalLink={true} 
                    children="Continue"
                    onClick={() => handleSubmit()}
                />
            </div> :
            // Loading icon HTML
            <div>
                <h1>Loading game data...</h1>
                <ReactBootStrap.Spinner animation="border" role="status"/>
            </div>
    )
}
