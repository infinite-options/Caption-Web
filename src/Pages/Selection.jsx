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

export default function Scoreboard({channel_host, channel_all, channel_waiting, channel_joining}) {
    const {code, roundNumber, imageURL, rounds, host, playerUID, gameUID, alias, photosFromAPI, roundDuration, deckTitle, setCode, setName, setEmail, setZipCode, setAlias, setRounds, setRoundDuration, setHost, setGameUID, setRoundNumber,setPlayerUID, setScoreboardInfo, setImageURL, setPhotosFromAPI, setDeckTitle, setDeckSelected, cookies, setCookiecookies, setCookie} = useContext(LandingContext);
    

    const [toggleArr, setToggleArr] = useState([]);
    const [playersArr, setPlayersArr] = useState([]);
    const [selectedCaption, setSelectedCaption] = useState("");
    const [localUserVoted, setLocalUserVoted] = useState(false);
    const [timerDuration, setTimerDuration] = useState(-1);
    const [timeLeft, setTimeLeft] = useState(Number.POSITIVE_INFINITY);
    const [loading, setLoading] = useState(false);

    const history = useHistory();


    // Load Cookies
    console.log("Selection Cookies", cookies)
    loadCookies()

    const pub_host = (playerCount) => {
        // console.log('in pub_host');
        channel_host.publish({data: {playersLeft: playerCount, userWhoVoted: alias}});
    };


    const pub_all = () => {
        channel_all.publish({data: {everybodyVoted: true}});
    };



    useEffect(() => {
        const getURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getAllSubmittedCaptions/";
        const getPlayersWhoHaventVotedURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getPlayersWhoHaventVoted/";

        // console.log('rounds = ', rounds, ', roundNumber = ', roundNumber);

        async function idontknow() {
            if (host) {
                // Host logs start of new round/start time started in backend
                const startPlayingURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/startPlaying/";
                await axios.get(startPlayingURL + code + "," + roundNumber);
            }
            

            // console.log('roundNumber = ', roundNumber, ` and I am ${host ? '' : 'not'} the host`);

           
            await axios.get(getURL + code + "," + roundNumber).then((res) => {
                // console.log('GET Get All Submitted Caption', res);
                const temp_players_arr = [];

                for (let i = 0; i < res.data.players.length; i++){
                    if (res.data.players[i].round_user_uid !== gameUID)
                        temp_players_arr.push(res.data.players[i]);
                    if (res.data.players[i].round_user_uid !== playerUID){
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
                        if (res.data.players[0].round_user_uid !== playerUID) {
                            console.log('default vote for user ', alias);
                            const getPlayersWhoHaventVotedURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getPlayersWhoHaventVoted/";
                            const postURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/voteCaption";
        
                            const payload = {
                                user_id: playerUID,
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

                    if (res.data.players.length === 1){
                        noPlayersThenSubmit();
                    } else if(host){
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

            // OLD TIMER IMPLEMENTATION: CALCULATES LAG BETWEEN HOST AND USER
            // var flag = true;
            // // Loop continuosly until we receive the game timer information
            // while(flag) {
            //     await axios.get(getTimerURL + code + "," + roundNumber).then((res) => {
            //         let serverClock = parseInt(res.data.current_time.substring(res.data.current_time.length - 2));

            //         // Determine lag between round started time and current time, log the leftover duration into timerDuration
            //         if (res.data.round_started_at != undefined) {
            //             var c = serverClock;
            //             var s = parseInt(res.data.round_started_at.substring(res.data.round_started_at.length - 2));
            //             const d_secs = parseInt(res.data.round_duration.substring(res.data.round_duration.length - 2));
            //             const d_mins = parseInt(res.data.round_duration.substring(res.data.round_duration.length - 4, res.data.round_duration.length - 2));
            //             var d = d_mins * 60 + d_secs;
            //             console.log("setTimerDuration: ", d - determineLag(c, s));
            //             setTimerDuration(d - determineLag(c, s));

            //             console.log('Timer Duration', timerDuration);
            //             flag = false;
            //         }
            //     })
            //         .catch(err => console.log("timer failed"))
            // }

            // Instead of determining lag, give each user the full round duration
            // await axios.get(getTimerURL + code + "," + roundNumber).then((res) => {
            //     console.log('GetTimerURL', res.data)

            //     // Convert round duration format (min:sec) into seconds
            //     const duration_secs = parseInt(res.data.round_duration.substring(res.data.round_duration.length - 2));
            //     const duration_mins = parseInt(res.data.round_duration.substring(res.data.round_duration.length - 4, res.data.round_duration.length - 2));
            //     let duration = duration_mins * 60 + duration_secs;

            //     console.log('Duration Seconds', duration_secs)
            //     console.log('Duration Minutes', duration_mins)
            //     console.log('Duration Total', duration)


            //     if(res.data.round_started_at !== undefined) {
            //         setTimerDuration(duration)
            //     }
            // })
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

                        await axios.get(getScoreBoardURL + code + "," + roundNumber).then((res) => {
                            console.log('GET score board ', res);

                            res.data.scoreboard.sort((a, b) => (
                                b.score === a.score ? b.game_score - a.game_score : b.score - a.score
                            ));

                            setScoreboardInfo(res.data.scoreboard);
                            setCookie("scoreboardInfo", res.data.scoreboard)
                        });

                        if (rounds <= roundNumber)
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
    }


    async function postVote() {
        console.log('postVote called');

        setLocalUserVoted(true);

        const postURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/voteCaption";
        const payload = {
            user_id: playerUID,
            caption: selectedCaption === '' ? null : selectedCaption,
            game_code: code.toString(),
            round_number: roundNumber.toString()
        };
        console.log('user ', alias, ' is posting vote with payload: ', payload);

        await axios.post(postURL, payload).then((res) => {
            console.log("POST Vote Caption", res);
        });
        


        const getPlayersWhoHaventVotedURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getPlayersWhoHaventVoted/";
        await axios.get(getPlayersWhoHaventVotedURL + code + "," + roundNumber).then((res) => {
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
        // console.log('captions = ', captions);
      
        return <div style = {{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>{captions}</div>;
    }

    // Loads cookies if defined previously
     function loadCookies() {
        if(cookies.code !== undefined)
            setCode(cookies.code)
        if(cookies.name !== undefined)
            setName(cookies.name)
        if(cookies.email !== undefined)
            setEmail(cookies.email)
        if(cookies.zipCode !== undefined)
            setZipCode(cookies.zipCode)
        if(cookies.alias !== undefined)
            setAlias(cookies.alias)
        if(cookies.gameUID !== undefined)
            setGameUID(cookies.gameUID)
        if(cookies.rounds !== undefined)
            setRounds(cookies.rounds)
        if(cookies.roundDuration !== undefined)
            setRoundDuration(cookies.roundDuration)
        if(cookies.host !== undefined && typeof host !== 'boolean')
            setHost(JSON.parse(cookies.host))
        if(cookies.roundNumber !== undefined) 
            setRoundNumber(parseInt(cookies.roundNumber))
        if(cookies.playerUID !== undefined)
            setPlayerUID(cookies.playerUID)
        if(cookies.imageURL !== undefined)
            setImageURL(cookies.imageURL)
        if(cookies.scoreboardInfo !== undefined)
            setScoreboardInfo(cookies.scoreboardInfo)
        if(cookies.photosFromAPI !== undefined)
            setPhotosFromAPI(cookies.photosFromAPI)
        if(cookies.deckSelected !== undefined)
            setDeckSelected(cookies.deckSelected)
        if(cookies.deckTitle !== undefined)
            setDeckTitle(cookies.deckTitle)
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
            //pub_all()
        }
            
    }, [timeLeft]);


    useEffect(() => {
        // console.log('timeLeft = ', timeLeft);
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
            <h1>{deckTitle}</h1>
            <br></br>

            <h4>Pick Your Favorite Caption</h4>
            <br></br>

            <img style={{
                objectFit: "cover",
                height: "325px",
                width: "325px",
                borderRadius: "50px",
            }} src={imageURL}/>

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
                    {timerDuration !== -1 ? <CountdownCircleTimer
                            background="red"
                            size={60}
                            strokeWidth={5}
                            isPlaying
                            duration={roundDuration}
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
        </div>
    );
};