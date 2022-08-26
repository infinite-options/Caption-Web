import React, {useEffect, useState, useContext} from "react";
import "../Styles/ScoreType.css";
import {Button} from "../Components/Button";
import {Link} from "react-router-dom";
import {LandingContext} from "../App";
import axios from "axios";
import {useHistory} from "react-router-dom";

function ScoreType({channel}) {
    const {userData, setUserData, cookies, setCookie} = useContext(LandingContext)
    const[buttonType, setbuttonType] = useState("");
    const history = useHistory()

    const createGameURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/createGame"
    const joinGameURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/joinGame"


    // Load Cookies
    console.log("Scoretype Cookies", cookies)
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


        getCookies(["host", "roundNumber", "name", "alias", "email", "zipCode", "playerUID", "rounds", "roundDuration"])
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


    // Creates game with game rules input and transitions to waiting room
    function createGame() {
        if (buttonType === ""){
            alert("Select A Scoring System ")
            return
        }

        // POST createGame to create new game with given rounds, round time, and scoring scheme
        let payload = {
            user_uid: userData.playerUID,
            rounds: userData.rounds.toString(),
            round_time: "00:00:" + userData.roundDuration,
            scoring_scheme: buttonType=== "votes" ? "V" : "R",
        }

        axios.post(createGameURL, payload).then((res) => {
            console.log("POST createGame", res)

            setUserData({
                ...userData, 
                code: res.data.game_code
            })
            putCookies(["code"], {"code": res.data.game_code})

            return res.data.game_code
        }).then((gameCode) => {
            console.log('gameCode', gameCode)

            //  POST joinGame to join created game using host's ID, then transition to waiting room
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
