import React, {useEffect, useState, useContext} from "react";
import "../Styles/Scoreboard.css";
import Report from "../Components/Report";
import {Button} from "../Components/Button";
import axios from "axios";
import {LandingContext} from "../App";
import * as ReactBootStrap from 'react-bootstrap';
import { CookieHelper } from "../Components/CookieHelper"

export default function Endgame() {
    const [scoreboardInfo, setScoreboardInfo] = useState([]);
    const { getCookies } = CookieHelper()
    const { userData, setUserData } = useContext(LandingContext);

    // Determine if we should display landing page (true) or loading icon (false)
    const [displayHtml, setDisplayHtml] = useState(false)

    // Endpoints used in Endgame
    const getScoreBoardURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getScoreBoard/";
    const endgameURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/endGame/";


    let winning_score = Number.NEGATIVE_INFINITY;
    for (const playerInfo of userData.scoreboardInfo)
        winning_score = playerInfo.game_score > winning_score ? playerInfo.game_score :
            winning_score;

    
    // HOOK: useEffect()
    // DESCRIPTION: 
    useEffect(() => {
        // Check if userData is empty (after refresh/new user)
        if(userData.name === "" || userData.email === "" || userData.zipCode === "" || userData.alias === "") {
            getCookies(["host", "roundNumber", "name", "alias", "email", "zipCode", "playerUID", "rounds", "roundDuration", "code", "deckTitle", "deckSelected", "imageURL", "photosFromAPI", "scoreboardInfo"], setDisplayHtml)
        }
        else {
            setDisplayHtml(true)
        }
    }, [])

    // HOOK: useEffect()
    // DESCRIPTION: 
    useEffect(() => {
        axios.get(getScoreBoardURL + userData.code + "," + userData.roundNumber).then((res) => {
            console.log("GET Get Scoreboard",res);

            res.data.scoreboard.sort((a, b) => (
                b.game_score === a.game_score ? 
                    b.score - a.score : b.game_score - a.game_score
            ));

            setScoreboardInfo(res.data.scoreboard);
        })

        if(userData.host) 
        axios.get(endgameURL + userData.code).then((res) => {
            console.log("GET EndGame",res);
        })
    }, [])



    // FUNCTION: renderReports()
    // DESCRIPTION: 
    function renderReports() {
        return (
            <div>
                {
                    scoreboardInfo.map((item, index) => (
                        <Report
                            isWinner={winning_score === item.game_score}
                            alias={item.user_alias}
                            caption={item.caption}
                            points={item.score}
                            totalPts={item.game_score}
                            votes={item.votes}
                        />
                    ))
                }
            </div>
        );
    }


    return (
        displayHtml ? 
            // Endgame page HTML
            <div style={{
                    maxWidth: "370px",
                    height: "100%",
                    backgroundColor: "red"
            }}>
                <h1>Game Over</h1>
                
                <br/>

                <h3> Final Scores </h3>

                <br/>

                {displayHtml ? 
                    renderReports() :
                    <div>
                        <ReactBootStrap.Spinner animation="border" role="status"/>
                    </div>}
                

                <br/>

                <Button
                    className="card"
                    children="Navigate to Landing Page"
                    destination="/"
                    conditionalLink={true}
                />

                <br/>
            </div> :
            // Loading icon HTML
            <div>
                <h1>Loading game data...</h1>
                <ReactBootStrap.Spinner animation="border" role="status"/>
            </div>
    );
}

