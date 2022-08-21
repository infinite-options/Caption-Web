import React, {useState, useContext} from 'react'
import ReactCodeInput from "react-code-input";
import "../Styles/Confirmation.css";
import {LandingContext} from "../App";
import {useHistory} from "react-router-dom";
import axios from "axios";
import * as ReactBootStrap from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
//import {setTimeout} from "timers/promises";


export default function Confirmation({setCode, setName, setAlias, setEmail, setZipCode, setGameUID, setHost, setPlayerUID, client, channel, setRoundNumber, setRounds}){
    const {code, name, alias, email, zipCode, host, playerUID, cookies, setCookie} = useContext(LandingContext);
    const [temp, setTemp] = useState("");
    const [input, setInput] = useState("");
    const [correct, setCorrect] = useState(true);
    const  [loading, setLoading] = useState(false)
    const history = useHistory();


    const joinGameURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/joinGame"
    const checkEmailCodeURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/checkEmailValidationCode";

    // Load Cookies
    console.log("Landing Cookies", cookies)

    
    async function afterIncorrectCode() {
        setCorrect(false);
        setTimeout(() => {  setCorrect(true) }, 1500);
    }
    

    // Validates email against database
    async function emailValidation() {
        setInput(temp);
        
        // Check email validation code
        const payload = {
                user_uid: playerUID,
                code: temp
        };
        
        await axios.post(checkEmailCodeURL, payload).then((res) => {
            console.log("POST Check Email Validation Code", res);

            // If email code valid, host transtitions to rounds, guest joins game and transitions to waiting
            if (res.data.email_validated_status==="TRUE") {
                if(host) {
                    history.push("/rounds")
                   
                    
                } else {
                    console.log('gameCode', code)

                    //  POST joinGame to join created game using host's ID, then transition to waiting room
                    let payload = {
                        game_code: code,
                        user_uid: playerUID
                    }

                    axios.post(joinGameURL, payload).then((res) => {
                        console.log("POST joinGame", res)
                        setLoading(true)
                        const channel = client.channels.get(`Captions/Waiting/${code}`);
                        channel.publish({data: {newPlayerName: alias}});
                        setLoading(true)
                        history.push("/waiting")
                       
                    })
                }
            }
            else {
                afterIncorrectCode();
                
            }
        });
    }

    return (
        <div class = "header">
            <h1>Confirmation Page</h1>
            <h5>Please enter the code that was sent to {email}</h5>
            
            <h3 class="try">{(!correct) ? "Invalid Code. Try Again" : null}</h3>
            
            <div>
                <ReactCodeInput type='text' fields={3}  onChange={(e) => setTemp(e)}/>
            </div>

            <button
                onClick = {() => emailValidation(temp)}
            >
                Submit
            </button>
            
            

        </div>
    )
}