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
    const [emailExistance, setEmailExistance] = useState(false);

    useState(() => setRoundNumber(1), []);

    const handleCodeChange = (codeInput) => {
        setCode(codeInput);
    };

    const handleNameChange = (nameInput) => {
        setName(nameInput);
    };

    const handleEmailChange = (emailInput) => {
        setEmail(emailInput);
    };

    const handleZipCodeChange = (zipCodeInput) => {
        setZipCode(zipCodeInput);
    };

    const handleAliasChange = (aliasInput) => {
        setAlias(aliasInput);
    };

    function validateInputToCreateGame() {
        return (
            // name !== "" && email !== "" && zipCode !== "" && 
            alias !== "");
    }

    console.log("email: " , email);

    function validateInputToJoinGame() {
        return (code !== "" && validateInputToCreateGame());
    }

    function emailExists() {
        var isThere = false;
        const postURL =
                "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/checkEmailValidated";
        const payload = {
                name: name,
                email: email,
                phone_no: "4089119300",
                message: "wassup"
        };
        axios.post(postURL, payload).then((res) => {
            console.log(res);
            console.log(res.data.message);
            if (res.data.message==="User has already been verified.") {
                console.log("reached user verified")
                isThere = true;
                return true;
                }
            else {
                return false;
            }
            })
        return isThere;
        
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



            //creating new game
            var postURL =
                    "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/createNewGame";
    
            var payload = {
                            user_name: name,
                            user_alias: alias,
                            user_email: email,
                            user_zip: zipCode,
                            //game_code: code,
                        };
    
            axios.post(postURL, payload).then((res) => {
                            console.log(res);
                            setCode(res.data.game_code);
                            setGameUID(res.data.game_uid);
                            //setPlayerUID(res.data.user_uid);
                        });



            //checking user
            postURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/createUser";
            payload = {
                "user_name" : name,
                "user_alias" :alias,
                "user_email": email,
                "user_zip" : zipCode
            }

            axios.post(postURL, payload).then((res) => {
                console.log(res);

            
                //if user exists
                if(res.data.email_validated==="TRUE") {
                    console.log("user exists and Email validated")
                    history.push('/waiting');
                }
                else {
                    //setPlayerUID(res.data.user_uid);
                    history.push('/confirmation');
                }
                setPlayerUID(res.data.user_uid);
            });
        }
        else {
            window.alert("To create a game, fill out the necessary information");
        }

    }

    // const pub = (game_code) => {
    //     console.log("Made it to Pub");
    //     const channel = client.channels.get(`Captions/Waiting/${game_code}`);
    //     channel.publish({data: {newPlayerName: alias}});
    // };

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
            console.log(postURL);
            console.log(payload);
            console.log("prior to join game axios call");
            await axios.post(postURL, payload).then((res) => {
                console.log(res);
                
                setGameUID(res.data.game_uid);
                setPlayerUID(res.data.user_uid);
                // pub(code);
                try {  
                    console.log(res.data.warning);
                    if (res.data.warning==="Invalid game code."||res.data.message==="Join Game Request failed") {
                        console.log("Looks like an invalid game code. Time to send you to the error screen");

                        window.location.href = "/error";
                    } else {
                        console.log("Else within try clause: No error message. Game on!");
                        setGameUID(res.data.game_uid);
                        // const postURL1 = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/createUser";
                        // const payload1 = {
                        //     "user_name" : name,
                        //     "user_alias" :alias,
                        //     "user_email": email,
                        //     "user_zip" : zipCode
                        // }
                        // console.log("in create user" + postURL1 + "    " + payload1);
                        // console.log(postURL);
                        // console.log(payload);
                        // console.log(postURL1);
                        // console.log(payload1);
                        // console.log("prior to create user axios call");
                        // axios.post(postURL1, payload1).then((res) => {
                        //     console.log(res);
                        //     if(res.data.email_validated==="TRUE") {
                        //         console.log("user exists and Email validated")
                        //         history.push('/waiting');
                        //     }
                        //     else {
                        //         setPlayerUID(res.data.user_uid);
                        //         history.push('/confirmation');
                        //     }
                            
                        //     // pub(code);
                        // })
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
            console.log(postURL);
            console.log(payload);
            console.log(postURL1);
            console.log(payload1);
            console.log("prior to create user axios call");
            await axios.post(postURL1, payload1).then((res) => {
                            console.log(res);
                            if(res.data.email_validated==="TRUE") {
                                console.log("user exists and Email validated")
                                history.push('/waiting');
                            }
                            else {
                                //setPlayerUID(res.data.user_uid);
                                history.push('/confirmation');
                            }
                setPlayerUID(res.data.user_uid);//mickye change
                            
                            // pub(code);
            })

            
            
            // console.log("path: ", path);

            

            

            

        } else {
            window.alert("To join a game, fill out the necessary information and the correct gamecode.");
        }

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
    

    useEffect(() => {
        // async function subscribe(){
            
        //     await channel.subscribe(something => {
        //         if (something.data.alias === alias) {
        //             console.log('something.data = ', something.data);
        //             setRoundNumber(something.data.roundNumber);
        //             console.log("made it to subscribe");
        //             history.push(something.data.path);
        //         }
        //     })
        // }
        // subscribe();
        // console.log("code: ", code);
        // console.log("alias", alias);
        // return function cleanup(){
        //     channel.unsubscribe();
        // }
    }, [code]);

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
                onHandleChange={handleNameChange}
                type="text"
            />
            <br></br>
            <Form
                className="input1"
                field="Email Address"
                onHandleChange={handleEmailChange}
            />

            <br></br>
            <Form
                className="input1"
                field="Zip Code"
                onHandleChange={handleZipCodeChange}
            />
            <br></br>
            <Form
                className="input1"
                field="Alias (screen name)"
                onHandleChange={handleAliasChange}
            />
            <br></br>
            <br></br>

            <Button
                isSelected={true}
                onClick={createGame}
                className="landing"
                //destination={emailExistance ? "/waiting" : "/confirmation"}
                children="Create New Game"
                conditionalLink={validateInputToCreateGame() && validateEmail(email) && validateZipcode(zipCode)}
                destination={"/waiting"}
            />
            <div className="middleText">OR</div>
            <Form
                className="input1"
                field="Enter Game Code"
                onHandleChange={handleCodeChange}
            />
            <br></br>
            <Button
                isSelected={true}
                // onClick={()=> pub(code)}
                onClick={joinGame}
                className="landing"
                // destination="/waiting"
                children="Join Game"
                // conditionalLink={validateInputToJoinGame()}
            />

        </div>
    );
}


