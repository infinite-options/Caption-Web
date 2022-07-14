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
    const [grandfatherClock, setGrandfatherClock] = useState("tick");
    const {code, roundNumber, host, imageURL, alias, scoreboardInfo, setImageURL} = useContext(LandingContext);

    const pub = () => {
        channel.publish({data: {roundStarted: true}});
    }


    useEffect(() => {
        console.log('scoreboardInfo = ', scoreboardInfo);

        if(!host){
            setRoundNumber(roundNumber + 1);
            

            async function subscribe() 
            {
                await channel.subscribe(roundStarted => {
                    if (roundStarted.data.roundStarted) {
                        const getImage = async () => {
                            const getImageURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getImageForPlayers/";
                            const nextRound = roundNumber + 1;
                            console.log('[code, nextRound] = ', [code, nextRound]);
                            console.log('fullURL scoreboard = ', getImageURL + code + "," + nextRound);

                            await axios.get(getImageURL + code + "," + nextRound).then((res) => {
                                console.log("GET Get Image For Players",res);
                                setImageURL(res.data.image_url);
                            })

                            history.push('/page');
                        };
    
                        getImage();
                    }
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
                    channel_joining.publish({data: {
                        roundNumber: roundNumber, 
                        path: window.location.pathname
                    }})
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


    let winning_score = Number.NEGATIVE_INFINITY;
    for (const playerInfo of scoreboardInfo)
        winning_score = playerInfo.score > winning_score ? playerInfo.score :
            winning_score;


    function renderReports() {
        return (
            <div>
                {
                    scoreboardInfo.map((item, index) => (
                        <Report
                            isWinner={winning_score === item.score}
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

        console.log('starting next round');

        const postURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/createNextRound";
        const payload = {
            game_code: code.toString(),
            round_number: roundNumber.toString(),
        }

        async function nextPub(){
            await axios.post(postURL, payload);

            setRoundNumber(roundNumber + 1);

            
            const getUniqueImageInRound = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getUniqueImageInRound/";
            const nextRound = roundNumber + 1;
            console.log('test1: unique URL = ', getUniqueImageInRound + code + "," + nextRound);

            await axios.get(getUniqueImageInRound + code + "," + nextRound).then((res) => {
                console.log('GET Get Unique Image In Round', res);
                setImageURL(res.data.image_url);
            })

            console.log('test2: publishing');

            pub();

            history.push("/page");
        }
        
        nextPub();
    }


    useEffect(() => 
        console.log('Currently in Scoreboard', "Alias:",alias, "Current Round: ", roundNumber), 
        []);


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


            <img className="centerPic" style={{
                height: "255px",
                width: "255px",
            }}
                 src={imageURL}/>
            <br/>


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

            <br/>
        </div>
    );
}

export default Scoreboard;
