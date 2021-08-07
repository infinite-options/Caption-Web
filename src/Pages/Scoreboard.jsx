import React, {useEffect, useState, useContext} from "react";
import Pic from "../Assets/sd.jpg";
import {Row, Col, Card} from "reactstrap";
import "../Styles/Scoreboard.css";
import Report from "../Components/Report";
import {Button} from "../Components/Button";
import background from "../Assets/temp2.png";
import axios from "axios";
import Deck from "../Components/Deck";
import {LandingContext} from "../App";

function Scoreboard({setRoundNumber}) {

    const bestCaption = "Two dudes watching the Sharknado trailer";
    const [scoreboardInfo, setScoreboardInfo] = useState([]);
    const[timeStamp, setTimeStamp] = useState();


    const{code, roundNumber} = useContext(LandingContext);


    useEffect(() => {
        const getURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getScoreBoard/";
        axios.get(getURL + code + "," + roundNumber).then((res) => {
            console.log(res);
            setScoreboardInfo(res.data.players);
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
                        totalPts=""
                        votes={item.votes}
                    />
                ))
            }
            </div>
        );
    }



    function startNextRound(){
        const postURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/createNextRound";

        const payload = {
            game_code: code,
            round_number: roundNumber,
        }

        axios.post(postURL, payload).then((res) => {
            console.log(res);
            // setTimeStamp(res.data.round_start_time);
            // console.log("This is the timestamp object: " + res.data.round_start_time);
        })

        setRoundNumber(roundNumber + 1);
    }

    return (
        <div
            style={{
                maxWidth: "370px",
                height: "100%",
                //As long as I import the image from my package strcuture, I can use them like so
                backgroundImage: `url(${background})`,
                // backgroundImage:
                //   "url('https://images.unsplash.com/photo-1557683325-3ba8f0df79de?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTZ8fHxlbnwwfHx8fA%3D%3D&w=1000&q=80')",
            }}
        >
            <h1>Name of Deck</h1>
            <br></br>
            <h3> Scoreboard</h3>


            {/*<img className="centerPic flip-card" style={{*/}
            {/*    height: "255px",*/}
            {/*    width: "255px",*/}
            {/*}}*/}
            {/*     src={Pic}/>*/}
            {/*<i*/}
            {/*    style={{*/}
            {/*        position: "absolute",*/}
            {/*        top: "140px",*/}
            {/*        left: "270px",*/}
            {/*        color: "white",*/}
            {/*    }}*/}
            {/*    className="fas fa-info-circle"*/}
            {/*/>*/}

            <img className="centerPic" style={{
                height: "255px",
                width: "255px",
            }}
                 src={Pic}/>
            <br/>

            {/*<div className="flip-card">*/}
            {/*    <div className="flip-card-inner">*/}
            {/*        <div className="flip-card-front">*/}
            {/*            <img className="centerPic" style={{*/}
            {/*                height: "255px",*/}
            {/*                width: "255px",*/}
            {/*            }}*/}
            {/*                 src={Pic}/>*/}
            {/*        </div>*/}
            {/*        <div className="flip-card-back">*/}
            {/*            <h1>John Doe</h1>*/}
            {/*            <p>Architect & Engineer</p>*/}
            {/*            <p>We love that guy</p>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}


            {/* <Card>{bestCaption}</Card>
      <h4 style={{ color: "white" }}>Winning Caption!</h4> */}


            {renderReports()}

            {/*<Report*/}
            {/*    isWinner="true"*/}
            {/*    alias="Mickey"*/}
            {/*    caption="Shrek and Donkey"*/}
            {/*    points="10"*/}
            {/*    totalPts="42"*/}
            {/*    votes="2"*/}
            {/*/>*/}

            {/*<Report*/}
            {/*    alias="Mickey"*/}
            {/*    caption="Scooby Doo and Shaggy"*/}
            {/*    points="10"*/}
            {/*    totalPts="42"*/}
            {/*    votes="2"*/}
            {/*/>*/}
            {/*<Report*/}
            {/*    alias="Mickey"*/}
            {/*    caption="Shrek and Donkey"*/}
            {/*    points="10"*/}
            {/*    totalPts="42"*/}
            {/*    votes="2"*/}
            {/*/>*/}
            <br></br>
            <Button className="fat" destination="/page" onClick = {startNextRound} children="Next Round" conditionalLink={true}/>
            <br/>
        </div>
    );
}

export default Scoreboard;
