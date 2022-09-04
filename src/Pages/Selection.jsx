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

    const [toggleArr, setToggleArr] = useState([]);
    const [playersArr, setPlayersArr] = useState([]);
    const [selectedCaption, setSelectedCaption] = useState("");
    const [localUserVoted, setLocalUserVoted] = useState(false);
    const [timerDuration, setTimerDuration] = useState(-1);
    const [timeLeft, setTimeLeft] = useState(Number.POSITIVE_INFINITY);
    const [loading, setLoading] = useState(false);

    // Determine if we should display landing page (true) or loading icon (false)
    const [displayHtml, setDisplayHtml] = useState(false)


    // Load cookies into userData state on first render
    useEffect(() => {
        // Check if userData is empty (after refresh/new user)
        if(userData.host === "" || userData.roundNumber === "" || userData.name === "" || userData.alias === "" || userData.playerUID === "" || userData.rounds === "" || userData.roundDuration === "" || userData.code === "" || userData.deckTitle === "" || userData.imageURL === "" || userData.scoreBoardInfo === "") {
            getCookies(["host", "roundNumber", "name", "alias", "deckSelected", "playerUID", "rounds", "roundDuration", "code", "deckTitle", "imageURL", "scoreboardInfo", "isApi"], setDisplayHtml)
        }
        else
            setDisplayHtml(true)
    }, [])

    const pub_host = (playerCount) => {
        // console.log('in pub_host');
        channel_host.publish({data: {playersLeft: playerCount, userWhoVoted: userData.alias}});
    };


    const pub_all = () => {
        channel_all.publish({data: {everybodyVoted: true}});
    };



    useEffect(() => {
        const getURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getAllSubmittedCaptions/";
        const getPlayersWhoHaventVotedURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getPlayersWhoHaventVoted/";

        // console.log('rounds = ', rounds, ', roundNumber = ', roundNumber);

        async function idontknow() {
            if (userData.host) {
                // Host logs start of new round/start time started in backend
                const startPlayingURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/startPlaying/";
                await axios.get(startPlayingURL + userData.code + "," + userData.roundNumber);
            }
            

            // console.log('roundNumber = ', roundNumber, ` and I am ${host ? '' : 'not'} the host`);

           
            await axios.get(getURL + userData.code + "," + userData.roundNumber).then((res) => {
                // console.log('GET Get All Submitted Caption', res);
                const temp_players_arr = [];

                for (let i = 0; i < res.data.players.length; i++){
                    if (res.data.players[i].round_user_uid !== userData.gameUID)
                        temp_players_arr.push(res.data.players[i]);
                    if (res.data.players[i].round_user_uid !== userData.playerUID){
                        // console.log("Made it before disabling");
                        // document.getElementsByClassName("fat").disabled = true;
                        // console.log("Made it after disabling");
                    }
                    
                }

                function shuffleArray(array) {
                    for (let i = array.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [array[i], array[j]] = [array[j], array[i]];
                    }
                }

                shuffleArray(temp_players_arr);
                // console.log("temp: ", temp_players_arr)

                setPlayersArr(temp_players_arr);

                if (res.data.players.length <= 1)
                {
                    async function noPlayersThenSubmit()
                    {
                        if (res.data.players[0].round_user_uid !== userData.playerUID) {
                            console.log('default vote for user ', userData.alias);
                            const getPlayersWhoHaventVotedURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getPlayersWhoHaventVoted/";
                            const postURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/voteCaption";
        
                            const payload = {
                                user_id: userData.playerUID,
                                caption: res.data.players[0].caption,
                                game_code: userData.code.toString(),
                                round_number: userData.roundNumber.toString()
                            };

                            await axios.post(postURL, payload).then((res) => {
                                console.log(res);
                            });
                            await axios.get(getPlayersWhoHaventVotedURL + userData.code + "," + userData.roundNumber).then(res => console.log('pwhv response = ', res.data));
                        } else
                            pub_host(0);
                    }

                    if (res.data.players.length === 1){
                        noPlayersThenSubmit();
                    } else if(userData.host){
                        pub_host(0);
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

            const getTimerURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/gameTimer/";

        }

        idontknow();

        console.log("Toggle Arr: " + toggleArr);

        async function subscribe_host() 
        {
            await channel_host.subscribe(newVote => {
                // console.log('Countdown on voting screen: PlayersLeft = ', newVote.data.playersLeft);
                // console.log('Test-phase2: playerCount = ', newVote.data.playersLeft);
                if (newVote.data.playersLeft === 0) {
                    const blah = async () => {
                        const getUpdateScoresURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/updateScores/";
                        if (userData.host)
                            await axios.get(getUpdateScoresURL + userData.code + "," + userData.roundNumber);
                        pub_all();
                    }

                    blah();
                }
            });
        }

        async function subscribe_all()
        {
            await channel_all.subscribe(ping => {
                const getNewScoreboard = async () => {
                    if (ping.data.everybodyVoted)
                    {
                        const getScoreBoardURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getScoreBoard/";

                        await axios.get(getScoreBoardURL + userData.code + "," + userData.roundNumber).then((res) => {
                            console.log('GET score board ', res);

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

        
        async function subscribe1() 
        {
            await channel_waiting.subscribe(newPlayer => {
                async function getPlayers () {
                    // console.log("Made it in getPlayers Func");
                    channel_joining.publish({data: {roundNumber: userData.roundNumber, path: window.location.pathname}})
                }
        
                getPlayers();
            });
        }


        if (userData.host) {
            subscribe1();
            subscribe_host();
        }
        
        subscribe_all();
    
        return function cleanup() {
            channel_host.unsubscribe();
            channel_all.unsubscribe();
            channel_waiting.unsubscribe();
        };
    }, [userData.code]);


    function changeToggle(index) {
        console.log("Called: " + index);
        for (var i = 0; i < toggleArr.length; i++) {
            toggleArr[i] = false;
        }
        if(playersArr[index].round_user_uid !== userData.playerUID) {
            toggleArr[index] = true;
            console.log('feshfjksef: playersArr[index] = ', playersArr[index]);
            setSelectedCaption(playersArr[index].caption);
        }

        console.log("Result: " + toggleArr);
    }


    async function postVote() {
        console.log('postVote called');

        setLocalUserVoted(true);

        const postURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/voteCaption";
        const payload = {
            user_id: userData.playerUID,
            caption: selectedCaption === '' ? null : selectedCaption,
            game_code: userData.code.toString(),
            round_number: userData.roundNumber.toString()
        };
        console.log('user ', userData.alias, ' is posting vote with payload: ', payload);

        await axios.post(postURL, payload).then((res) => {
            console.log("POST Vote Caption", res);
        });
        


        const getPlayersWhoHaventVotedURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getPlayersWhoHaventVoted/";
        await axios.get(getPlayersWhoHaventVotedURL + userData.code + "," + userData.roundNumber).then((res) => {
            console.log('publishing with res.data.players_count = ', res.data.players_count);
            pub_host(res.data.players_count);
        });
    }
    

    function renderCaptions() {
        var captions = [];
        
        // console.log('temp.length = ', playersArr.length);
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
        // console.log('captions = ', captions);
      
        return <div style = {{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>{captions}</div>;
    }



    useEffect(() => console.log('selected-Caption: ', selectedCaption), [selectedCaption]);


    // After we've set timerDuration, immediately set timeLeft (used to signal end of round)
    useEffect(() => timerDuration === -1 ? '' : setTimeLeft(timerDuration), [timerDuration]);


    useEffect(() => {
        if (timeLeft > 0 && timeLeft !== Number.POSITIVE_INFINITY)
            setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        else if (timeLeft === 0 && !localUserVoted) {
            console.log("Time ran out and user didn't vote")
            postVote()
            pub_all()
        }
            
    }, [timeLeft]);



    // useEffect(() => {
    //     // console.log('timeLeft = ', timeLeft);
    // }, [timeLeft]);



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