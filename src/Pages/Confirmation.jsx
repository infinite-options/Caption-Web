
import React, {useState, useContext} from 'react'
import ReactCodeInput from "react-code-input";
import "../Styles/Confirmation.css";
import {LandingContext} from "../App";
import {useHistory} from "react-router-dom";
import axios from "axios";
//import {setTimeout} from "timers/promises";

export default function Confirmation({setCode, setName, setAlias, setEmail, setZipCode, setGameUID, setHost, setPlayerUID, client, channel, setRoundNumber, setRounds}){
    const [temp, setTemp]=useState("");
    const {code, name, alias, email, zipCode, host, playerUID} = useContext(LandingContext);
    const [input, setInput]=useState("");
    const [correct, setCorrect] = useState(true);
    const history = useHistory();

    
    async function afterIncorrectCode() {
        setCorrect(false);
        setTimeout(() => {  console.log("Correct State: " + correct); }, 2000);
    }
    
    async function actualHandling() {
        setInput(temp);
        
        const postURL =
                "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/checkEmailValidationCode";
        const payload = {
                user_uid: playerUID,
                code: temp
        };
        
        await axios.post(postURL, payload).then((res) => {
            console.log("POST Check Email Validation Code", res);
            console.log(temp + " " + email);
            if (res.data.email_validated_status==="TRUE") {
                console.log("email is verified")                
                history.push('/waiting');
            }
            else {
                afterIncorrectCode();
                
            }
        });
    }
    
    const handleValueInput = (e) => {
       actualHandling();
      };


        return (
            <div class = "header">
                <h1>Confirmation Page</h1>
                <h5>Please enter the code you got in the Email</h5>
                
                <h3 class="try">{(!correct) ? "Try Again" : null}</h3>
                
                <div>
                    <ReactCodeInput type='text' fields={3}  onChange={(e) => setTemp(e)}/>
                </div>

                <button
                    onClick = {e=>handleValueInput(temp)}
                >
                    Submit
                </button>
               
                

            </div>
        );
}