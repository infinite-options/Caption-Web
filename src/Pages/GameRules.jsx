import React from 'react'

import { Button } from "../Components/Button.jsx";
import "../Styles/GameRules.css";


function GameRules() {
    return (
        <div> 
            <div class="header">
                <b>
                <h4>Game Rules</h4>
                </b>
            </div>
            <div class="list">
                <p>
                    1. Pick a deck for the game.
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
                    6. View Scoreboard after the round and continue playing until you’ve gone through the entire deck!
                </p>
            </div>
        </div>
    )
}

export default GameRules