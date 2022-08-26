import React, {useState, useContext, useEffect} from 'react'
import ReactCodeInput from "react-code-input";
import "../Styles/Confirmation.css";
import {LandingContext} from "../App";
import {useHistory} from "react-router-dom";
import axios from "axios";
import * as ReactBootStrap from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
//import {setTimeout} from "timers/promises";


export default function Confirmation({ client }){
    const { userData, setUserData, cookies, setCookie } = useContext(LandingContext);
    const [temp, setTemp] = useState("");
    const [input, setInput] = useState("");
    const [correct, setCorrect] = useState(true);
    const  [loading, setLoading] = useState(false)
    const history = useHistory();


    const joinGameURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/joinGame"
    const checkEmailCodeURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/checkEmailValidationCode";

    // Load Cookies
    console.log("Landing Cookies", cookies)

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


        getCookies(["host", "roundNumber", "name", "email", "zipCode", "alias", "playerUID"])
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
            if(instantUpdate[propName] !== undefined) {
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

    
    async function afterIncorrectCode() {
        setCorrect(false);
        setTimeout(() => {  setCorrect(true) }, 1500);
    }
    

    // Validates email against database
    async function emailValidation() {
        setInput(temp);
        
        // Check email validation code
        const payload = {
                user_uid: userData.playerUID,
                code: temp
        };
        
        await axios.post(checkEmailCodeURL, payload).then((res) => {
            console.log("POST Check Email Validation Code", res);

            // If email code valid, host transtitions to rounds, guest joins game and transitions to waiting
            if (res.data.email_validated_status==="TRUE") {
                if(userData.host) {
                    history.push("/rounds")
                   
                    
                } else {
                    console.log('gameCode', userData.code)

                    //  POST joinGame to join created game using host's ID, then transition to waiting room
                    let payload = {
                        game_code: userData.code,
                        user_uid: userData.playerUID
                    }

                    axios.post(joinGameURL, payload).then((res) => {
                        console.log("POST joinGame", res)
                        setLoading(true)
                        const channel = client.channels.get(`Captions/Waiting/${userData.code}`);
                        channel.publish({data: {newPlayerName: userData.alias}});
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
            
            

        </div>
    )
}