import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useCookies } from 'react-cookie'
import { getScoreBoard } from "../util/Api"
import "../styles/ScoreBoard.css"

export default function ScoreBoard(){
    const navigate = useNavigate(), location = useLocation()
    const [userData, setUserData] = useState(location.state)
    const [cookies, setCookie] = useCookies(["userData"])
    const [scoreBoard, setScoreBoard] = useState([])

    useEffect(() => {
        async function scoreBoard(){
            const scoreboard = await getScoreBoard(userData)
            setScoreBoard(scoreboard)
        }
        scoreBoard()
    }, [userData])

    return(
        <div className="scoreboard">
            <div className="textScoreBoard">
                <br/>
                <h1>
                    {userData.deckTitle}
                </h1>
                <h2>
                    Scoreboard
                </h2>
                <h5>
                    Round: {userData.roundNumber}/{userData.numOfRounds}
                </h5>
            </div>
            <br/>
            <img className="imgScoreBoard" src={userData.imageURL}/>
            <br/>
            <div className="containerScoreBoard">
                <div>Alias</div>
                <div>Caption</div>
                <div>Points</div>
                <div>Votes</div>
                {scoreBoard.map(player => {
                    return(
                        <>
                            <div>{player.user_alias}</div>
                            <div>{player.caption}</div>
                            <div>{player.score}</div>
                            <div>{player.votes}</div>
                        </>
                    )})
                }
            </div>
            <br/>
            <button className="buttonScoreBoard">
                Next Round
            </button>
        </div>
    )
}