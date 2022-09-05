import React, {useContext, useEffect, useState} from "react";
import {useHistory} from 'react-router-dom';
import Pic from "../Assets/sd.jpg";
// import {Row, Col, Card} from "reactstrap";
import "../Styles/Scoreboard.css";
// import Report from "../Components/Report";
import {Button} from "../Components/Button";
import background from "../Assets/temp.png";
import axios from "axios";
// import Deck from "../Components/Deck";
import {LandingContext} from "../App";
import {CountdownCircleTimer} from "react-countdown-circle-timer";
import "bootstrap/dist/css/bootstrap.min.css";
import * as ReactBootStrap from 'react-bootstrap';
import { CookieHelper } from "../Components/CookieHelper"


export default function Scoreboard({channel_host, channel_all, channel_waiting, channel_joining}) {
    const { userData, setUserData, cookies, setCookie } = useContext(LandingContext);
    const { getCookies } = CookieHelper()
    const history = useHistory();

    // Hooks used in Selection
    const [toggleArr, setToggleArr] = useState([]);
    const [playersArr, setPlayersArr] = useState([]);
    const [selectedCaption, setSelectedCaption] = useState("");
    const [localUserVoted, setLocalUserVoted] = useState(false);
    const [timerDuration, setTimerDuration] = useState(-1);
    const [timeLeft, setTimeLeft] = useState(Number.POSITIVE_INFINITY);
    const [loading, setLoading] = useState(false);


    // Determine if we should display landing page (true) or loading icon (false)
    const [displayHtml, setDisplayHtml] = useState(false)


    // Endpoints used in Selection
    const getPlayersWhoHaventVotedURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getPlayersWhoHaventVoted/";
    const postVoteCaptionURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/voteCaption";
    const getAllSubmittedCaptionsURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getAllSubmittedCaptions/";
    const startPlayingURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/startPlaying/";
    const getScoreBoardURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getScoreBoard/";
    const getTimerURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/gameTimer/";
    const getUpdateScoresURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/updateScores/";



    // HOOK: useEffect()
    // DESCRIPTION: On first render, check if hooks are updated, load data from cookies if not
    useEffect(() => {
        // Check if userData is empty (after refresh/new user)
        if(userData.host === "" || userData.roundNumber === "" || userData.name === "" || userData.alias === "" || userData.playerUID === "" || userData.rounds === "" || userData.roundDuration === "" || userData.code === "" || userData.deckTitle === "" || userData.imageURL === "" || userData.scoreBoardInfo === "") {
            getCookies(["host", "roundNumber", "name", "alias", "deckSelected", "playerUID", "rounds", "roundDuration", "code", "deckTitle", "imageURL", "scoreboardInfo", "isApi"], setDisplayHtml)
        }
        else
            setDisplayHtml(true)
    }, [])



    // HOOK: useEffect()
    // DESCRIPTION: Gets voting options and subscribes to ably channels
    useEffect(() => {
        // FUNCTION: getCaptions()
        // DESCRIPTION: Gets captions for user to vote on. Transitions to next page if only one caption/player
        async function getCaptions() {
            // Host logs start of new round/start time started in backend
            if (userData.host) {
                await axios.get(startPlayingURL + userData.code + "," + userData.roundNumber);
            }
            
            await axios.get(getAllSubmittedCaptionsURL + userData.code + "," + userData.roundNumber).then((res) => {
                console.log('GET Get All Submitted Caption', res);

                const temp_players_arr = [];
                // Push response's submitted captions to temp_players_arr
                    // gameUID empty right now?
                for (let i = 0; i < res.data.players.length; i++){
                    if (res.data.players[i].round_user_uid !== userData.gameUID)
                        temp_players_arr.push(res.data.players[i]);
                }


                // Shuffle and save players array to temp_players_arr
                shuffleArray(temp_players_arr);
                setPlayersArr(temp_players_arr);


                // One or 0 players in game
                if (res.data.players.length <= 1)
                {
                    // FUNCTION: noPlayersThenSubmit()
                    // DESCRIPTION: Runs when no other players. Posts vote then gets players who haven't voted.
                    async function noPlayersThenSubmit()
                    {
                        if (res.data.players[0].round_user_uid !== userData.playerUID) {
                            console.log('Default vote for user ', userData.alias);
                            
                            const payload = {
                                user_id: userData.playerUID,
                                caption: res.data.players[0].caption,
                                game_code: userData.code.toString(),
                                round_number: userData.roundNumber.toString()
                            };

                            await axios.post(postVoteCaptionURL, payload).then((res) => {
                                console.log('POST voteCaption', res);
                            });

                            await axios.get(getPlayersWhoHaventVotedURL + userData.code + "," + userData.roundNumber).then(res => 
                                console.log('GET playersWhoHaventVoted', res)
                            );
                        } 
                        else
                            pub_playerVote(0);
                    }

                    if (res.data.players.length === 1){
                        noPlayersThenSubmit();
                    } else if(userData.host){
                        pub_playerVote(0);
                    }

                }

                /**
                 * Initialize the toggle array with the correct size and populate the array with all false values
                 */
                toggleArr.length = res.data.players.length;
                for (var i = 0; i < toggleArr.length; i++) {
                    toggleArr[i] = false;
                }
            })

            setLoading(true)
        }


        // FUNCTION: subscribeNewPlayer()
        // DESCRIPTION: Host listens for new players joining. If new players joined, post current round info to channel_joining for new player.
        async function subscribeNewPlayer() 
        {
            await channel_waiting.subscribe(newPlayer => {
                async function getPlayers () {
                    channel_joining.publish({data: {roundNumber: userData.roundNumber, path: window.location.pathname}})
                }
        
                getPlayers();
            });
        }


        // FUNCTION: subscribe_host()
        // DESCRIPTION: Listens on ably channel. If receives signal that all players voted, host gets updated scores from backend and publishes that everyone voted
        async function subscribe_host() 
        {
            await channel_host.subscribe(newVote => {
                if (newVote.data.playersLeft === 0) {
                    const hostPub = async () => {
                        if (userData.host)
                            await axios.get(getUpdateScoresURL + userData.code + "," + userData.roundNumber).then( res => {
                                console.log('GET updatedScores', res)
                            });
                        pub_everyoneVoted();
                    }

                    hostPub();
                }
            });
        }


        // FUNCTION: subscribe_all()
        // DESCRIPTION: If everyone voted, load scoreboard for current round
        async function subscribe_all()
        {
            await channel_all.subscribe(ping => {
                const getNewScoreboard = async () => {
                    if (ping.data.everybodyVoted)
                    {
                        await axios.get(getScoreBoardURL + userData.code + "," + userData.roundNumber).then((res) => {
                            console.log('GET score board ', res);

                            // Sort and save scoreboard to hooks/cookies
                            res.data.scoreboard.sort((a, b) => (
                                b.score === a.score ? b.game_score - a.game_score : b.score - a.score
                            ));
            
                            setUserData({
                                ...userData,
                                scoreboardInfo: res.data.scoreboard
                            })
                            setCookie("userData", {
                                ...cookies.userData,
                                "scoreboardInfo": res.data.scoreboard
                            })
                        });

                        if (userData.rounds <= userData.roundNumber)
                            history.push('/endgame');
                        else
                            history.push('/scoreboard');
                    }
                };

                getNewScoreboard();
            })
        }


        getCaptions();

        if (userData.host) {
            subscribeNewPlayer();
            subscribe_host();
        }
        
        subscribe_all();
    
        return function cleanup() {
            channel_host.unsubscribe();
            channel_all.unsubscribe();
            channel_waiting.unsubscribe();
        };
    }, [userData.code]);
    //}, [displayHtml]);


    // FUNCTION: changeToggle()
    // DESCRIPTION: Sets selected caption in hooks when clicked on
    function changeToggle(index) {
        console.log("In ChangeToggle(): " + index);
        for (var i = 0; i < toggleArr.length; i++) {
            toggleArr[i] = false;
        }
        if(playersArr[index].round_user_uid !== userData.playerUID) {
            toggleArr[index] = true;
            console.log('playersArr[index] = ', playersArr[index]);
            setSelectedCaption(playersArr[index].caption);
        }

        console.log("Result: " + toggleArr);
    }


    // FUNCTION: postVote()
    // DESCRIPTION: posts user's vote on clicking submit
    async function postVote() {
        console.log("In postVote()")
        setLocalUserVoted(true);

        // POST voteCaption
        const payload = {
            user_id: userData.playerUID,
            caption: selectedCaption === '' ? null : selectedCaption,
            game_code: userData.code.toString(),
            round_number: userData.roundNumber.toString()
        };
        await axios.post(postVoteCaptionURL, payload).then((res) => {
            console.log("POST voteCaption", res);
        });
        
        
        await axios.get(getPlayersWhoHaventVotedURL + userData.code + "," + userData.roundNumber).then((res) => {
            console.log('publishing with res.data.players_count = ', res.data.players_count);
            pub_playerVote(res.data.players_count);
        });
    }
    

    // FUNCTION: renderCaptions()
    // DESCRIPTION: renders captions as buttons
    function renderCaptions() {
        var captions = [];
        
        for (var index = 0; index < playersArr.length; index++) {
            /**
             * The value of index continues to increment due to the loop,
             * so let's make a variable that does not change for the onClick function
             * @type {number}
             */
            let localIndex = index;
            let isMyButton = playersArr[index].round_user_uid === userData.playerUID;


            captions.push(<div>
                <Button
                    isSelected={toggleArr[index]}
                    className= {isMyButton ? "cannotSelectBtn" : "selectionBtn1"}
                    children={playersArr[index].caption}
                    destination="/selection"
                    onClick={() => changeToggle(localIndex)}
                    conditionalLink={true}
                />
            </div>);
        }
      
        return <div style = {{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>{captions}</div>;
    }


    // FUNCTION: shuffleArray()
    // DESCRIPTION: shuffles inputted array 
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }


    // FUNCTION: pub_playerVote()
    // DESCRIPTION: publishes player's alias that just voted and number of players left that haven't voted
    const pub_playerVote = (playerCount) => {
        channel_host.publish({data: {playersLeft: playerCount, userWhoVoted: userData.alias}});
    };


    // FUNCTION: pub_everyoneVoted()
    // DESCRIPTION: publishes everybodyVoted status as true, move to next round
    const pub_everyoneVoted = () => {
        channel_all.publish({data: {everybodyVoted: true}});
    };


    // HOOK: useEffect()
    // DESCRIPTION: we've set timerDuration, immediately set timeLeft (used to signal end of round)
    useEffect(() => timerDuration === -1 ? '' : setTimeLeft(timerDuration), [timerDuration]);


    // HOOK: useEffect()
    // DESCRIPTION: Counts down time left until 0
    useEffect(() => {
        if (timeLeft > 0 && timeLeft !== Number.POSITIVE_INFINITY)
            setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        else if (timeLeft === 0 && !localUserVoted) {
            console.log("Time ran out and user didn't vote")
            postVote()

            pub_everyoneVoted()
        }
            
    }, [timeLeft]);


    // HOOK: useEffect()
    // DESCRIPTION: prints timeLeft on change
    useEffect(() => {
        console.log('timeLeft = ', timeLeft);
    }, [timeLeft]);



    return (
        displayHtml ?
            // Selection page HTML
            <div
                style={{
                    maxWidth: "375px",
                    height: "100%",
                    //As long as I import the image from my package strcuture, I can use them like so
                    backgroundImage: `url(${background})`,
                    // backgroundImage:
                    //   "url('https://images.unsplash.com/photo-1557683325-3ba8f0df79de?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTZ8fHxlbnwwfHx8fA%3D%3D&w=1000&q=80')",
                }}
            >
                <br></br>
                <h1>{userData.deckTitle}</h1>
                <br></br>

                <h4>Pick Your Favorite Caption</h4>
                <br></br>

                <img style={{
                    objectFit: "cover",
                    height: "325px",
                    width: "325px",
                    borderRadius: "50px",
                }} src={userData.imageURL}/>

                <br></br>
                <br></br>
                {/* {renderCaptions()} */}
                {loading ? (
                    renderCaptions()
                ):(
                    <ReactBootStrap.Spinner animation="border" role="status"/>
                )}

                {/* {loading ? (
                    localUserVoted ?
                    <></>
                    : selectedCaption ?
                        <Button style = {{border: '10px solid red'}} className="fat" children="Vote" onClick={postVote}
                            conditionalLink={true}/>
                        : <></>
                ) : (
                    <ReactBootStrap.Spinner animation="border" role="status"/>
                )} */}
                {localUserVoted ?
                    <></>
                    : selectedCaption ?
                        <Button style = {{border: '10px solid red'}} className="fat" children="Vote" onClick={postVote}
                            conditionalLink={true}/>
                        : <></>
                }
                
                
                <div style = {{
                    display: 'flex', 
                    justifyContent: 'center', 
                    paddingBottom: '20px', 
                    paddingTop: selectedCaption ? '20px' : '0px'}}
                >
                    <div style={{
                            background: "yellow",
                            borderRadius: "30px",
                            width: "60px",
                        }}
                    >
                        {userData.roundDuration !== ""  ? <CountdownCircleTimer
                                background="red"
                                size={60}
                                strokeWidth={5}
                                isPlaying
                                duration={userData.roundDuration}
                                colors="#000000"
                                
                            >
                                {({remainingTime}) => {
                                        return (<div className="countdownText">{remainingTime}</div>)
                                    }
                                }
                            </CountdownCircleTimer> : <></>
                        }
                    </div>
                </div>
            </div> :
            // Loading icon HTML
            <div>
                <h1>Loading game data...</h1>
                <ReactBootStrap.Spinner animation="border" role="status"/>
            </div>
    );
};