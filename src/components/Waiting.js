import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useCookies } from 'react-cookie'
import "../styles/Waiting.css"

export default function Waiting(){
    const navigate = useNavigate(), location = useLocation()
    const [userData, setUserData] = useState(location.state)
    const [buttonText, setButtonText] = useState("Share with other players")
    const [deckSelected, setDeckSelected] = useState(false)

    console.log("Waiting userData: " + JSON.stringify(userData))

    function handleClick(){
        navigator.clipboard.writeText(userData.gameCode)
        setButtonText("Copied!")
        setTimeout(() => {
            setButtonText("Share with other players")
        }, 2000)
    }

    function selectDeck(){
        setDeckSelected(true)
        navigate("/SelectDeck", { state: userData })
    }

    return(
        <div className="waiting">
            <a href="#" className="gameRulesWaiting">
                <i className="fa fa-info-circle"></i>
                Game Rules
            </a>
            <h4 className="oneWaiting">
                Waiting for all players to join
            </h4>
            <button className="gameCodeWaiting">Game Code: {userData.gameCode}</button>
            <br/>
            <br/>
            <button className="buttonRoundType" onClick={handleClick}>
                {buttonText}
            </button>
            <br/>
            <br/>
            {userData.host && !deckSelected &&
                <button className="buttonRoundType" onClick={selectDeck}>
                    Select Deck
                </button>
            }
            {userData.host && deckSelected &&
                <button className="buttonRoundType" >
                    Start Game
                </button>
            }
        </div>
    )
}