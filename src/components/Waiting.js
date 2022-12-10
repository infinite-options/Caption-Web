import {useEffect, useState} from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useCookies } from 'react-cookie'
import {ably, getPlayers} from "../util/Api"
import "../styles/Waiting.css"

export default function Waiting(){
    const navigate = useNavigate(), location = useLocation()
    const [userData, setUserData] = useState(location.state)
    const [cookies, setCookie] = useCookies(["userData"])
    const channel = ably.channels.get(`BizBuz/${userData.gameCode}`)
    const [buttonText, setButtonText] = useState("Share with other players")
    const [selectDeck, setSelectDeck] = useState(false)
    const [lobby, setLobby] = useState([])
    const [initialize, setInitialize] = useState(false)

    function copyGameCodeButton(){
        navigator.clipboard.writeText(userData.gameCode)
        setButtonText("Copied!")
        setTimeout(() => {
            setButtonText("Share with other players")
        }, 2000)
    }

    function selectDeckButton() {
        navigate("/SelectDeck", { state: userData })
    }

    async function startGameButton() {
        const updatedUserData = {
            ...userData,
            numOfPlayers: lobby.length
        }
        channel.publish({data: {
            message: "Start Game",
            numOfPlayers: updatedUserData.numOfPlayers,
            numOfRounds: updatedUserData.numOfRounds,
            roundTime: updatedUserData.roundTime,
            deckTitle: updatedUserData.deckTitle,
            imageURL: updatedUserData.imageURL
        }})
        //navigate("/Caption", { state: updatedUserData })
    }

    async function initializeLobby(){
        const newLobby = await getPlayers(userData.gameCode)
        setLobby(newLobby)
    }
    if(!initialize){
        initializeLobby()
        setInitialize(true)
    }

    channel.subscribe(async event => {
        if(event.data.message === "Deck Selected"){
            setSelectDeck(true)
        }
        else if(event.data.message === "New Player Joined Lobby"){
            const newLobby = await getPlayers(userData.gameCode)
            setLobby(newLobby)
        }
        else if(event.data.message === "Start Game"){
            const updatedUserData = {
                ...userData,
                numOfPlayers: event.data.numOfPlayers,
                numOfRounds: event.data.numOfRounds,
                roundTime: event.data.roundTime,
                deckTitle: event.data.deckTitle,
                imageURL: event.data.imageURL
            }
            setUserData(updatedUserData)
            setCookie("userData", updatedUserData, {path: '/'})
            navigate("/Caption", {state: updatedUserData})
        }
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
            {userData.host && !selectDeck &&
                <button className="buttonRoundType" onClick={selectDeckButton}>
                    Select Deck
                </button>
            }
            {userData.host && selectDeck &&
                <button className="buttonRoundType" onClick={startGameButton}>
                    Start Game
                </button>
            }
        </div>
    )
}