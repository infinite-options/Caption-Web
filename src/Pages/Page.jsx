import React, {useContext, useEffect, useState} from "react";
import {useHistory} from 'react-router-dom';

import {Row, Col, Card} from "reactstrap";
import Form from "../Components/Form";
import {Button} from "../Components/Button";
import "../Styles/Page.css";
import background from "../Assets/temp.png";
import "bootstrap/dist/css/bootstrap.min.css";
import * as ReactBootStrap from 'react-bootstrap';
//Documentation for the CountdownCircleTimer component
//https://github.com/vydimitrov/react-countdown-circle-timer#props-for-both-reactreact-native
import {CountdownCircleTimer} from "react-countdown-circle-timer";
import axios from "axios";
import {LandingContext} from "../App";
import Bubbles from "../Components/Bubbles";

export default function Page({ channel, channel_waiting, channel_joining}) {
    const { cookies, setCookie, userData, setUserData } = useContext(LandingContext);
    const history = useHistory();
    const [caption, setCaption] = useState("");
    const [captionSubmitted, setCaptionSubmitted] = useState(false);
    const [roundHasStarted, setRoundHasStarted] = useState(false);
    const [timeUp, setTimeUp] = useState(false);
    const [timerDuration, setTimerDuration] = useState(-1);
    const [waitingPlayers, setWaitingPlayers] = useState([]);
    const [roundStartTime, setRoundStartTime] = useState();

    const startPlayingURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/startPlaying/";
    const getTimerURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/gameTimer/";
    const getPlayersURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getPlayersRemainingToSubmitCaption/";
    const [loading, setLoading] = useState(false);
    const[total_round, setTotalRound] = useState([])
    let cookiesDone = false
    

    // Load cookies into userData state on first render
    useEffect(() => {
        const getCookies = (propsToLoad) => {
            let localCookies = cookies.userData
            let cookieLoad = {}

            for(let i = 0; i < propsToLoad.length; i++) {
                let propName = propsToLoad[i]
                let propValue = localCookies[propName]

                if(cookieLoad[propName] !== propValue)
                    cookieLoad[propName] = propValue
                //cookieLoad[propName] = localCookies[propName]
                
            }

            console.log("cookieLoad", cookieLoad)

            let newUserData = {
                ...userData,
                ...cookieLoad
            }
            console.log("newUserData", newUserData)

            setUserData(newUserData)
        }

        console.log("Getting Cookies")
        getCookies(["host", "roundNumber", "name", "alias", "email", "zipCode", "playerUID", "rounds", "roundDuration", "code", "deckTitle", "deckSelected", "imageURL", "scoreboardInfo", "isApi", "googlePhotos"])
        console.log("Got Cookies")

        // getCookies(["host", "roundNumber", "name", "alias", "email", "zipCode", "playerUID", "rounds", "code", "roundDuration", "deckTitle", "deckSelected", "imageURL"])

        // roundtime = userData.roundDuration
    }, [])



    const pub = (playerCount) => {
        console.log('In pub function with playerCount == ', playerCount);
        channel.publish({data: {playersLeft: playerCount, userWhoVoted: userData.alias}});
    };


    useEffect(() => {

        async function pageAsyc(){
            /**
             * Mayukh: I don't know why this works, but I am sure that the getTimer endpoint must be called after startPlaying.
             * By arranging the endpoint calls in this fashion, I am able to create a 'magical' delay that works in my favor.
             */

            if (userData.host) {
                // Host logs start of new round/time started in backend
                await axios.get(startPlayingURL + userData.code + "," + userData.roundNumber).then((res) => {
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
            console.log('In Page.jsx: code = ', userData.code, ' roundNumber = ', userData.roundNumber, ` fullURL = ${getTimerURL + userData.code + "," + userData.roundNumber}`);
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
                    if (userData.host)
                        channel_joining.publish({data: {roundNumber: userData.roundNumber, path: window.location.pathname}});
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
    }, [waitingPlayers, userData.code, cookiesDone]);



     useEffect(() => 
     console.log('Currently in Pages', "Alias:", userData.alias, "Current Round: ", userData.roundNumber), 
     []);


    
    async function postSubmitCaption() {
        if(caption === "" && !timeUp){
            alert("Please enter a caption.")
            return
        }
        const getURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getAllSubmittedCaptions/";

        /**
         * Issue:
         * The user should not be able to select/vote for their own caption.
         * Should be easy --> match internal state with info in the endpoint result.
         */
        await axios.get(getURL + userData.code + "," + userData.roundNumber).then((res) => {
            console.log('page_get_res before post = ', res);
        });

        setCaptionSubmitted(true);
        setLoading(true)
        const postURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/submitCaption";
        const payload = {
            caption: caption,
            game_code: userData.code.toString(),
            round_number: userData.roundNumber.toString(),
            user_uid: userData.playerUID.toString()
        }

        await axios.post(postURL, payload).then((res) => {
            console.log('POST Submit Caption', res);
        });

        await axios.get(getURL + userData.code + "," + userData.roundNumber).then((res) => {
            console.log('page_get_res after = ', res);
        });

        console.log('payload = ', payload);

        await axios.get(getPlayersURL + userData.code + "," + userData.roundNumber).then((res) => {
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

                <h1>
                    {userData.deckTitle}
                </h1>
                <br></br>
                <h3>Round: {userData.roundNumber}/{userData.rounds}</h3>
                {/* <p>URL: {userData.imageURL}</p>
                <p>RoundDuration: {userData.roundDuration}</p> */}
                <br></br>
                
                <img className="centerPic" src={userData.imageURL} alt="Loading Image...."/>

                <br></br>
                <br></br>

                <div>
                    {captionSubmitted ?
                    <></> : 
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

                    {/* <Row> */}
                <div 
                    style = {{
                        display: 'flex', 
                        justifyContent: 'center', 
                        paddingBottom: '20px', 
                       }}
                 >
                        <div style={{
                                background: "yellow",
                                borderRadius: "30px",
                                width: "60px",
                            }}
                        >
                            {/* TO DO: prevent users from refreshing to get new 30 sec*/}
                            {userData.roundDuration !== undefined ?
                             <CountdownCircleTimer
                                    background="blue"
                                    size={60}
                                    strokeWidth={5}
                                    isPlaying
                                    duration={userData.roundDuration}
                                    // duration={userData.roundDuration}
                                    colors="#000000"
                                    onComplete={() => {
                                        toggleTimeUp()
                                        //postSubmitCaption()
                                    }}
                                >
                                    {({remainingTime}) => {

                                            if (remainingTime === 0)
                                                pub(0);
                                            return (<div className="countdownText">{remainingTime}</div>);
                                        }
                                    }
                            </CountdownCircleTimer> : <></>}

                            
                            
                            {/* {updateComplete !== "" ? <CountdownCircleTimer
                                    background="red"
                                    size={60}
                                    strokeWidth={5}
                                    isPlaying
                                    duration={userData.roundDuration}
                                    colors="#000000"
                                    onComplete={() => {
                                        toggleTimeUp()
                                        //postSubmitCaption()
                                    }}
                                >
                                    {({remainingTime}) => {

                                            if (remainingTime === 0)
                                                pub(0);
                                            return (<div className="countdownText">{remainingTime}</div>);
                                        }
                                    }
                            </CountdownCircleTimer> : <></>} */}
                        </div>
                </div>
                        {/* <span style={{marginLeft: "60px"}}></span>
                        <br></br>{" "} */}

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

                    {/* </Row> */}
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