import React from 'react'

import { Button } from "../Components/Button.jsx";

import "../Styles/GameRules.css";
import {useNavigate} from 'react-router-dom';



function GameRules() {
  
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
                            <li>Select "Create New Game" to get Game Code</li>
                            <li>Selects Number of Rounds and Round Time</li>
                            <li>Share Game Code with other players</li>
                            <li>Selects Game Deck</li>
                            <li>Selects Start Game</li>
                        </ol>
                        <h5>PLAYERS</h5>
                            <p>Enter Game Code and select "Join Game"</p>
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