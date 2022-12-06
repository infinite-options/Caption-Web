import {useEffect, useState} from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useCookies } from 'react-cookie'
import {ably, ablyStartGame, getPlayers } from "../util/Api"
import "../styles/Waiting.css"

export default function Waiting(){
    const navigate = useNavigate(), location = useLocation()
    const userData = location.state
    const channel = ably.channels.get(`BizBuz/${userData.gameCode}`)
    const [buttonText, setButtonText] = useState("Share with other players")
    const [lobby, setLobby] = useState([])

    async function initializeLobby(){
        const newLobby = await getPlayers(userData.gameCode)
        setLobby(newLobby)
    }
    initializeLobby()

    function copyGameCodeButton(){
        navigator.clipboard.writeText(userData.gameCode)
        setButtonText("Copied!")
        setTimeout(() => {
            setButtonText("Share with other players")
        }, 2000)
    }

    async function startGameButton() {
        await getPlayers(userData.gameCode)
        //navigate("/Caption", { state: userData })
    }

    channel.subscribe(async event => {
        const newLobby = await getPlayers(userData.gameCode)
        setLobby(newLobby)
    })

    return(
        <div className="waiting">
            <a href="#" className="gameRulesWaiting">
                <i className="fa fa-info-circle"></i>
                Game Rules
            </a>
            <h4 className="oneWaiting">
                Waiting for all players to join
            </h4>
            <ul className="lobbyWaiting">
                {lobby.map((player, index) => {
                    return(
                        <li key={index} className="lobbyPlayerWaiting">
                            <i className="fas fa-circle fa-3x" style={{color: "purple"}}/>
                            {player.user_alias}
                        </li>
                    )
                })}
            </ul>
            <button className="gameCodeWaiting">Game Code: {userData.gameCode}</button>
            <br/>
            <br/>
            <button className="buttonRoundType" onClick={copyGameCodeButton}>
                {buttonText}
            </button>
            <br/>
            <br/>
            {userData.host &&
                <button className="buttonRoundType" onClick={startGameButton}>
                    Start Game
                </button>
            }
        </div>
    )
}