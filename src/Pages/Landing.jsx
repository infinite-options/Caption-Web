import React, {useContext, useEffect, useState, useRef} from "react";
import axios from "axios";
import { useHistory, Link } from "react-router-dom";
import * as ReactBootStrap from 'react-bootstrap';
import "../Styles/Landing.css";
import "bootstrap/dist/css/bootstrap.min.css";
import background from "../Assets/landing.png";
import Form from "../Components/Form";
import { Button } from "../Components/Button.jsx";
import { LandingContext } from "../App";
import { CookieHelper } from "../Components/CookieHelper"

export default function Landing({client, channel_waiting}) {
    const { userData, setUserData, cookies, setCookie, removeCookie } = useContext(LandingContext);
    const { initializeCookies, getCookies } = CookieHelper()
    const history = useHistory();

    // Determine if we should display landing page (true) or loading icon (false)
    const [displayHtml, setDisplayHtml] = useState(false)

    // Endpoints used in Landing
    const addUserURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/addUser"
    const joinGameURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/joinGame"
    const checkGameURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/checkGame"


    // HOOK: useEffect()
    // DESCRIPTION: On first render, check if hooks are updated, load data from cookies if not
    useEffect(() => {
        // just for page
        removeCookie("userData", {path : "/page"})

        // If userData cookie does not exist, intialize and return
        if(cookies.userData === undefined) {
            console.log("USERDATA COOKIE UNDEFINED")
            setCookie("userData", {
                "name": "",
                "alias": "",
                "zipCode": "",
                "email": ""
            })
        }

        // Reset/Initialize Cookies
        initializeCookies()

        // Check if userData is empty (after refresh/new user)
        if(userData.name === "" || userData.email === "" || userData.zipCode === "" || userData.alias === "") {
            getCookies(["name", "email", "zipCode", "alias"], setDisplayHtml)
            setDisplayHtml(true)
        }
        else
            setDisplayHtml(true)
    }, [])


    // FUNCTION: createGame()
    // DESCRIPTION: On clicking "Create New Game"-- checks for valid data, then posts new host user to backend
    async function createGame() {   
        console.log("Starting createGame()")
 
        // Check if input formatted correctly
        if(checkPlayerInput()) {
            // Save data in hooks
            setUserData({
                ...userData, 
                host: true,
                roundNumber: 1
            })


            // POST /addUser to create a new host user
            let payload = {
                user_name: userData["name"],
                user_alias: userData["alias"],
                user_email: userData["email"],
                user_zip: userData["zipCode"],
            }
            await axios.post(addUserURL, payload).then((res) => {
                console.log("POST /addUser as host", res)

                let pUID = res.data.user_uid
                // Show loading screen while making post request
                setDisplayHtml(false)

                // Save data in hooks/cookies
                setUserData({
                    ...userData, 
                    playerUID: pUID
                })
                setCookie("userData", {
                    ...cookies.userData,
                    "name": userData.name,
                    "email": userData.email,
                    "zipCode": userData.zipCode,
                    "alias": userData.alias,
                    "playerUID": pUID,
                    "host": true,
                    "roundNumber": 1,
                })


                // If email is validated transition to waiting room, else transition to confirmation page
                if(res.data.user_code === "TRUE") {
                    console.log("User exists and email validated. Transition to waiting.")
                    history.push("/rounds")
                } else {
                    history.push('/confirmation')
                }
            })
        }
    }


    // FUNCTION: joinGame()
    // DESCRIPTION: On clicking "Join Game"-- validates user input and checks if game code exists in database. If so, post new player to backend and add player to game.
    async function joinGame() {
        console.log("Starting joinGame()");

        // Check if input formatted correctly
        if (checkGuestInput()) {
            // Save data in hooks
            setUserData({
                ...userData, 
                host: false,
                roundNumber: 1
            })

            // Show loading screen while making post request
            setDisplayHtml(false)

            // POST /addUser to create a new guest user
            let payload = {
                user_name: userData.name,
                user_alias: userData.alias,
                user_email: userData.email,
                user_zip: userData.zipCode,
            }
            await axios.post(addUserURL, payload).then((res) => {
                console.log("POST /addUser (guest)", res);
                
                // Save to hooks/cookies 
                let pUID = res.data.user_uid
                setUserData({
                    ...userData, 
                    playerUID: pUID
                })

                console.log("user_code", res.data.user_code)

                // If email is validated, join game and transition to waiting room. Else, transition to confirmation page
                if(res.data.user_code === "TRUE") {
                    console.log("User exists and email validated. Transition to waiting.")

                    // POST /joinGame to join existing game using guest's playerUID, then transition to waiting room
                   let payload = {
                        game_code: userData.code,
                        user_uid: res.data.user_uid
                    }
                    axios.post(joinGameURL, payload).then((res) => {
                        console.log("POST /joinGame (guest)", res)

                        // Convert roundDuration time format (min:sec) into seconds
                        const duration_secs = parseInt(res.data.round_duration.substring(res.data.round_duration.length - 2));
                        const duration_mins = parseInt(res.data.round_duration.substring(res.data.round_duration.length - 4, res.data.round_duration.length - 2));
                        let duration = duration_mins * 60 + duration_secs;

                        // Save to hooks/cookies
                        setUserData({
                            ...userData, 
                            rounds: res.data.num_rounds,
                            roundDuration: duration
                        })
                        setCookie("userData", {
                            ...cookies.userData,
                            "name": userData.name,
                            "email": userData.email,
                            "zipCode": userData.zipCode,
                            "alias": userData.alias,
                            "host": false,
                            "roundNumber": 1,
                            "playerUID": pUID,
                            "code": userData.code,
                            "rounds": res.data.num_rounds, 
                            "roundDuration": duration
                        })
                        
                        console.log("Publishing guest player to waiting/", userData.code)

                        // Publish new player to ably to notify other players
                        const channel = client.channels.get(`Captions/Waiting/${userData.code}`)
                        channel.publish({data: {newPlayerName: userData.alias}})

                        history.push("/waiting")
                    })
                } else {
                    history.push('/confirmation')
                }
            })
        }
    }


    // FUNCTION: checkPlayerInput()
    // DESCRIPTION: Check if name, email, zip code, and alias have been inputted correctly
    const checkPlayerInput = () => {
        if(!checkNameInput()) {
            alert('Please enter a name before proceeding.')
            return false
        }
        if(!checkEmailInput()) {
            alert('Invalid email. Please re-enter.')
            return false
        }
        if(!checkZipInput()){
            alert("Invalid Zipcode. Please enter a 5 digit zipcode.")
            return false
        }
        if(!checkAliasInput()) {
            alert('Please enter an alias before proceeding.');
            return false
        }
        return true;
    }


    // FUNCTION: validateGuest():
    // DESCRIPTION: Validates joining guest's input. Also validates entered game code with database
    const checkGuestInput = async () => {
        if(!checkPlayerInput())
            return false
        
        if(userData.code === "") {
            alert("Please enter a game code before proceeding.")
            return false
        }
        
        // Check if game code exists in database
        await axios.get(checkGameURL + '/' + userData["code"]).then((res) => {
            console.log("GET checkGame", res)

            if(res.data.warning === "Invalid game code") {
                alert("Game code does not exist. Please enter a valid game code.")
                return false
            }
        })
        return true
    }


    // Input Checker Functions
    function checkNameInput() {
        return userData.name !== ""
    }
    function checkEmailInput() {
        const re = /[\w\d]{1,}@[\w\d]{1,}.[\w\d]{1,}/;
        // /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(userData.email).toLowerCase());
    }
    function checkZipInput() {
        const reZ = /^\d{5}$/ ;
        return reZ.test(userData.zipCode);
    }
    function checkAliasInput() {
        return userData.alias !== ""
    }

    

    return (
        displayHtml ? 
            // Landing page HTML
            <div style={{
                maxWidth: "375px",
                height: "812px",
                backgroundImage: `url(${background})`,
            }}>

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

            </div> :
            // Loading icon HTML
            <div>
                <h1>Loading game data...</h1>
                <ReactBootStrap.Spinner animation="border" role="status"/>
            </div>
            
    );
}


