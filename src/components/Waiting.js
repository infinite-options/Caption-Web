import { useEffect, useState } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { useCookies } from 'react-cookie'
import { ably, assignDeck, getApiImages, setDatabaseImages, getDatabaseImage, getPlayers, postRoundImage } from "../util/Api"
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
        await assignDeck(userData.deckUID, userData.gameCode)
        let imageURLs = []
        if(userData.isApi)
            imageURLs = await getApiImages(userData.deckUID, userData.numOfRounds)
        else
            await setDatabaseImages(userData.gameCode, userData.roundNumber)
        channel.publish({data: {
                message: "Start Game",
                numOfPlayers: lobby.length,
                isApi: userData.isApi,
                deckTitle: userData.deckTitle,
                deckUID: userData.deckUID,
                gameUID: userData.gameUID,
                numOfRounds: userData.numOfRounds,
                roundTime: userData.roundTime,
                imageURLs: imageURLs
            }})
    }

    useEffect(() => {

        async function initializeLobby(){
            const newLobby = await getPlayers(userData.gameCode)
            setLobby(newLobby)
        }

        if(!initialize){
            initializeLobby()
            setInitialize(true)
        }

        channel.subscribe(async event => {
            if(event.data.message === "Deck Selected" && userData.host){
                setSelectDeck(true)
            }
            else if(event.data.message === "New Player Joined Lobby"){
                const newLobby = await getPlayers(userData.gameCode)
                setLobby(newLobby)
            }
            else if(event.data.message === "Start Game"){
                let updatedUserData = {
                    ...userData,
                    numOfPlayers: event.data.numOfPlayers,
                    isApi: event.data.isApi,
                    deckTitle: event.data.deckTitle,
                    deckUID: event.data.deckUID,
                    gameUID: event.data.gameUID,
                    numOfRounds: event.data.numOfRounds,
                    roundTime: event.data.roundTime,
                    imageURLs: event.data.imageURLs
                }
                if (updatedUserData.isApi){
                    updatedUserData = {
                        ...updatedUserData,
                        imageURL: updatedUserData.imageURLs[0]
                    }
                    await postRoundImage(updatedUserData.gameCode, updatedUserData.roundNumber, updatedUserData.imageURL)
                }
                else {
                    const imageURL = await getDatabaseImage(updatedUserData)
                    updatedUserData = {
                        ...updatedUserData,
                        imageURL: imageURL
                    }
                }
                setUserData(updatedUserData)
                setCookie("userData", updatedUserData, {path: '/'})
                navigate("/Caption", {state: updatedUserData})
            }
        })
    }, [userData])

    return(
        <div className="waiting">
            <Link to="/GameRules" className="gameRulesWaiting">
                <i className="fa fa-info-circle"></i>
                Game Rules
            </Link>
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