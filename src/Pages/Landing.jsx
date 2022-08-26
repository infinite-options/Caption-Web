import React, {useContext, useEffect, useState, useRef} from "react";
import axios from "axios";
import {useHistory} from "react-router-dom";
import "../Styles/Landing.css";
import Form from "../Components/Form";
import {Button} from "../Components/Button.jsx";
import background from "../Assets/landing.png";
import {LandingContext} from "../App";
import * as ReactBootStrap from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import {Link} from "react-router-dom";

export default function Landing({client}) {
    // const {code, name, alias, email, zipCode, host, roundNumber, confirmationCode, playerUID, setDeckSelected, setImageURL, cookies, setCookie, removeCookie} = useContext(LandingContext);

    const {userData, setUserData, cookies, setCookie, removeCookie} = useContext(LandingContext);

    const [loading, setLoading] = useState(false)

    const history = useHistory();

    const addUserURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/addUser"
    const joinGameURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/joinGame"
    const checkGameURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/checkGame"


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


        getCookies(["name", "email", "zipCode", "alias"])
        putCookies(
            [   "code",
                "gameUID",
                "rounds",
                "roundDuration",
                "host",
                "playerUID",
                "roundNumber",
                "imageURL",
                "scoreboardInfo",
                "photosFromAPI",
                "deckSelected",
                "deckTitle" ], 
            {   code: "",
                gameUID: "",
                rounds: "10",
                roundDuration: "30",
                host: "",
                playerUID: "",
                roundNumber: "",
                imageURL: "",
                scoreboardInfo: [],
                photosFromAPI: [],
                deckSelected: "",
                deckTitle: ""}
        )
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

    
    
    // Input Validation Functions
    function validateInputToCreateGame() {
        return userData["alias"] !== ""
    }

    function validateInputToJoinGame() {
        return (userData["code"] !== "" && validateInputToCreateGame());
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




    // HOST: Start create game flow
    async function createGame() {   
        console.log("Starting createGame()")

        // Validate email and zip code input
        const valid = validateEmail(userData["email"]);
        const validZ = validateZipcode(userData["zipCode"]);
        if (!valid) {
            alert('Invalid email. Please re-enter.');
            return;
        }
        if(!validZ){
            alert("Invalid Zipcode. Please enter a 5 digit zipcode.")
            return;
        }

         
        if(validateInputToCreateGame()) {
            setUserData({
                ...userData, 
                host: true,
                roundNumber: 1
            })
            

            putCookies(
                ["host", "roundNumber", "name", "alias", "email", "zipCode"], 
                {"host": true, "roundNumber": 1}
            )
            

            // POST addUser to create a new host user
            let payload = {
                user_name: userData["name"],
                user_alias: userData["alias"],
                user_email: userData["email"],
                user_zip: userData["zipCode"],
            }
    
            axios.post(addUserURL, payload).then((res) => {
                console.log("POST addUser as host", res)
                let pUID = res.data.user_uid

                setUserData({
                    ...userData, 
                    playerUID: pUID
                })

                // set Cookie for playerUID
                putCookies(
                    ["playerUID"],
                    {"playerUID": pUID}
                )
                

                // If email is validated transition to waiting room, else transition to confirmation page
                if(res.data.user_code === "TRUE") {
                    console.log("User exists and email validated. Transition to waiting.")
                    history.push("/rounds")
                } else {
                    history.push('/confirmation')
                }
            })
        } else {
            window.alert("To create a game, fill out the necessary information");
        }

    }


    // GUEST: Start join game flow
    async function joinGame() {
        console.log("Starting joinGame()");

        // Validate email, zip code, and game code input
        const valid = validateEmail(userData["email"]);
        if (!valid) {
            alert('Invalid email. Please re-enter.');
            return;
        }
        const validZ = validateZipcode(userData["zipCode"]);
        if(!validZ){
            alert("Invalid Zipcode. Please enter a 5 digit zipcode.")
            return;
        }
        const validGame = await axios.get(checkGameURL + '/' + userData["code"]).then((res) => {
            console.log("GET checkGame", res)

            if(res.data.warning !== "Invalid game code") 
                return true
            return false
        })
        if(!validGame) {
            alert("Game code does not exist. Please enter a valid game code.")
            return
        }


        if (validateInputToJoinGame()) {
            setUserData({
                ...userData, 
                host: false,
                roundNumber: 1
            })

            // set cookies 
            putCookies(
                ["host", "roundNumber", "name", "alias", "email", "zipCode", "code"], 
                {"host": false, "roundNumber": 1})

            // POST addUser to create a new guest user
            let payload = {
                user_name: userData.name,
                user_alias: userData.alias,
                user_email: userData.email,
                user_zip: userData.zipCode,
            }
            
            await axios.post(addUserURL, payload).then((res) => {
                console.log("POST addUser as guest", res);
                let pUID = res.data.user_uid

                setUserData({
                    ...userData, 
                    playerUID: pUID
                })
                


                putCookies(["playerUID"], {"playerUID": pUID})
                
                
                // set playerUID cookie replace below
                // setCookie("playerUID", res.data.user_uid)

                setLoading(true)

                // If email is validated join game and transition to waiting room, else transition to confirmation page
                console.log("user_code", res.data.user_code)
                if(res.data.user_code === "TRUE") {
                    //  POST joinGame to join created game using host's ID, then transition to waiting room
                    console.log("User exists and email validated. Transition to waiting.")

                   let payload = {
                        game_code: userData.code,
                        user_uid: res.data.user_uid
                    }

                    axios.post(joinGameURL, payload).then((res) => {
                        console.log("POST joinGame", res)

                        // Convert round duration format (min:sec) into seconds
                        const duration_secs = parseInt(res.data.round_duration.substring(res.data.round_duration.length - 2));
                        const duration_mins = parseInt(res.data.round_duration.substring(res.data.round_duration.length - 4, res.data.round_duration.length - 2));
                        let duration = duration_mins * 60 + duration_secs;

                        setUserData({
                            ...userData, 
                            rounds: res.data.num_rounds,
                            roundDuration: duration
                        })
                        
                        // set cookies for below replace
                        putCookies(
                            ["rounds", "roundDuration"], 
                            {"rounds": res.data.num_round, "roundDuration": duration}
                        )

                        //setCookie("rounds", res.data.num_rounds)
                        // setCookie("roundDuration", duration)
                        
                        console.log("Publishing to waiting/", userData.code)
                        const channel = client.channels.get(`Captions/Waiting/${userData.code}`)
                        channel.publish({data: {newPlayerName: userData.alias}})

                        history.push("/waiting")
                       
                    })
                } else {
                    history.push('/confirmation')
                }
            })

        } else {
            window.alert("To join a game, fill out the necessary information and the correct gamecode.");
        }

    }
    
    
    return (
        
        <div
            
            style={{
                maxWidth: "375px",
                height: "812px",
                backgroundImage: `url(${background})`,
            }}
        >

            <div className="spacer"/>
            
            <Link to="/gamerules">
                <i
                    style={{
                        position: "absolute",
                        top: "175px",
                        left:'30px',
                        paddingBottom:'20px',
                        color: "blue",

                    }}
                    children=' Game Rules'
                    className="fas fa-info-circle"
                />
            </Link>
            <br></br>
            <Form
                className="input1"
                field="Your Name"
                variable={userData["name"]}
                onHandleChange={nameInput => setUserData({
                    ...userData, 
                    name: nameInput
                })}
                type="text"
            />
            <br></br>
            <Form
                className="input1"
                field="Email Address"
                variable={userData["email"]}
                onHandleChange={emailInput => setUserData({
                    ...userData, 
                    email: emailInput
                })}
            />

            <br></br>
            <Form
                className="input1"
                field="Zip Code"
                variable={userData["zipCode"]}
                onHandleChange={zipCodeInput => setUserData({
                    ...userData, 
                    zipCode: zipCodeInput
                })}
            />
            <br></br>
            <Form
                className="input1"
                field="Alias (screen name)"
                variable={userData["alias"]}
                onHandleChange={aliasInput => setUserData({
                    ...userData, 
                    alias: aliasInput
                })}
            />
            <br></br>
            <br></br>

            <Button
                isSelected={true}
                onClick={createGame}
                className="landing"
                children="Create New Game"
                conditionalLink={validateInputToCreateGame() && validateEmail(userData["email"]) && validateZipcode(userData["zipCode"])}
            />
            <div className="middleText">OR</div>
            <Form
                className="input1"
                field="Enter Game Code"
                onHandleChange={codeInput => setUserData({
                    ...userData, 
                    code: codeInput
                })}
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


