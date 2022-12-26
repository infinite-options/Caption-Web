import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useCookies } from 'react-cookie'
import { ably, getScoreBoard, getNextImage } from "../util/Api"
import "../styles/ScoreBoard.css"

export default function ScoreBoard(){
    const navigate = useNavigate(), location = useLocation()
    const [userData, setUserData] = useState(location.state)
    const [cookies, setCookie] = useCookies(["userData"])
    const channel = ably.channels.get(`BizBuz/${userData.gameCode}`)
    const [scoreBoard, setScoreBoard] = useState([])

    if(scoreBoard.length === 0 && cookies.userData.scoreBoard != undefined){
        setScoreBoard(cookies.userData.scoreBoard)
    }

    useEffect(() => {
        if(userData.host && cookies.userData.scoreBoard === undefined){
            async function setScoreBoard() {
                const scoreBoard = await getScoreBoard(userData)
                scoreBoard.sort((a, b) => b.votes - a.votes)
                channel.publish({
                    data: {
                        message: "Set ScoreBoard",
                        scoreBoard: scoreBoard
                }})
            }
            setScoreBoard()
        }
    }, [userData])

    async function nextRoundButton() {
        //await createNextRound(userData)
        const nextRound = userData.roundNumber + 1
        // if(!userData.isApi)
        //     await setDatabaseImages(userData.gameCode, nextRound)
        const imageURL = await getNextImage(userData.gameCode, nextRound)
        channel.publish({data: {
                message: "Start Next Round",
                roundNumber: nextRound,
                imageURL: imageURL
        }})
    }

    function finalScoresButton(){
        channel.publish({data: {message: "Start EndGame"}})
    }

    useEffect(() => {
        channel.subscribe( async event => {
            if(event.data.message === "Set ScoreBoard"){
                const updatedUserData = {
                    ...userData,
                    scoreBoard: event.data.scoreBoard
                }
                setCookie("userData", updatedUserData, {path: '/'})
                setScoreBoard(event.data.scoreBoard)
            }
            else if (event.data.message === "Start Next Round") {
                const updatedUserData = {
                    ...userData,
                    roundNumber: event.data.roundNumber,
                    imageURL: event.data.imageURL
                }
                if (updatedUserData.isApi){
                    // updatedUserData = {
                    //     ...updatedUserData,
                    //     imageURL: updatedUserData.imageURLs[updatedUserData.roundNumber - 1]
                    // }
                    // await postRoundImage(updatedUserData.gameCode, updatedUserData.roundNumber, updatedUserData.imageURL)
                }
                else {
                    // const imageURL = await getDatabaseImage(updatedUserData)
                    // updatedUserData = {
                    //     ...updatedUserData,
                    //     imageURL: imageURL
                    // }
                }
                setUserData(updatedUserData)
                setCookie("userData", updatedUserData, {path: '/'})
                navigate("/Caption", {state: updatedUserData})
            }
            else if(event.data.message === "Start EndGame"){
                navigate("/EndGame", {state: userData})
            }
        })
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
            <div className="headerScoreBoard">
                <div>Alias</div>
                <div>Votes</div>
                <div>Points</div>
                <div>Total</div>
            </div>
            {scoreBoard.map((player, index) => {
                return(
                    <div key={index}>
                        <div className="valuesScoreBoard">
                            <div>{player.user_alias}</div>
                            <div>{player.votes}</div>
                            <div>{player.score}</div>
                            <div>{player.game_score}</div>
                        </div>
                        {player.caption !== "" &&
                            <div className="captionScoreBoard">{player.caption}</div>
                        }
                        {player.caption === "" &&
                            <div className="captionScoreBoard">&nbsp;</div>
                        }
                    </div>
                )})
            }
            <br/>
            {userData.host && userData.roundNumber !== userData.numOfRounds &&
                <button className="buttonScoreBoard" onClick={nextRoundButton}>
                    Next Round
                </button>
            }
            {userData.host && userData.roundNumber === userData.numOfRounds &&
                <button className="buttonScoreBoard" onClick={finalScoresButton}>
                    Show Final Scores
                </button>
            }
            <br/>
        </div>
    )
}