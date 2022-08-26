import React, {useContext, useEffect, useState, useRef} from 'react'
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
import {Link} from "react-router-dom";

export default function Rounds({ channel }) {
    const history = useHistory();
    const { userData, setUserData, cookies, setCookie} = useContext(LandingContext);

    console.log("Rounds Cookies", cookies)

    // Load cookies into userData state on first render
    useEffect(() => {
        const getCookies = (propsToLoad) => {
            let localCookies = cookies.userData
            let cookieLoad = {}

            for(let i = 0; i < propsToLoad.length; i++) {
                let propName = propsToLoad[i]
                let propValue = localCookies[propName]
                cookieLoad[propName] = propValue
            }

            console.log("cookieLoad", cookieLoad)

            let newUserData = {
                ...userData,
                ...cookieLoad
            }

            console.log("newUserData", newUserData)
            setUserData(newUserData)
        }

        getCookies(["host", "roundNumber", "name", "alias", "email", "zipCode", "playerUID"])
    }, [])


    // Sets cookies for state variables in propsToPut array.
    // If updating state right before calling putCookies(), call putCookies(["stateName"], {"stateName": "stateValue"}) with a literal
    // state value to update cookie correctly.
    const putCookies = (propsToPut, instantUpdate) => {
        console.log("In put Cookies", propsToPut)
        let localCookies = {}
        
        if(cookies.userData === undefined) {
            setCookie("userData", {})
        } else {
            localCookies = cookies.userData
        }

        for(let i = 0; i < propsToPut.length; i++) {
            const propName = propsToPut[i]

            // State has not updated, referecnce instantUpdate
            if(instantUpdate !== undefined && instantUpdate[propName] !== undefined) {
                localCookies[propName] = instantUpdate[propName]
            } 
            // State already updated, reference userData
            else {
                localCookies[propName] = userData[propName]
            }
        }

        //console.log("local cookies end", localCookies)
        setCookie("userData", localCookies)
    }



    // Needs integer typecheck
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

    // Needs integer typecheck
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


    function handleSubmit() {
        putCookies(["rounds", "roundDuration"])
        history.push("/scoretype")
    }


    return (
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
                    children=' Game Rule'
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
                // destination="/scoretype"
                children="Continue"
                onClick={() => handleSubmit()}
            />


        </div>
    )
}
