import React, { useEffect, useState, useContext } from "react";
import "../Styles/ScoreType.css";
import { Button } from "../Components/Button";
import { Link } from "react-router-dom";
import * as ReactBootStrap from 'react-bootstrap';
import { LandingContext } from "../App";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { CookieHelper } from "../Components/CookieHelper"


function ScoreType() {
    const {userData, setUserData, cookies, setCookie} = useContext(LandingContext)
    const { getCookies } = CookieHelper()
    const history = useHistory()

    // Determine if we should display landing page (true) or loading icon (false)
    const [displayHtml, setDisplayHtml] = useState(false)

    // Determines scoring rules
    const[buttonType, setbuttonType] = useState("");

    // Endpoints used in Scoretype
    const createGameURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/createGame"
    const joinGameURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/joinGame"


    // HOOK: useEffect()
    // DESCRIPTION: On first render, check if hooks are updated, load data from cookies if not
    useEffect(() => {
        // Check if userData is empty (after refresh/new user)
        if(userData.playerUID === "" || userData.rounds === "" || userData.roundDuration === "") {
            getCookies(["playerUID", "rounds", "roundDuration"], setDisplayHtml)
        }
        else
            setDisplayHtml(true)    
    }, [])



    // FUNCTION: createGame()
    // DESCRIPTION: On clicking "contiue"-- creates game with set game rules/rounds and transitions to waiting room
    function createGame() {
        // Check if scoring system empty
        if (buttonType === ""){
            alert("Select A Scoring System ")
            return
        }

        // POST /createGame to create new game with given rounds, round time, and scoring scheme
        let payload = {
            user_uid: userData.playerUID,
            rounds: userData.rounds.toString(),
            round_time: "00:00:" + userData.roundDuration,
            scoring_scheme: buttonType=== "votes" ? "V" : "R",
        }
        axios.post(createGameURL, payload).then((res) => {
            console.log("POST createGame", res)

            // Save to hooks and cookies
            setUserData({
                ...userData, 
                code: res.data.game_code
            })
            setCookie("userData",{
                ...cookies.userData,
                "code": res.data.game_code
            }, { path: '/' })

            return res.data.game_code
        }).then((gameCode) => {
            // console.log('gameCode', gameCode)

            // POST /joinGame to join created game using host's ID, then transition to waiting room
            let payload = {
                game_code: gameCode,
                user_uid: userData.playerUID
            }
            axios.post(joinGameURL, payload).then((res) => {
                console.log("POST joinGame", res)

                history.push("/waiting")
            })
        })

    }



    return (
        displayHtml ?
            // Scoretype page HTML
            <div style={{
                    maxWidth: "375px",
                    height: "812px",
                }}
            >
                <style>@import url('https://fonts.googleapis.com/css2?family=Josefin+Sans&display=swap');</style>
                {/* <img className="innerImage1" src={circle} /> */}

                <br></br>
                <br></br>

                <Link to="/gamerules">
                    <i
                        style={{
                            position: "absolute",
                            top: "55px",
                            left: "30px",
                            color: "blue",
                        }}
                        className="fas fa-info-circle"
                        children=' Game Rules'
                    />
                </Link>

                <br></br>

                <div style={{
                        paddingTop:"45px",
                }}>
                    <h5 className="fontTop">Deck Selected: <br /> Student Gallery</h5>

                    <br></br>

                    <h5 className="fontTop">Choose a scoring system:</h5>


                    <button 
                        onClick= {() => setbuttonType("votes") } 
                        className={buttonType==="votes" ? "scoretypeBtn2" : "scoretypeBtn"} 
                    >
                        Score by Votes
                    </button>

                    <p className="fontText">
                        With this scoring system, a player recieves 2 points per vote
                    </p>

                    <h5 className="fontOR">or</h5>


                    <button 
                        onClick= {() => setbuttonType("rank") } 
                        className={buttonType==="rank" ? "scoretypeBtn2" : "scoretypeBtn"}
                    >
                        Score by Ranking
                    </button>

                    <p className="fontText">
                        With this scoring system, the player (or players) with the most votes get 5 points regardless of
                        the number of votes received. 
                        <br />
                        2nd place gets 3 points.
                    </p>

                </div>
                <Button className="landing" conditionalLink={true} onClick={createGame}
                        children="Continue"/>
            </div> :
            // Loading icon HTML
            <div>
                <h1>Loading game data...</h1>
                <ReactBootStrap.Spinner animation="border" role="status"/>
            </div>

    );
}

export default ScoreType;
