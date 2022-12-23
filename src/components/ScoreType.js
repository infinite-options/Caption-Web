import { useState } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { useCookies } from 'react-cookie'
import { createGame, joinGame } from "../util/Api.js"
import "../styles/ScoreType.css"

export default function ScoreType(){
    const navigate = useNavigate(), location = useLocation()
    const [userData, setUserData] = useState(location.state)
    const [cookies, setCookie] = useCookies(["userData"])
    const [scoreType, setScoreType] = useState("")

    function continueButton(){
        if (scoreType === ""){
            alert("Please select a scoring system.")
            return
        }
        const updatedUserData = {
            ...userData,
            scoreType: scoreType
        }
        navigate("/RoundType", { state: updatedUserData })
    }

    return(
        <div className="scoretype">
            <Link to="/GameRules" className="gameRulesScoreType">
                <i className="fa fa-info-circle"></i>
                Game Rules
            </Link>
            <h5 className="oneScoreType">Choose a scoring system:</h5>
            <br/>
            <button
                onClick={() => setScoreType("V")}
                className={scoreType === "V" ? "selectedScoreType" : "buttonScoreType"}
            >
                Score by Votes
            </button>
            <p className="twoScoreType">
                With this scoring system, a player recieves 2 points per vote
            </p>
            <h5 className="threeScoreType">or</h5>
            <br/>
            <button
                onClick={() => setScoreType("R")}
                className={scoreType === "R" ? "selectedScoreType" : "buttonScoreType"}
            >
                Score by Ranking
            </button>
            <p className="twoScoreType">
                With this scoring system, the player (or players) with the most votes get 5 points regardless of
                the number of votes received.
                <br />
                2nd place gets 3 points.
            </p>
            <br/>
            <button className="selectedScoreType" onClick={continueButton}>
                Continue
            </button>
        </div>
    )
}