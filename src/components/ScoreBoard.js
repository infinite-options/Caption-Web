import { useState, useEffect,useRef } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { useCookies } from 'react-cookie'
import { ably, getScoreBoard, getNextImage,getGameScore } from "../util/Api"
import "../styles/ScoreBoard.css"

export default function ScoreBoard(){
    const navigate = useNavigate(), location = useLocation()
    const [userData, setUserData] = useState(location.state)
    const [cookies, setCookie] = useCookies(["userData"])
    const channel = ably.channels.get(`BizBuz/${userData.gameCode}/${userData.roundNumber}`)
    const [scoreBoard, setScoreBoard] = useState([])
    const isGameEnded = useRef(false)
    const [isScoreBoard, setisScoreBoard] = useState(false)
    const isScoreBoardDisplayed = useRef(false)
    const [loadingImg, setloadingImg] = useState(true)

    if (scoreBoard.length === 0 && cookies.userData.scoreBoard != undefined) {
        setloadingImg(false)
        setScoreBoard(cookies.userData.scoreBoard)
    }

    useEffect(() => {
        if(!isScoreBoard && userData.host && cookies.userData.scoreBoard === undefined){
            async function setScoreBoard() {
                const scoreBoard = await getScoreBoard(userData)
                setloadingImg(false)
                scoreBoard.sort((a, b) => b.votes - a.votes)
                // console.log(scoreBoard)
                setisScoreBoard(true)
                channel.publish({
                    data: {
                        message: "Set ScoreBoard",
                        scoreBoard: scoreBoard
                }})
            }
            setScoreBoard()
        }
    }, [userData,isScoreBoard])
    
    useEffect(() => {
        const interval = setInterval(() => {
            // console.log("score interval")
            if (!isScoreBoardDisplayed.current && scoreBoard.length == 0) {
                async function getScoreBoard() {
                    const scoreboard = await getGameScore(userData.gameCode, userData.roundNumber)
                    setloadingImg(false)
                    scoreboard.sort((a, b) => b.game_score - a.game_score)
                    setScoreBoard(scoreboard)
                    return scoreBoard
                }
                // console.log("score from service")
                getScoreBoard()
                isScoreBoardDisplayed.current = true
            }
        }, 5000);
      
        return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    }, [scoreBoard])
    function closeButton() {
        channel.publish({
            data: {
                message: "EndGame scoreboard"
            }
        })
    }
    async function nextRoundButton() {
        const nextRound = userData.roundNumber + 1
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
                const updatedEndUserData = {
                    ...userData,
                    scoreBoardEnd: event.data.scoreBoard
                }
                setUserData(updatedEndUserData)
                setCookie("userData", updatedUserData, {path: '/'})
                setScoreBoard(event.data.scoreBoard)
            }
            else if (event.data.message === "Start Next Round") {
                const updatedUserData = {
                    ...userData,
                    roundNumber: event.data.roundNumber,
                    imageURL: event.data.imageURL
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
    
    useEffect(() => {
        channel.subscribe(async event => {
            if (event.data.message === "EndGame scoreboard") {
                const updatedUserData = {
                    ...userData,
                    scoreBoard: scoreBoard
                }
                setCookie("userData", updatedUserData, {path: '/'})
                if (!userData.host && !isGameEnded.current)  {
                    isGameEnded.current = true
                    alert("Host has Ended the game")
                }
                navigate("/EndGame", { state: updatedUserData })
            }
        })
    }, [scoreBoard])

    return(
        <div className="scoreboard">
            {userData.host &&
                < Link onClick={() => { window.confirm( 'Are you sure you want to end this game?', ) && closeButton() }} className ="closeBtn">
                    <i className="fa" >&#xf00d;</i>
                </Link>
            }
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
            <br />
            {loadingImg &&
                 <div>
                 <img src="/Loading_icon.gif" alt="loading CNN images"  width="250"  className="loadingimg"/>
                 {/* <br/> <h6> CNN Deck may take more time for loading </h6> */}
                 </div>
                // <img  href="" />

            }
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