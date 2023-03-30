import { useEffect, useState } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { useCookies } from 'react-cookie'
import { ably, getApiImages, getPlayers, postCreateRounds,checkGameStarted } from "../util/Api"
import "../styles/Waiting.css"

export default function Waiting(){
    const navigate = useNavigate(), location = useLocation()
    const [userData, setUserData] = useState(location.state)
    const [cookies, setCookie] = useCookies(["userData"])
    const channel = ably.channels.get(`BizBuz/${userData.gameCode}`)
    const [buttonText, setButtonText] = useState("Share with other players")
    const [lobby, setLobby] = useState([])
    const [initialize, setInitialize] = useState(false)
    const [loadingImg, setloadingImg] = useState(false)

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
        let imageURL = ""
        if(userData.isApi){
            const imageURLs = await getApiImages(userData)
            imageURL = await postCreateRounds(userData.gameCode, imageURLs)
        }
        channel.publish({data: {
                message: "Start Game",
                numOfPlayers: lobby.length,
                isApi: userData.isApi,
                deckTitle: userData.deckTitle,
                deckUID: userData.deckUID,
                gameUID: userData.gameUID,
                numOfRounds: userData.numOfRounds,
                roundTime: userData.roundTime,
                imageURL: imageURL
        }})
    }

    useEffect(() => {
        async function initializeLobby() {
            setloadingImg(true)
            const newLobby = await getPlayers(userData.gameCode)
            setloadingImg(false)
            setLobby(newLobby)
        }

        if(!initialize){
            initializeLobby()
            setInitialize(true)
        }

        channel.subscribe(async event => {
            if (event.data.message === "New Player Joined Lobby") {
                await checkGameStarted(userData.gameCode,1)
                initializeLobby()
            }
            else if (event.data.message === "Start Game") {
                const updatedUserData = {
                    ...userData,
                    numOfPlayers: event.data.numOfPlayers,
                    isApi: event.data.isApi,
                    deckTitle: event.data.deckTitle,
                    deckUID: event.data.deckUID,
                    gameUID: event.data.gameUID,
                    numOfRounds: event.data.numOfRounds,
                    roundTime: event.data.roundTime,
                    imageURL: event.data.imageURL
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
            {loadingImg &&
                 <div>
                 <img src="/Loading_icon.gif" alt="loading CNN images"  width="250"  className="loadingimg"/>
                 {/* <br/> <h6> CNN Deck may take more time for loading </h6> */}
                 </div>
                // <img  href="" />

            }
            <button className="gameCodeWaiting">Game Code: {userData.gameCode}</button>
            <br/>
            <br/>
            <button className="buttonRoundType" onClick={copyGameCodeButton}>
                {buttonText}
            </button>
            <br/>
            <br/>
            {userData.host && !userData.deckSelected &&
                <button className="buttonRoundType" onClick={selectDeckButton}>
                    Select Deck
                </button>
            }
            {userData.host && userData.deckSelected &&
                <button className="buttonRoundType" onClick={startGameButton}>
                    Start Game
                </button>
            }
        </div>
    )
}