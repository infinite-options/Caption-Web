import React from 'react'

import "../Styles/GameRules.css";


function GameRules() {
    return (
        <div> 
            <div class="header">
                <h4> <b> Game Rules </b> </h4>
            </div>
            <div class="list">
                <p> <p> 1. Pick a deck for the game. </p>
                <p>2. You can learn about the artist and their collection by clicking on <font color="#3a91fb">Learn More</font>.</p>
                {/* <span class="blueText">Learn More</span> */}
                <p> 3. Once into the game, you will see an image and will have 60 seconds to caption it. </p>
                <p>4. Click <font color="#3a91fb">Submit</font> to submit your caption.</p>
                {/* <span class="blueText">Submit</span> */}
                <p> 5. Once all the players have submitted their captions, everyone can vote for their favorite. *you cannot vote for your own caption. </p>
                <p> 6. View Scoreboard after the round and continue playing until you’ve gone through the entire deck! </p>
                </p>
            </div>
        </div>
    )
}

export default GameRules