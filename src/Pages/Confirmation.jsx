import React, {useState, useContext, useEffect} from 'react'
import ReactCodeInput from "react-code-input";
import "../Styles/Confirmation.css";
import {LandingContext} from "../App";
import {useHistory} from "react-router-dom";
import axios from "axios";
import * as ReactBootStrap from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import {CookieHelper} from "../Components/CookieHelper"


export default function Confirmation({ client }){
    const { userData } = useContext(LandingContext);
    const { getCookies } = CookieHelper()
    const [temp, setTemp] = useState("");
    const [correct, setCorrect] = useState(true);
    const history = useHistory();

    // Determine if we should display landing page (true) or loading icon (false)
    const [displayHtml, setDisplayHtml] = useState(false)


    // Endpoints used in confirmation
    const joinGameURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/joinGame"
    const checkEmailCodeURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/checkEmailValidationCode";


    // HOOK: useEffect()
    // DESCRIPTION: On first render, check if hooks are updated, load data from cookies if not
    useEffect(() => {
        // Check if userData is empty (after refresh/new user)
        if(userData.host === ""  || userData.email === ""  || userData.alias === "" || userData.playerUID === "") {
            getCookies(["host", "email", "alias", "playerUID"], setDisplayHtml)
        }
    }, [])

    
    async function afterIncorrectCode() {
        setCorrect(false);
        setTimeout(() => {  setCorrect(true) }, 1500);
    }
    
    // FUNCITON: emailValidation()
    // DESCRIPTION: Validates email against database
    async function emailValidation() {        
        // POST /checkEmailCode to check email validation code with database
        const payload = {
                user_uid: userData.playerUID,
                code: temp
        };
        await axios.post(checkEmailCodeURL, payload).then((res) => {
            console.log("POST Check Email Validation Code", res);

            // If email code valid, host transitions to rounds, guest joins game and transitions to waiting
            if (res.data.email_validated_status==="TRUE") {
                if(userData.host) {
                    history.push("/rounds")
                } else {
                    console.log('gameCode', userData.code)

                    // POST /joinGame to join created game using guest's player ID, then transition to waiting room
                    let payload = {
                        game_code: userData.code,
                        user_uid: userData.playerUID
                    }

                    axios.post(joinGameURL, payload).then((res) => {
                        console.log("POST joinGame", res)

                        const channel = client.channels.get(`Captions/Waiting/${userData.code}`);
                        channel.publish({data: {newPlayerName: userData.alias}});

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
        displayHtml ? 
            // Confirmation page HTML
            <div class = "header">
                <h1>Confirmation Page</h1>
                <h5>Please enter the code that was sent to {userData.email}</h5>
                
                <h3 class="try">{(!correct) ? "Invalid Code. Try Again" : null}</h3>
                
                <div>
                    <ReactCodeInput type='text' fields={3}  onChange={(e) => setTemp(e)}/>
                </div>

                <button
                    onClick = {() => emailValidation(temp)}
                >
                    Submit
                </button>
            </div> :
            // Loading icon HTML
            <div>
                <h1>Loading game data...</h1>
                <ReactBootStrap.Spinner animation="border" role="status"/>
            </div>
    )
}