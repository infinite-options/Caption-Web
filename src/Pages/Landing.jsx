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

export default function Landing({setCode, setName, setAlias, setEmail, setZipCode, setGameUID, setHost, setPlayerUID, client, channel, setRoundNumber, setRounds, setRoundDuration, setConfirmationCode}) {
    const {code, name, alias, email, zipCode, host, roundNumber, confirmationCode, playerUID, setDeckSelected, setImageURL, cookies, setCookie, removeCookie} = useContext(LandingContext);
    const [loading, setLoading] = useState(false)

    const history = useHistory();

    const addUserURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/addUser"
    const joinGameURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/joinGame"
    const checkGameURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/checkGame"
    

    // Detect first render
    function useFirstRender() {
        const ref = useRef(true)
        const firstRender = ref.current
        ref.current = false
        return firstRender
    }


    // Reset deck so user can select new deck from waiting
    setDeckSelected("")

    // Reset Cookies on first render
    console.log("Landing Cookies", cookies)
    if(useFirstRender()) {
        console.log("first render")
        removeCookie("code")
        removeCookie("name")
        removeCookie("email")
        removeCookie("zipCode")
        removeCookie("alias")
        removeCookie("gameUID")
        removeCookie("rounds")
        removeCookie("roundDuration")
        removeCookie("host")
        removeCookie("playerUID")
        removeCookie("roundNumber")
        removeCookie("scoreboardInfo")
        removeCookie("imageURL")
        removeCookie("photosFromAPI")
        removeCookie("deckSelected")
        removeCookie("deckTitle")
    }
    


    // Input Validation Functions
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



    // HOST: Start create game flow
    async function createGame() {   
        console.log("Starting createGame()")

        // Validate email and zip code input
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

         

        if(validateInputToCreateGame()) {
            setHost(true)
            setRoundNumber(1)

            setUserInfoCookies(true)


            // POST addUser to create a new host user
            let payload = {
                user_name: name,
                user_alias: alias,
                user_email: email,
                user_zip: zipCode,
            }
    
            axios.post(addUserURL, payload).then((res) => {
                console.log("POST addUser as host", res)

                setPlayerUID(res.data.user_uid)
                setCookie("playerUID", res.data.user_uid)

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
        const validGame = await axios.get(checkGameURL + '/' + code).then((res) => {
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
            setHost(false);
            setRoundNumber(1)

            setUserInfoCookies(false)

            // POST addUser to create a new guest user
            let payload = {
                user_name: name,
                user_alias: alias,
                user_email: email,
                user_zip: zipCode,
            }
            
            await axios.post(addUserURL, payload).then((res) => {
                console.log("POST addUser as guest", res);

                setPlayerUID(res.data.user_uid)
                setCookie("playerUID", res.data.user_uid)

                setLoading(true)

                // If email is validated join game and transition to waiting room, else transition to confirmation page
                console.log("user_code", res.data.user_code)
                if(res.data.user_code === "TRUE") {
                    //  POST joinGame to join created game using host's ID, then transition to waiting room
                    console.log("User exists and email validated. Transition to waiting.")

                   let payload = {
                        game_code: code,
                        user_uid: res.data.user_uid
                    }

                    axios.post(joinGameURL, payload).then((res) => {
                        console.log("POST joinGame", res)

                        // Convert round duration format (min:sec) into seconds
                        const duration_secs = parseInt(res.data.round_duration.substring(res.data.round_duration.length - 2));
                        const duration_mins = parseInt(res.data.round_duration.substring(res.data.round_duration.length - 4, res.data.round_duration.length - 2));
                        let duration = duration_mins * 60 + duration_secs;

                        setRounds(res.data.num_rounds)
                        setRoundDuration(duration)

                        setCookie("rounds", res.data.num_rounds)
                        setCookie("roundDuration", duration)

                        const channel = client.channels.get(`Captions/Waiting/${code}`)
                        channel.publish({data: {newPlayerName: alias}})

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


    // Set user input cookies
    const setUserInfoCookies = (isHost) => {
        setCookie("host", isHost)
        setCookie("roundNumber", 1)
        setCookie("name", name)
        setCookie("email", email)
        setCookie("zipCode", zipCode)
        setCookie("alias", alias)
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


