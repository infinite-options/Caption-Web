
import { useHistory } from "react-router-dom";
import { Button } from "../Components/Button.jsx";
import React, {useContext, useEffect, useState, Component} from 'react'
import "../Styles/GameRules.css";
import {useNavigate} from 'react-router-dom';
import {LandingContext} from "../App";
import axios from "axios";


function GameRules({channel2}) {
    const history = useHistory();
    const {code, host, rounds, setRounds, roundNumber, setImageURL, alias, photosFromAPI, setPhotosFromAPI, deckSelected, deckTitle, setDeckTitle} = useContext(LandingContext);
    useEffect(() => {
        async function subscribe2() 
        {
            await channel2.subscribe(newGame => {
                console.log("In subscribe 2")
                if(newGame.data.gameStarted) {
                    console.log("newGame data", newGame.data)
                    setDeckTitle(newGame.data.deckTitle)

                    if(newGame.data.currentImage.length === 0) {
                        const getImage = async () => {
                            const getImageURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getImageForPlayers/";
                            await axios.get(getImageURL + code + "," + roundNumber)
                            .then((res) => {
                                console.log("GET Get Image For Players", res);
                                setImageURL(res.data.image_url);
                            })

                            history.push('/page');
                        };

                        getImage();
                    } else {
                        setImageURL(newGame.data.currentImage)
                        history.push('/page')
                    }
                    
                }
            })
        }
        if(code){
            subscribe2()
        }
        
    },[code])
    
    return (
        <div> 
            <div class="header">
                <b>
                <h2>Game Rules</h2>
                </b>
            </div>
            <div class="list">
                <p>
                    
                    <div class='setup'>
                    <h4 ><strong><u>Game Setup Information</u></strong></h4>
                    <h5>HOST</h5>
                        <ol>
                            <li>Enter Name, Email, Alias and Zipcode</li>
                            <li>Select "Create New Game" to get Game Code</li>
                            <li>Select Number of Rounds and Round Time</li>
                            <li>Share Game Code with other players</li>
                            <li>Select Game Deck</li>
                            <li>Select Start Game</li>
                        </ol>
                        <h5>PLAYERS</h5>
                            <ol>
                                <li>Enter Name, Email, Alias and Zipcode</li>
                                <li>Enter Game Code</li>
                                <li>Select "Join Game"</li>
                            </ol>
                    </div>
                    <div class="googlePhotosInstructions">
                    <h4><strong><u>Google Photos Instructions</u></strong></h4>
                        <ul>
                        <li>In Google Photos</li>
                        <ol>
                            <li>Select photos in Google Photos</li>
                            <li>Create Shared Album</li>
                        </ol>
                        <li>In game</li>
                        <ol>
                            <li>Click Select Game Deck</li>
                            <li>Select Google Photos Icon</li>
                            <li>Log in to Google</li>
                            <li>Select Shared Album</li>
                        </ol>
                        </ul>
                        
                    </div>
                    <div class="gamePlayInstruction">
                    <h4><strong><u>Game Play Instructions</u></strong></h4>
                    <ol>
                        <li>Each player should enter a Caption within the allotted time</li>
                        <li>Once all captions are submitted (or time runs out), Each player votes for the best Caption (you cannot vote for you own Caption)</li>
                        <li>Once all votes are in, review the scoreboard before playing the next round</li>
                    </ol>

                    </div>
                    {/* 1. Pick a deck for the game.
                    <br></br>
                    <br></br>
                    <p>2. You can learn about the artist and their collection by clicking on <span class="blueText">Learn More</span>.</p>
                    3. Once into the game, you will see an image and will have 60 seconds to caption it.
                    <br></br>
                    <br></br>
                    <p>4. Click <span class="blueText">Submit</span> to submit your caption.</p>
                    5. Once all the players have submitted their captions, everyone can vote for their favorite. *you cannot vote for your own caption.
                    <br></br>
                    <br></br>
                    6. View Scoreboard after the round and continue playing until you’ve gone through the entire deck! */}
                </p>
            </div>
            <a href = "javascript:history.back()">Back to previous page</a>
        </div>
        
    )
}

export default GameRules