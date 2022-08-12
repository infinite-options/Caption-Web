import React, {useContext, useEffect, useState} from "react";
import {useHistory} from 'react-router-dom';

import {Row, Col, Card} from "reactstrap";
import Form from "../Components/Form";
import {Button} from "../Components/Button";
import "../Styles/Page.css";
import background from "../Assets/temp.png";

//Documentation for the CountdownCircleTimer component
//https://github.com/vydimitrov/react-countdown-circle-timer#props-for-both-reactreact-native
import {CountdownCircleTimer} from "react-countdown-circle-timer";
import axios from "axios";
import {LandingContext} from "../App";
import Bubbles from "../Components/Bubbles";

export default function Page({setImageURL, setRounds, channel, channel_waiting, channel_joining}) {
    const {code, roundNumber, host, playerUID, imageURL, alias} = useContext(LandingContext);
    const history = useHistory();

    const [caption, setCaption] = useState("");
    const [captionSubmitted, setCaptionSubmitted] = useState(false);
    const [roundHasStarted, setRoundHasStarted] = useState(false);
    const [timeUp, setTimeUp] = useState(false);
    const [timerDuration, setTimerDuration] = useState(-1);
    const [waitingPlayers, setWaitingPlayers] = useState([]);
    const [moveOn, setMoveOn] = useState(false);
    const [roundStartTime, setRoundStartTime] = useState();

    const startPlayingURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/startPlaying/";
    const getTimerURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/gameTimer/";
    const getImageURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getImageForPlayers/";
    const getPlayersURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getPlayersRemainingToSubmitCaption/";
    const getUniqueImageInRound = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getUniqueImageInRound/";

    console.log('waitingPlayers after a render: ', waitingPlayers);


    const pub = (playerCount) => {
        console.log('In pub function with playerCount == ', playerCount);
        channel.publish({data: {playersLeft: playerCount, userWhoVoted: alias}});
    };


    function determineLag(current, start) {
        if (current - start >= 0) {
            return current - start;
        } else {
            return current + (60 - start);
        }
    }


    useEffect(() => {

        async function pageAsyc(){
            /**
             * Mayukh: I don't know why this works, but I am sure that the getTimer endpoint must be called after startPlaying.
             * By arranging the endpoint calls in this fashion, I am able to create a 'magical' delay that works in my favor.
             */

            if (host) {
                // Host logs start of new round/time started in backend
                await axios.get(startPlayingURL + code + "," + roundNumber).then((res) => {
                    console.log(res);
                    setRoundStartTime(res.data.round_start_time);
                    setRoundHasStarted(true);
                })

            }

            /**
             * GET GameTimer with lag calculation
             * Determine the amount of time left on the countdown timer.
             *
             * s = the second at which the round has started
             * c = the second at which the clock is currently on
             * d = the seconds for the duration of the round
             */
            console.log("Log 2: Finish Posting");
            console.log('In Page.jsx: code = ', code, ' roundNumber = ', roundNumber, ` fullURL = ${getTimerURL + code + "," + roundNumber}`);

            // Loop continuosly until we receive the game timer information
            // var flag = true;
            // while(flag){
            //     console.log("duration = " + timerDuration);
            //     await axios.get(getTimerURL + code + "," + roundNumber).then((res) => {
            //         console.log('res = ', res.data);

            //         setRounds(res.data.total_number_of_rounds);

            //         // Determine lag between round started time and current time, log the leftover duration into timerDuration
            //         let serverClock = parseInt(res.data.current_time.substring(res.data.current_time.length - 2));
            //         if (res.data.round_started_at != undefined) {
            //             var c = serverClock;
            //             var s = parseInt(res.data.round_started_at.substring(res.data.round_started_at.length - 2));
            //             const d_secs = parseInt(res.data.round_duration.substring(res.data.round_duration.length - 2));
            //             const d_mins = parseInt(res.data.round_duration.substring(res.data.round_duration.length - 4, res.data.round_duration.length - 2));
            //             var d = d_mins * 60 + d_secs;
            //             console.log("setTimerDuration: ", d - determineLag(c, s));
            //             setTimerDuration(d - determineLag(c, s));

            //             console.log(timerDuration);
            //             flag = false;
            //         }
            //     }).catch(err => console.log("timer failed"))
            // }

            
            // Instead of determining lag, give each user the full round duration
            await axios.get(getTimerURL + code + "," + roundNumber).then((res) => {
                console.log('GetTimerURL', res.data)

                // Convert round duration format (min:sec) into seconds
                const duration_secs = parseInt(res.data.round_duration.substring(res.data.round_duration.length - 2));
                const duration_mins = parseInt(res.data.round_duration.substring(res.data.round_duration.length - 4, res.data.round_duration.length - 2));
                let duration = duration_mins * 60 + duration_secs;

                console.log('Duration Seconds', duration_secs)
                console.log('Duration Minutes', duration_mins)
                console.log('Duration Total', duration)

                if(res.data.round_started_at !== undefined) {
                    setTimerDuration(duration)
                }
            })
        }

        pageAsyc();
    }, []);



    useEffect(() => {
        async function subscribe() 
        {
            await channel.subscribe(newVote => {
                console.log('Countdown on submit-caption screen: PlayersLeft = ', newVote.data.playersLeft);
                const newWaitingPlayers = [];
                for (let i = 0; i < waitingPlayers.length; i++)
                    if (waitingPlayers[i] !== newVote.data.userWhoVoted)
                        newWaitingPlayers.push(waitingPlayers[i]);

                if (newVote.data.playersLeft === 0) {
                    history.push('/selection');
                } else {
                    setWaitingPlayers(newWaitingPlayers);
                }
            });
        }
        
        subscribe();


        async function subscribe1() 
        {
            await channel_waiting.subscribe(newPlayer => {
                async function getPlayers () {
                    console.log("Made it in getPlayers Func");
                    if (host)
                        channel_joining.publish({data: {roundNumber: roundNumber, path: window.location.pathname}});
                    const temp = [newPlayer.data.newPlayerName];
                    for (const name of waitingPlayers) {
                        temp.push(name);
                    }
                    setWaitingPlayers(temp);
                }
        
                getPlayers();
            });
        }

        subscribe1();
    

        return function cleanup() {
            channel.unsubscribe();
            channel_waiting.unsubscribe();
        };
    }, [waitingPlayers]);



     useEffect(() => 
     console.log('Currently in Pages', "Alias:",alias, "Current Round: ", roundNumber), 
     []);


    
    async function postSubmitCaption() {
        if(caption === ""){
            alert("Please enter a caption.")
            return
        }
        const getURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getAllSubmittedCaptions/";

        /**
         * Issue:
         * The user should not be able to select/vote for their own caption.
         * Should be easy --> match internal state with info in the endpoint result.
         */
        await axios.get(getURL + code + "," + roundNumber).then((res) => {
            console.log('page_get_res before post = ', res);
        });

        setCaptionSubmitted(true);
        const postURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/submitCaption";
        const payload = {
            caption: caption,
            game_code: code.toString(),
            round_number: roundNumber.toString(),
            user_uid: playerUID.toString()
        }

        await axios.post(postURL, payload).then((res) => {
            console.log('POST Submit Caption', res);
        });

        await axios.get(getURL + code + "," + roundNumber).then((res) => {
            console.log('page_get_res after = ', res);
        });

        console.log('payload = ', payload);

        await axios.get(getPlayersURL + code + "," + roundNumber).then((res) => {
            console.log('res.data.players = ', res.data.players);
            pub(res.data.players.length);
        })
    }

    function toggleTimeUp() {
        setTimeUp(true);
    }

    return (
        <div
            style={{
                maxWidth: "375px",
                height: "100%",
                backgroundImage: `url(${background})`,
            }}
        >
            <div style={{padding: "20px"}}>
                <br></br>

                <h1
                    style={{
                        fontSize: "20px",
                    }}
                >
                    Name of Deck
                </h1>
                <br></br>

                <img className="centerPic" src={imageURL} alt="Loading Image...."/>

                <br></br>
                <br></br>

                <div>
                    {captionSubmitted ? <></> : 
                        <Form
                            className="input2"
                            field="Enter your caption here"
                            onHandleChange={newCaption => setCaption(newCaption)}
                            onHandleSubmit={(caption) => {
                                console.log('setting caption and submitting');
                                setCaption(caption);
                                postSubmitCaption();
                            }}
                        />
                    }
                    <br/>

                    <Row>
                        <span style={{marginLeft: "50px"}}></span>
                        <div style={{
                                background: "yellow",
                                borderRadius: "30px",
                                width: "60px",
                            }}
                        >
                            {timerDuration !== -1 ? <CountdownCircleTimer
                                    background="red"
                                    size={60}
                                    strokeWidth={5}
                                    isPlaying
                                    duration={timerDuration}
                                    colors="#000000"
                                    onComplete={toggleTimeUp}
                                >
                                    {({remainingTime}) => {

                                            if (remainingTime === 0)
                                                pub(0);
                                            return (<div className="countdownText">{remainingTime}</div>);
                                        }
                                    }
                            </CountdownCircleTimer> : <></>}

                        </div>

                        <span style={{marginLeft: "60px"}}></span>
                        <br></br>{" "}

                        {captionSubmitted ? <Button
                            className="fat"
                            destination="/page"
                            // onClick={postSubmitCaption}
                            // onClick={toggleCaptionSubmitted}
                            children="Submitted"
                            conditionalLink={true}
                        /> : <Button
                            className="fat"
                            destination="/page"
                            onClick={postSubmitCaption}
                            children="Submit"
                            conditionalLink={true}
                        />
                        }

                    </Row>
                </div>
                {/*)}*/}
            </div>

            <br/>

            {/*Issue:*/}
            {/* This Bubble component is not optimal for rendering the information in real time --> look at the code in Waiting.jsx for reference.*/}
            {captionSubmitted ?
                <div> Waiting for everybody to submit their captions... <Bubbles items={waitingPlayers}/></div> : <></>}


            {/* {timeUp && host ?
                <Button
                    className="landing"
                    children="continue"
                    destination="/selection"
                    conditionalLink={true}
                />
                : <></>} */}
        </div>
    );
}