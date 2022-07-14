import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import Form from "../Components/Form";
import {Button} from "../Components/Button.jsx";
import background from "../Assets/landing.png";
import "../Styles/Landing.css";
import {LandingContext} from "../App";
import {useHistory} from "react-router-dom";

export default function Landing({setCode, setName, setAlias, setEmail, setZipCode, setGameUID, setHost, setPlayerUID, client, channel, setRoundNumber, setRounds, setConfirmationCode}) {
    
    const history = useHistory();

    const {code, name, alias, email, zipCode, host, roundNumber, confirmationCode, playerUID} = useContext(LandingContext);
    const [path, setPath] = useState('');
    useState(() => setRoundNumber(1), []);

    console.log("email: " , email);


    // VALIDATION FUNCTIONS

    function validateInputToCreateGame() {
        return alias !== ""
    }

    function validateInputToJoinGame() {
        return (code !== "" && validateInputToCreateGame());
    }

    function validateEmail(email) {
        const re = /[\w\d]{1,}@[\w\d]{1,}.[\w\d]{1,}/;
        // /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function validateZipcode(zipCode) {
        const reZ = /^\d{5}$/ ;
        return reZ.test(zipCode);
    }



    async function createGame() {
        const valid = validateEmail(email);
        const validZ = validateZipcode(zipCode);
        if (!valid) {
            alert('Invalid email. Please re-enter.');
            return;
        }
        if(!validZ){
            alert("Invalid Zipcode. Please enter a 5 digit zipcode.")
            return;
        }
        setHost(true);
         
        if(validateInputToCreateGame()) {
            // Creating new game
            var postURL =
                    "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/createNewGame";
    
            var payload = {
                            user_name: name,
                            user_alias: alias,
                            user_email: email,
                            user_zip: zipCode,
                        };
    
            axios.post(postURL, payload).then((res) => {
                            console.log("POST Create New Game", res);
                            setCode(res.data.game_code);
                            setGameUID(res.data.game_uid);
                        });



            // Checking user
            postURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/createUser";
            payload = {
                "user_name" : name,
                "user_alias" :alias,
                "user_email": email,
                "user_zip" : zipCode
            }

            axios.post(postURL, payload).then((res) => {
                console.log("POST Create New User", res);

                // if user exists, go to waiting
                // else, go to confirmation page
                if(res.data.email_validated==="TRUE") {
                    console.log("user exists and Email validated")
                    history.push('/waiting');
                }
                else {
                    history.push('/confirmation');
                }
                setPlayerUID(res.data.user_uid);
            });
        }
        else {
            window.alert("To create a game, fill out the necessary information");
        }

    }


    async function joinGame() {
        console.log("Made it in Path:", path);
        const valid = validateEmail(email);
        if (!valid) {
            alert('Invalid email. Please re-enter.');
            return;
        }

        const validZ = validateZipcode(zipCode);
        if(!validZ){
            alert("Invalid Zipcode. Please enter a 5 digit zipcode.")
            return;
        }
        if (validateInputToJoinGame()) {
            setHost(false);

            var postURL =
                "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/joinGame";
            var payload = {
                user_name: name,
                user_alias: alias,
                user_email: email,
                user_zip: zipCode,
                game_code: code,
            };
            
            await axios.post(postURL, payload).then((res) => {
                console.log("POST Join Game", res);
                
                setGameUID(res.data.game_uid);
                setPlayerUID(res.data.user_uid);
                try {  
                    console.log(res.data.warning);
                    if (res.data.warning==="Invalid game code."||res.data.message==="Join Game Request failed") {
                        console.log("Looks like an invalid game code. Time to send you to the error screen");

                        window.location.href = "/error";
                    } else {
                        console.log("Else within try clause: No error message. Game on!");
                        setGameUID(res.data.game_uid);
                    }
                } catch {
                    console.log("Catch Clause: No error message. Game on!");
                }
            });


            const postURL1 = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/createUser";
            const payload1 = {
                            "user_name" : name,
                            "user_alias" :alias,
                            "user_email": email,
                            "user_zip" : zipCode
                        }
            console.log("in create user" + postURL1 + "    " + payload1);
           
            console.log("prior to create user axios call");
            await axios.post(postURL1, payload1).then((res) => {
                console.log("POST Create User ",res);
                if(res.data.email_validated==="TRUE") {
                    console.log("user exists and Email validated")
                    history.push('/waiting');
                }
                else {
                    history.push('/confirmation');
                }
                setPlayerUID(res.data.user_uid);//mickye change
            })
        } else {
            window.alert("To join a game, fill out the necessary information and the correct gamecode.");
        }

    }


    useEffect(() => console.log('landing roundNumber = ', roundNumber), [roundNumber]);

    return (
        <div
            style={{
                maxWidth: "375px",
                height: "812px",
                backgroundImage: `url(${background})`,
            }}
        >
            <div className="spacer"/>

            <Form
                className="input1"
                field="Your Name"
                onHandleChange={nameInput => setName(nameInput)}
                type="text"
            />
            <br></br>
            <Form
                className="input1"
                field="Email Address"
                onHandleChange={emailInput => setEmail(emailInput)}
            />

            <br></br>
            <Form
                className="input1"
                field="Zip Code"
                onHandleChange={zipCodeInput => setZipCode(zipCodeInput)}
            />
            <br></br>
            <Form
                className="input1"
                field="Alias (screen name)"
                onHandleChange={aliasInput => setAlias(aliasInput)}
            />
            <br></br>
            <br></br>

            <Button
                isSelected={true}
                onClick={createGame}
                className="landing"
                children="Create New Game"
                conditionalLink={validateInputToCreateGame() && validateEmail(email) && validateZipcode(zipCode)}
                destination={"/waiting"}
            />
            <div className="middleText">OR</div>
            <Form
                className="input1"
                field="Enter Game Code"
                onHandleChange={codeInput => setCode(codeInput)}
            />
            <br></br>
            <Button
                isSelected={true}
                onClick={joinGame}
                className="landing"
                children="Join Game"
            />

        </div>
    );
}


