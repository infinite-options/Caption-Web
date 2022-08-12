
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

    console.log('client at the top', client)

    
    async function afterIncorrectCode() {
        setCorrect(false);
        setTimeout(() => {  console.log("Correct State: " + correct); }, 2000);
        setTimeout(() => {  setCorrect(true); }, 1500);
    }
    

    // Validates email against database
    async function emailValidation() {
        setInput(temp);
        

        // Check email validation code in 
        const postURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/checkEmailValidationCode";
        const payload = {
                user_uid: playerUID,
                code: temp
        };
        
        await axios.post(postURL, payload).then((res) => {
            console.log("POST Check Email Validation Code", res);
            console.log(temp + " " + email);
            console.log('email validated: ', res.data.email_validated_status)
            console.log('code: ', code)
            console.log('client 1', client)

            if (res.data.email_validated_status==="TRUE") {
                console.log("email is verified")  
                console.log('client 2', client)

                // Same logic as Landing, call /createUser and check if email validated
                console.log('In createGuestUser')
                const postURL1 = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/createUser";
                const payload1 = {
                                "user_name" : name,
                                "user_alias" : alias,
                                "user_email": email,
                                "user_zip" : zipCode
                            }
                console.log("in create user" + postURL1 + "    " + payload1);
                
                console.log("prior to create user axios call");
                axios.post(postURL1, payload1).then((res) => {
                    console.log("POST Create User ",res);

                    // If email validated, publish new player to ably so host can refresh player list
                    if(res.data.email_validated==="TRUE") {
                        console.log("user exists and Email validated")
                        console.log('client 3', client)
                        console.log("Confirmation: publishing new player to ably");

                        const channel = client.channels.get(`Captions/Waiting/${code}`);
                        channel.publish({data: {newPlayerName: alias}});
                        history.push('/waiting');
                    }
                    else {
                        console.log('user email not validated', res.data.email_validated)
                        // history.push('/confirmation');
                    }
                    setPlayerUID(res.data.user_uid);//mickye change
                    })
                history.push('/waiting');
            }
            else {
                afterIncorrectCode();
                
            }
        });
    }
    
    const handleValueInput = (e) => {
       emailValidation();
      };


        return (
            <div class = "header">
                <h1>Confirmation Page</h1>
                <h5>Please enter the code that was sent to {email}</h5>
                
                <h3 class="try">{(!correct) ? "Invalid Code. Try Again" : null}</h3>
                
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