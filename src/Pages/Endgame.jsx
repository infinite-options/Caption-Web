import React, {useEffect, useState, useContext} from "react";
import "../Styles/Scoreboard.css";
import Report from "../Components/Report";
import {Button} from "../Components/Button";
import axios from "axios";
import {LandingContext} from "../App";

export default function Endgame() {

    const [scoreboardInfo, setScoreboardInfo] = useState([]);
    const {code, roundNumber, host, rounds, alias} = useContext(LandingContext);


    useEffect(() => {
        const getScoreBoardURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getScoreBoard/";
        axios.get(getScoreBoardURL + code + "," + roundNumber).then((res) => {
            console.log("GET Get Scoreboard",res);

            res.data.scoreboard.sort((a, b) => (
                b.game_score === a.game_score ? 
                    b.score - a.score : b.game_score - a.game_score
            ));

            setScoreboardInfo(res.data.scoreboard);
        })

        if(host) {
            const endgameURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/endGame/";
            axios.get(endgameURL + code).then((res) => {
                console.log("GET EndGame",res);
            })
        }
    }, []);


    let winning_score = Number.NEGATIVE_INFINITY;
    for (const playerInfo of scoreboardInfo)
        winning_score = playerInfo.game_score > winning_score ? playerInfo.game_score :
            winning_score;


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


    useEffect(() => 
        console.log('Currently in Endgame', "Alias:",alias, "Current Round: ", roundNumber), 
    []);


    return (
        <div
            style={{
                maxWidth: "370px",
                height: "100%",
                backgroundColor: "red"
            }}
        >
            <h1>Game Over</h1>
            
            <br/>

            <h3> Final Scores </h3>

            <br/>

            {renderReports()}

            <br/>

            <Button
                className="card"
                children="Navigate to Landing Page"
                destination="/"
                conditionalLink={true}
            />

            <br/>
        </div>
    );
}

