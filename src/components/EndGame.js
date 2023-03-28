import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useCookies } from 'react-cookie'
import { getScoreBoard,getGameScore } from "../util/Api"
import "../styles/EndGame.css"

export default function EndGame(){
    const navigate = useNavigate(), location = useLocation()
    const [userData, setUserData] = useState(location.state)
    const [cookies, setCookie] = useCookies(["userData"])
    const [scoreBoard, setScoreBoard] = useState([])
    useEffect(() => {
        async function scoreBoard(){
            const scoreboard = await getGameScore(userData.gameCode,userData.numOfRounds)
            scoreboard.sort((a, b) => b.game_score - a.game_score)
            setScoreBoard(scoreboard)
        }
        if (cookies.userData === undefined || cookies.userData.scoreBoard === undefined || cookies.userData.scoreBoard.lenght === 0) {
            scoreBoard()
        }else {
            const scoreboard = cookies.userData.scoreBoard;
            scoreboard.sort((a, b) => b.game_score - a.game_score)
            setScoreBoard(scoreboard)
        }
    }, [userData])
    
    function landingButton(){
        navigate("/", { state: userData })
    }

    return(
        <div className="endgame">
            <div className="headerEndGame">
                <h1>Game Over</h1>
                <br/>
                <h3>Final Scores</h3>
            </div>
            <div className="columnsEndGame">
                <div>Alias</div>
                <div>Total</div>
            </div>
            {scoreBoard.map((player, index) => {
                return(
                    <div key={index} className="valuesEndGame">
                        <div>{player.user_alias}</div>
                        <div>{player.game_score}</div>
                    </div>
                )})
            }
            <br/>
            <button className="buttonEndGame" onClick={landingButton}>
                Return to Landing Page
            </button>
            <br/>
        </div>
    )
}
