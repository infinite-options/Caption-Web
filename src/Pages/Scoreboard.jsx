import React, {useEffect, useState, useContext} from "react";
import {useHistory} from 'react-router-dom';
import Pic from "../Assets/sd.jpg";
import {Row, Col, Card} from "reactstrap";
import "../Styles/Scoreboard.css";
import Report from "../Components/Report";
import {Button} from "../Components/Button";
import background from "../Assets/temp2.png";
import axios from "axios";
import Deck from "../Components/Deck";
import {LandingContext} from "../App";

function Scoreboard({setRoundNumber, channel, channel_waiting, channel_joining}) {

    const bestCaption = "Two dudes watching the Sharknado trailer";
    const [timeStamp, setTimeStamp] = useState();
    const history = useHistory();

    /**
     * Setup grandfather clock for the Scoreboard page
     */
    const [grandfatherClock, setGrandfatherClock] = useState("tick");


    const {code, roundNumber, host, imageURL, alias, scoreboardInfo} = useContext(LandingContext);


    useEffect(() => {
        // const getScoreBoardURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getScoreBoard/";
        // console.log('roundNumber = ', roundNumber);
        // axios.get(getScoreBoardURL + code + "," + roundNumber).then((res) => {
        //     console.log('scoreboard res = ', res);
        //     setScoreboardInfo(res.data.scoreboard);
        // });
        console.log('scoreboardInfo = ', scoreboardInfo);

        if(!host){
            setRoundNumber(roundNumber + 1);
            
            async function subscribe() 
            {
                await channel.subscribe(roundStarted => {
                    if (roundStarted.data.roundStarted)
                        history.push('/page');
                });
            }
            
            subscribe();
        
            return function cleanup() {
                channel.unsubscribe();
            };
        }

        async function subscribe1() 
        {
            await channel_waiting.subscribe(newPlayer => {
                async function getPlayers () {
                    console.log("Made it in getPlayers Func");
                    channel_joining.publish({data: {roundNumber: roundNumber, path: window.location.pathname}})
                }
        
                getPlayers();
            });
        }

        if (host)
            subscribe1();

        return function cleanup() {
            channel_waiting.unsubscribe();
        }
    }, [scoreboardInfo]);

    const pub = () => {
        channel.publish({data: {roundStarted: true}});
    }

    function renderReports() {

        return (
            <div>
                {
                    scoreboardInfo.map((item, index) => (
                        <Report
                            isWinner={index == 0}
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


    function startNextRound() {
        if (!host)
            return;

        const postURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/createNextRound";
        console.log('starting next round');

        const payload = {
            game_code: code.toString(),
            round_number: roundNumber.toString(),
        }
        async function nextPub(){
            await axios.post(postURL, payload);

            setRoundNumber(roundNumber + 1);
            pub();
            history.push("/page");
        }
        
        nextPub();
    }


    // useEffect(() => {

    //    if(!host) {
    //        setTimeout(function () {

    //            if (grandfatherClock != "gameHasBegun") {
    //                if (grandfatherClock == "tick") {
    //                    setGrandfatherClock("tock");
    //                } else {
    //                    setGrandfatherClock("tick");
    //                }

    //                console.log(grandfatherClock);


    //                /**
    //                 * Issue: We are going to add roundNumber to the gameTimer endpoint
    //                 */
    //                if (grandfatherClock != "gameHasBegun") {
    //                    const getTimerURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/gameTimer/";
    //                    console.log('In Scoreboard.jsx: roundNumber = ', roundNumber, ` and am ${host ? '' : 'not'} the host, getURL_FULL = ${getTimerURL + code + "," + roundNumber}`);
    //                     try {
    //                         axios.get(getTimerURL + code + "," + roundNumber).then((res) => {
    //                             try {
    //                                 var s = parseInt(res.data.round_started_at.substring(res.data.round_started_at.length - 2));
    //                                 setGrandfatherClock("gameHasBegun");
    //                             } catch (err) {
    //                                 console.log("game has not started yet");
    //                             }
    //                         })
    //                         .catch(err => console.error(err));
    //                     } catch (err) {
    //                         console.error(err);
    //                     }
    //                }

    //            }
    //        }, 2000);
    //    }

    // });

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
                 src={imageURL}/>
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


            {renderReports()}


            <br></br>
            { host ?
                <Button
                    className="fat"
                    // destination="/page"
                    onClick={startNextRound}
                    children="Next Round"
                    conditionalLink={true}
                /> : <></>
            }
{/* 
            {grandfatherClock === "gameHasBegun" && !host ?
                <Button
                    className="landing"
                    children="Start Game"
                    destination="/page"
                    conditionalLink={true}
                />
                : <></>} */}

            <br/>
        </div>
    );
}

export default Scoreboard;
