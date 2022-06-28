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


export default function Scoreboard({channel_host, channel_all, channel_waiting, channel_joining}) {
    const {code, roundNumber, imageURL, rounds, host, playerUID, gameUID, alias, setScoreboardInfo} = useContext(LandingContext);
    const history = useHistory();
    console.log('code = ', code, ', playerUID = ', playerUID);

    const [toggleArr, setToggleArr] = useState([]);
    const [playersArr, setPlayersArr] = useState([]);
    const [selectedCaption, setSelectedCaption] = useState("");

    const [localUserVoted, setLocalUserVoted] = useState(false);
    const [everybodyVoted, setEverybodyVoted] = useState(false);
    const [SelectedMyCaption, setSelectedMyCaption] = useState(false);
    const [waitingOnPlayers, setwaitingOnPlayers] = useState([]);
    const [timerDuration, setTimerDuration] = useState(-1);
    const [timeLeft, setTimeLeft] = useState(Number.POSITIVE_INFINITY);

    const pub_host = (playerCount) => {
        console.log('in pub_host');
        channel_host.publish({data: {playersLeft: playerCount, userWhoVoted: alias}});
    };

    const pub_all = () => {
        channel_all.publish({data: {everybodyVoted: true}});
    };

    function determineLag(current, start) {
        if (current - start >= 0) {
            return current - start;
        } else {
            return current + (60 - start);
        }
    }

    useEffect(() => {
        const getURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getAllSubmittedCaptions/";
        // const getPlayersURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getPlayersRemainingToSubmitCaption/";
        const getPlayersWhoHaventVotedURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getPlayersWhoHaventVoted/";

        console.log('rounds = ', rounds, ', roundNumber = ', roundNumber);

        async function idontknow() {
            if (host) {
                /**
                 * Axios.Get() #1
                 * Start the round
                 */
                const startPlayingURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/startPlaying/";
                await axios.get(startPlayingURL + code + "," + roundNumber);
            }
            
            /**
             * Issue:
             * The user should not be able to select/vote for their own caption.
             * Should be easy --> match internal state with info in the endpoint result.
             */
            
            // axios.get(getPlayersWhoHaventVotedURL + code + "," + roundNumber).then((res) => {
            //     console.log("notVotedRes: " , res);
            //     const totalPlayers = [];
            //     for (var i = 0; i < res.data.players.length; i++) {
            //         totalPlayers.push(res.data.players[i].user_alias);
            //     }
            //     console.log('totalPlayers === ', totalPlayers);
            //     setwaitingOnPlayers(totalPlayers);
            // })

            console.log('roundNumber = ', roundNumber, ` and I am ${host ? '' : 'not'} the host`);
            await axios.get(getURL + code + "," + roundNumber).then((res) => {
                console.log('selection response: ', res);
                // res.data.scoreboard.sort((a, b) => (b.score===a.score ? b.game_score - a.game_score : b.score - a.score));
                // if (res.data.players.length <= 1) {
                //     console.log('Test-phase1: Publishing to host');
                //     pub_host(0);
                // }
                console.log('players_response = ', res.data.players);
                const temp_players_arr = [];
                for (let i = 0; i < res.data.players.length; i++){
                    if (res.data.players[i].round_user_uid !== gameUID) // "this was playerUID before I changed it" - Loveleen Now it shows all captions
                        temp_players_arr.push(res.data.players[i]);
                    if (res.data.players[i].round_user_uid !== playerUID){
                        console.log("Made it before disabling");
                        // document.getElementsByClassName("fat").disabled = true;
                        console.log("Made it after disabling");
                    }
                    
                }
                // const temp = playersArr.slice(0, playersArr.length)
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }
        shuffleArray(temp_players_arr);
        console.log("temp: ", temp_players_arr)

                setPlayersArr(temp_players_arr);
                if (res.data.players.length <= 1)
                {
                    async function noPlayersThenSubmit()
                    {
                        if (res.data.players[0].round_user_uid != playerUID) {
                            console.log('default vote for user ', alias);
                            const getPlayersWhoHaventVotedURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getPlayersWhoHaventVoted/";
                            const postURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/voteCaption";
        
                            const payload = {
                                caption: res.data.players[0].caption,
                                game_code: code.toString(),
                                round_number: roundNumber.toString()
                            };

                            await axios.post(postURL, payload).then((res) => {
                                console.log(res);
                            });
                            await axios.get(getPlayersWhoHaventVotedURL + code + "," + roundNumber).then(res => console.log('pwhv response = ', res.data));
                        } else
                            pub_host(0);
                    }

                    if (res.data.players.length == 1){
                        noPlayersThenSubmit();
                    }else if(host){
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

            const getTimerURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/gameTimer/";
            var flag = true;
            while(flag) {
                await axios.get(getTimerURL + code + "," + roundNumber).then((res) => {
                    let serverClock = parseInt(res.data.current_time.substring(res.data.current_time.length - 2));
                    if (res.data.round_started_at != undefined) {
                        var c = serverClock;
                        var s = parseInt(res.data.round_started_at.substring(res.data.round_started_at.length - 2));
                        const d_secs = parseInt(res.data.round_duration.substring(res.data.round_duration.length - 2));
                        const d_mins = parseInt(res.data.round_duration.substring(res.data.round_duration.length - 4, res.data.round_duration.length - 2));
                        var d = d_mins * 60 + d_secs;
                        console.log("setTimerDuration: ", d - determineLag(c, s));
                        setTimerDuration(d - determineLag(c, s));

                        console.log(timerDuration);
                        flag = false;
                    }
                })
                    .catch(err => console.log("timer failed"))
            }
        }

        idontknow();

        console.log("Toggle Arr: " + toggleArr);

        async function subscribe_host() 
        {
            await channel_host.subscribe(newVote => {
                console.log('Countdown on voting screen: PlayersLeft = ', newVote.data.playersLeft);
                console.log('Test-phase2: playerCount = ', newVote.data.playersLeft);
                if (newVote.data.playersLeft == 0) {
                    const blah = async () => {
                        const getUpdateScoresURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/updateScores/";
                        if (host)
                            await axios.get(getUpdateScoresURL + code + "," + roundNumber);
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
                        console.log('test 1');
                        await axios.get(getScoreBoardURL + code + "," + roundNumber).then((res) => {
                            console.log('scoreboard-response = ', res.data.scoreboard);
                            res.data.scoreboard.sort((a, b) => (b.score===a.score ? b.game_score - a.game_score : b.score - a.score));
                            setScoreboardInfo(res.data.scoreboard);
                        });
                        console.log('test 3');
                        if (rounds <= roundNumber)
                            history.push('/endgame');
                        else
                            history.push('/scoreboard');
                    }
                    // else {
                    //     const newWaitingOnPlayers =[];
                    //     for(const players of waitingOnPlayers){
                    //         if (players !== ping.data.userWhoVoted){
                    //             newWaitingOnPlayers.push(players);
                                
                    //         }
                    //     }
                    //     setwaitingOnPlayers(newWaitingOnPlayers);
                    // }
                };
                getNewScoreboard();
            })
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

        if (host) {
            subscribe1();
            subscribe_host();
        }
        
        subscribe_all();
    
        return function cleanup() {
            channel_host.unsubscribe();
            channel_all.unsubscribe();
            channel_waiting.unsubscribe();
        };
    }, []);
    console.log('timerDuration: ', timerDuration);

    function changeToggle(index) {
        console.log("Called: " + index);
        for (var i = 0; i < toggleArr.length; i++) {
            toggleArr[i] = false;
        }
        if(playersArr[index].round_user_uid !== playerUID) {
            toggleArr[index] = true;
            console.log('feshfjksef: playersArr[index] = ', playersArr[index]);
            setSelectedCaption(playersArr[index].caption);
        }

        console.log("Result: " + toggleArr);
        // setToggleState(index);
    }

    useEffect(() => console.log('selected-Caption: ', selectedCaption), [selectedCaption]);

    async function postVote() {
        console.log('postVote called');

        setLocalUserVoted(true);

        const postURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/voteCaption";

        const payload = {
            caption: selectedCaption === '' ? null : selectedCaption,
            game_code: code.toString(),
            round_number: roundNumber.toString()
        };

        console.log('user ', alias, ' is posting vote with payload: ', payload);
        await axios.post(postURL, payload).then((res) => {
            console.log(res);
        });

        const getPlayersWhoHaventVotedURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getPlayersWhoHaventVoted/";
        await axios.get(getPlayersWhoHaventVotedURL + code + "," + roundNumber).then((res) => {
            console.log('publishing with res.data.players_count = ', res.data.players_count);
            pub_host(res.data.players_count);
        });
    }

    useEffect(() => timerDuration === -1 ? '' : setTimeLeft(timerDuration), [timerDuration]);

    function renderCaptions() {
        var captions = [];
        console.log('temp.length = ', playersArr.length);
        for (var index = 0; index < playersArr.length; index++) {
            /**
             * The value of index continues to increment due to the loop,
             * so let's make a variable that does not change for the onClick function
             * @type {number}
             */
            let localIndex = index;
            let isMyButton = playersArr[index].round_user_uid === playerUID;


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
        console.log('captions = ', captions);
        return <div style = {{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>{captions}</div>;
    }

    useEffect(() => {
        if (timeLeft > 0 && timeLeft !== Number.POSITIVE_INFINITY)
            setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        else if (timeLeft === 0 && !localUserVoted)
            postVote();
    }, [timeLeft]);

    useEffect(() => {
        console.log('timeLeft = ', timeLeft);
    }, [timeLeft]);

    return (
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
            <h1>Name of Deck</h1>
            <br></br>

            <h4>Pick Your Favorite Caption</h4>
            <br></br>
            {/*<img className="img2" src={Pic} />*/}
            <img style={{
                objectFit: "cover",
                height: "325px",
                width: "325px",
                borderRadius: "50px",
            }} src={imageURL}/>

            <br></br>
            <br></br>

            {renderCaptions()}


            {/*{everybodyVoted ?*/}
            {/*    <Button*/}
            {/*        className="fat"*/}
            {/*        destination="/scoreboard"*/}
            {/*        children="Continue to Scoreboard"*/}
            {/*        conditionalLink={true}*/}
            {/*    />*/}
            {/*    :  <Button*/}
            {/*        className="fat"*/}
            {/*        destination="/selection"*/}
            {/*        children="Please wait for everybody to submit their votes"*/}
            {/*        conditionalLink={true}*/}
            {/*    />}*/}

            {localUserVoted ?
                <></>
                : selectedCaption ?
                    <Button style = {{border: '10px solid red'}} className="fat" children="Vote" onClick={postVote}
                          conditionalLink={true}/>
                    : <></>
            }

            <div
                style = {{display: 'flex', justifyContent: 'center', paddingBottom: '20px', paddingTop: selectedCaption ? '20px' : '0px'}}
            >
                <div
                    style={{
                        background: "yellow",
                        borderRadius: "30px",
                        width: "60px",
                    }}
                >
                    {timerDuration != -1 ?
                    <CountdownCircleTimer
                        background="red"
                        size={60}
                        strokeWidth={5}
                        isPlaying
                        duration={timerDuration}
                        colors="#000000"
                        onComplete={() => {
                            // if (host)
                            //     pub_host(0);
                        }}
                    >
                        {({remainingTime}) => {
                                return (<div className="countdownText">{remainingTime}</div>);
                            }
                        }
                    </CountdownCircleTimer> : <></>}
                </div>
            </div>
        </div>
    );
};