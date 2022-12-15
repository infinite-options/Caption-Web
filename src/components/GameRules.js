import "../styles/GameRules.css"
import { useNavigate } from "react-router-dom"

export default function GameRules(){
    const navigate = useNavigate()
    function goBackButton(){
        navigate(-1)
    }

    return(
        <div className="gamerules">
            <br/>
            <button className="buttonGameRules" onClick={goBackButton}>Back to Previous Page</button>
            <b className="headerGameRules">
                <h2>Game Rules</h2>
            </b>
            <div className="listGameRules">
                <h4><strong><u>Game Setup Information</u></strong></h4>
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
                <h4><strong><u>Game Play Instructions</u></strong></h4>
                <ol>
                    <li>Each player should enter a Caption within the allotted time</li>
                    <li>Once all captions are submitted (or time runs out), Each player votes for the best Caption
                        (you cannot vote for you own Caption)
                    </li>
                    <li>Once all votes are in, review the scoreboard before playing the next round</li>
                </ol>
            </div>
        </div>
    )
}