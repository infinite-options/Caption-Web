import React, {useContext, useEffect, useState} from "react";
import Pic from "../Assets/sd.jpg";
import Countdown from "react-countdown";
import {Row, Col, Card} from "reactstrap";
import Form from "../Components/Form";
import {Button} from "../Components/Button";
// import "../Styles/Scoreboard.css";
import "../Styles/Page.css";
import background from "../Assets/temp.png";

//Documentation for the CountdownCircleTimer component
//https://github.com/vydimitrov/react-countdown-circle-timer#props-for-both-reactreact-native
import {CountdownCircleTimer} from "react-countdown-circle-timer";
import axios from "axios";
import {LandingContext} from "../App";
import Bubbles from "../Components/Bubbles";

export default function Page({setImageURL, setRounds, channel}) {
    const {code, roundNumber, host, playerUID, imageURL} = useContext(LandingContext);

    const [caption, setCaption] = useState("");
    // const [imageSrc, setImageSrc] = useState("");

    /**
     * Boolean State to keep track of gameplay
     */
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
    const getImageInRound = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getImageInRound/";


    const handleCaptionChange = (newCaption) => {
        setCaption(newCaption);
    };

    function countdownComplete() {
        setCaptionSubmitted(true);
    }

    const pub = (playerCount) => {
        console.log('In pub function');
        channel.publish({data: {playersLeft: playerCount}});
    };

    // function transition() {
    //     window.location.href = "/selection";
    //     //this is not good because all internal state gets wiped whenever the page reloads
    // }

    useEffect(() => {

        setTimeout(function () {


            /**
             * Mayukh: I don't know why this works, but I am sure that the getTimer endpoint must be called after startPlaying.
             * By arranging the endpoint calls in this fashion, I am able to create a 'magical' delay that works in my favor.
             */

            if (host) {
                /**
                 * Axios.Get() #1
                 * Start the round
                 */
                axios.get(startPlayingURL + code + "," + roundNumber).then((res) => {
                    console.log(res);
                    setRoundStartTime(res.data.round_start_time);
                    setRoundHasStarted(true);
                })

                /**
                 * In the host I need to call --> getImageinRound
                 */

                axios.get(getImageInRound + code + "," + roundNumber).then((res) => {
                    console.log(res);
                    // setImageSrc(res.data.image_url);
                    setImageURL(res.data.image_url);
                })


            }


            /**
             * Mayukh: This is officially the worst way to synchronize any asynchronous axios code.
             */
            setTimeout(function () {
                /**
                 * Axios.Get() #4
                 * Determine the amount of time left on the countdown timer.
                 *
                 * s = the second at which the round has started
                 * c = the second at which the clock is currently on
                 * d = the seconds for the duration of the round
                 */
                console.log('In Page.jsx: code = ', code, ' roundNumber = ', roundNumber);
                axios.get(getTimerURL + code + "," + roundNumber).then((res) => {
                    console.log(res);

                    setRounds(res.data.total_number_of_rounds);

                    /**
                     * This c variable records the value of the seconds within the 'server clock'
                     * @type {number}
                     */
                    let serverClock = parseInt(res.data.current_time.substring(res.data.current_time.length - 2));

                    /**
                     * This c variable records the value of the seconds within the 'client clock'
                     * @type {number}
                     */
                    let clientClock = new Date().getSeconds();

                    if(res.data.round_started_at != undefined){
                    var c = serverClock;
                    console.log("current second = " + c);
                    var s = parseInt(res.data.round_started_at.substring(res.data.round_started_at.length - 2));
                    console.log("started second = " + s);
                    var d = parseInt(res.data.round_duration.substring(res.data.round_duration.length - 2));
                    console.log("round duration = " + d);
                    setTimerDuration(d - determineLag(c, s));
                    console.log(timerDuration);
                    }
                })


                // if (imageURL === "") {
                if(!host){
                    /**
                     * Axios.Get() #2
                     * Receive the image url
                     */
                    axios.get(getImageURL + code + "," + roundNumber).then((res) => {
                        console.log(res);
                        // setImageSrc(res.data.image_url);
                        setImageURL(res.data.image_url);
                    })
                }
            }, 2000)
        }, 500)

        async function subscribe() 
        {
            await channel.subscribe(newVote => {
                console.log("A comment was received ", newVote);
                if (newVote.data.playersLeft == 0) {
                    setTimeUp(true);
                }
            });
        }
        
        subscribe();
    
        return function cleanup() {
            channel.unsubscribe();
        };
    }, []);


    useEffect(() => {
        setTimeout(function () {

            if (captionSubmitted) {
                /**
                 * Axios.Get() #3
                 * Recieve the waiting players
                 */
                axios.get(getPlayersURL + code + "," + roundNumber).then((res) => {
                    console.log(res);
                    const readyForNextRound = res.data.players.length == 0;
                    for (var i = 0; i < res.data.players.length; i++) {
                        waitingPlayers[i] = res.data.players[i].user_alias;
                    }
                    console.log("The waiting players array: " + waitingPlayers);
                    if (readyForNextRound)
                        setMoveOn(true);
                })
            }
        }, 2000);
    });

    function determineLag(current, start) {
        if (current - start >= 0) {
            return current - start;
        } else {
            return current + (60 - start);
        }
    }


    async function postSubmitCaption() {
        setCaptionSubmitted(true);
        const postURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/submitCaption";
        const payload = {
            caption: caption,
            game_code: code.toString(),
            round_number: roundNumber.toString(),
            user_uid: playerUID.toString()
        }

        await axios.post(postURL, payload).then((res) => {
            console.log(res);
        })

        axios.get(getPlayersURL + code + "," + roundNumber).then((res) => {
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
                    {captionSubmitted ? <></> : <Form
                        className="input2"
                        field="Enter your caption here"
                        onHandleChange={handleCaptionChange}
                    />
                    }
                    <br/>

                    <Row>
                        <span style={{marginLeft: "50px"}}></span>
                        <div
                            style={{
                                background: "yellow",
                                borderRadius: "30px",
                                width: "60px",
                            }}
                        >
                            {timerDuration != -1 ? <CountdownCircleTimer
                                background="red"
                                size={60}
                                strokeWidth={5}
                                isPlaying
                                duration={timerDuration}
                                colors="#000000"
                                onComplete={toggleTimeUp}
                            >
                                {({remainingTime}) => (
                                    <div className="countdownText">{remainingTime}</div>
                                )}
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


            {timeUp ?
                <Button
                    className="landing"
                    children="continue"
                    destination="/selection"
                    conditionalLink={true}
                />
                : <></>}
        </div>
    );
}
