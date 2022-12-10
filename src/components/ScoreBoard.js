import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useCookies } from 'react-cookie'
import {ably, getScoreBoard, createNextRound, getDatabaseImage} from "../util/Api"
import "../styles/ScoreBoard.css"

export default function ScoreBoard(){
    const navigate = useNavigate(), location = useLocation()
    const [userData, setUserData] = useState(location.state)
    const [cookies, setCookie] = useCookies(["userData"])
    const channel = ably.channels.get(`BizBuz/${userData.gameCode}`)
    const [scoreBoard, setScoreBoard] = useState([])

    useEffect(() => {
        async function scoreBoard(){
            const scoreboard = await getScoreBoard(userData)
            scoreboard.sort((a, b) => b.votes - a.votes)
            setScoreBoard(scoreboard)
        }
        scoreBoard()
    }, [userData])

    async function nextRoundButton() {
        await createNextRound(userData)
        const nextRound = userData.roundNumber + 1
        const imageURL = await getDatabaseImage(userData.gameCode, nextRound)
        const updatedUserData = {
            ...userData,
            roundNumber: nextRound,
            imageURL: imageURL
        }
        channel.publish({data: {
                message: "Start Next Round",
                roundNumber: updatedUserData.roundNumber,
                imageURL: updatedUserData.imageURL
        }})
        setUserData(updatedUserData)
        setCookie("userData", updatedUserData, {path: '/'})
    }

    channel.subscribe( event => {
        if(event.data.message === "Start Next Round"){
            const updatedUserData = {
                ...userData,
                roundNumber: event.data.roundNumber,
                imageURL: event.data.imageURL
            }
            setUserData(updatedUserData)
            setCookie("userData", updatedUserData, {path: '/'})
            navigate("/Caption", { state: updatedUserData })
        }
    })

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
                {scoreBoard.map((player, index) => {
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
            {userData.host &&
                <button className="buttonScoreBoard" onClick={nextRoundButton}>
                    Next Round
                </button>
            }
            <br/>
        </div>
    )
}