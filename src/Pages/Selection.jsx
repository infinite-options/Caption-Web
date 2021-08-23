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


export default function Scoreboard({channel_host, channel_all}) {
    const {code, roundNumber, imageURL, rounds, host, playerUID, gameUID, alias, setScoreboardInfo} = useContext(LandingContext);
    const history = useHistory();
    console.log('code = ', code, ', playerUID = ', playerUID);

    const [toggleArr, setToggleArr] = useState([]);
    const [playersArr, setPlayersArr] = useState([]);
    const [selectedCaption, setSelectedCaption] = useState("");

    const [localUserVoted, setLocalUserVoted] = useState(false);
    const [everybodyVoted, setEverybodyVoted] = useState(false);
    const [SelectedMyCaption, setSelectedMyCaption] = useState(false);

    const pub_host = (playerCount) => {
        channel_host.publish({data: {playersLeft: playerCount}});
    };

    const pub_all = () => {
        channel_all.publish({data: {everybodyVoted: true}});
    };

    useEffect(() => {
        const getURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getAllSubmittedCaptions/";
        console.log('rounds = ', rounds, ', roundNumber = ', roundNumber);

        /**
         * Issue:
         * The user should not be able to select/vote for their own caption.
         * Should be easy --> match internal state with info in the endpoint result.
         */

        console.log('roundNumber = ', roundNumber, ` and I am ${host ? '' : 'not'} the host`);
        axios.get(getURL + code + "," + roundNumber).then((res) => {
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

            setPlayersArr(temp_players_arr);
            if (res.data.players.length === 0)
            {
                async function noPlayersThenSubmit()
                {
                    const getPlayersWhoHaventVotedURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getPlayersWhoHaventVoted/";
                    await axios.get(getPlayersWhoHaventVotedURL + code + "," + roundNumber).then((res) => {
                        pub_host(res.data.players_count);
                    });
                }

                noPlayersThenSubmit();
            }

            /**
             * Initialize the toggle array with the correct size and populate the array with all false values
             */
            toggleArr.length = res.data.players.length;
            for (var i = 0; i < toggleArr.length; i++) {
                toggleArr[i] = false;
            }
        })

        console.log("Toggle Arr: " + toggleArr);

        async function subscribe_host() 
        {
            await channel_host.subscribe(newVote => {
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
                            res.data.scoreboard.sort((a, b) => (b.score - a.score));
                            setScoreboardInfo(res.data.scoreboard);
                        });
                        console.log('test 3');
                        if (rounds <= roundNumber)
                            history.push('/endgame');
                        else
                            history.push('/scoreboard');
                    }
                };
                getNewScoreboard();
            })
        }
        
        if (host)
            subscribe_host();
        subscribe_all();
    
        return function cleanup() {
            channel_host.unsubscribe();
            channel_all.unsubscribe();
        };
    }, []);

    function changeToggle(index) {
        console.log("Called: " + index);
        for (var i = 0; i < toggleArr.length; i++) {
            toggleArr[i] = false;
        }
        if(playersArr[index].round_user_uid !== playerUID) {
            toggleArr[index] = true;
            setSelectedCaption(playersArr[index].caption);
        }

        console.log("Result: " + toggleArr);
        // setToggleState(index);
    }

    async function postVote() {

        setLocalUserVoted(true);

        const postURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/voteCaption";

        const payload = {
            caption: selectedCaption,
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

    function renderCaptions() {

        var captions = [];
        console.log('playersArr.length = ', playersArr.length);
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
                <br></br>
            </div>);
        }
        console.log('captions = ', captions);
        return <div>{captions}</div>;
    }


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


            {everybodyVoted ?
                <Button
                    className="fat"
                    disabled = {SelectedMyCaption}
                    destination= {rounds === roundNumber ? "/endgame" : "/scoreboard"}
                    children="Continue to Scoreboard"
                    conditionalLink={true}
                />
                :  <></>}

            {localUserVoted ?
                <></>
                : selectedCaption ?
                    <Button className="fat" destination="/selection" children="Vote" onClick={postVote}
                          conditionalLink={true}/>
                    : <></>
            }

            <br></br>
        </div>
    );
};

