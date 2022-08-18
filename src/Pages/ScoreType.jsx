import React, {useEffect, useState, useContext} from "react";
import "../Styles/ScoreType.css";
import {Button} from "../Components/Button";
import {Link} from "react-router-dom";
import {LandingContext} from "../App";
import axios from "axios";
import {useHistory} from "react-router-dom";
import { createGenerateClassName } from "@material-ui/core";

function ScoreType({channel}) {
    const {code, setCode, rounds, roundDuration, host, imageURL, setImageURL, roundNumber, alias, photosFromAPI, setPhotosFromAPI, playerUID} = useContext(LandingContext)
    const[buttonType, setbuttonType] = useState("");
    const history = useHistory()

    const createGameURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/createGame"
    const joinGameURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/joinGame"

    // Creates game with game rules input and transitions to waiting room
    function createGame() {
        if (buttonType === ""){
            alert("Select A Scoring System ")
            return
        }

        // POST createGame to create new game with given rounds, round time, and scoring scheme
        let payload = {
            user_uid: playerUID,
            rounds: rounds.toString(),
            round_time: "00:00:" + roundDuration,
            scoring_scheme: buttonType=== "votes" ? "V" : "R",
        }

        axios.post(createGameURL, payload).then((res) => {
            console.log("POST createGame", res)

            console.log("game_code", res.data.game_code)
            setCode(res.data.game_code)

            return res.data.game_code
        }).then((gameCode) => {
            console.log('gameCode', gameCode)

            //  POST joinGame to join created game using host's ID, then transition to waiting room
            let payload = {
                game_code: gameCode,
                user_uid: playerUID
            }

            axios.post(joinGameURL, payload).then((res) => {
                console.log("POST joinGame", res)

                history.push("/waiting")
            })
        })

    }


    return (
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
                    children=' Game Rule'
                />
            </Link>

            <br></br>

            <div style={{
                    paddingTop:"45px",
                }}
            >
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
        </div>
    );
}

export default ScoreType;
