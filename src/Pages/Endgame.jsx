import React, {useEffect, useState, useContext} from "react";
import "../Styles/Scoreboard.css";
import Report from "../Components/Report";
import {Button} from "../Components/Button";
import axios from "axios";
import {LandingContext} from "../App";

export default function Endgame() {

    const [scoreboardInfo, setScoreboardInfo] = useState([]);


    const {code, roundNumber, host, rounds} = useContext(LandingContext);


    useEffect(() => {

        const getScoreBoardURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getScoreBoard/";
        axios.get(getScoreBoardURL + code + "," + roundNumber).then((res) => {
            console.log(res);
            setScoreboardInfo(res.data.scoreboard);
        })

        const endgameURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/endGame/";
        axios.get(endgameURL + code).then((res) => {
            console.log(res);
        })

    }, []);

    function renderReports() {
        return (
            <div>
                {
                    scoreboardInfo.map((item) => (
                        <Report
                            isWinner="false"
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
        <div
            style={{
                maxWidth: "370px",
                height: "100%",
                //As long as I import the image from my package strcuture, I can use them like so
                backgroundColor: "red"
                // backgroundImage: `url(${background})`,
                // // backgroundImage:
                // //   "url('https://images.unsplash.com/photo-1557683325-3ba8f0df79de?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTZ8fHxlbnwwfHx8fA%3D%3D&w=1000&q=80')",
            }}
        >
            <h1>Game Over</h1>
            <br></br>
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

