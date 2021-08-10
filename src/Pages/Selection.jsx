import React, {useContext, useEffect, useState} from "react";
import "../Styles/Scoreboard.css";
import {Button} from "../Components/Button";
import background from "../Assets/temp.png";
import axios from "axios";
import {LandingContext} from "../App";


export default function Scoreboard() {

    const {code, roundNumber, imageURL, host, rounds, playerUID} = useContext(LandingContext);

    const [toggleArr, setToggleArr] = useState([]);
    const [playersArr, setPlayersArr] = useState([]);
    const [selectedCaption, setSelectedCaption] = useState("");

    const [localUserVoted, setLocalUserVoted] = useState(false);
    const [everybodyVoted, setEverybodyVoted] = useState(false);


    useEffect(() => {
        const getURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getAllSubmittedCaptions/";

        /**
         * Issue:
         * The user should not be able to select/vote for their own caption.
         * Should be easy --> match internal state with info in the endpoint result.
         */


        axios.get(getURL + code + "," + roundNumber).then((res) => {
            console.log(res);
            setPlayersArr(res.data.players);

            /**
             * Initialize the toggle array with the correct size and populate the array with all false values
             */
            toggleArr.length = res.data.players.length;
            for (var i = 0; i < toggleArr.length; i++) {
                toggleArr[i] = false;
            }
        })

        console.log("Toggle Arr: " + toggleArr);
    }, []);

    useEffect(() => {


        setTimeout(function () {

            if (!everybodyVoted) {
                // const getURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getPlayersWhoHaventVoted/";
                // axios.get(getURL + code + "," + roundNumber).then((res) => {
                //     console.log(res);
                //     if (res.data.players_count == 0) {
                //         setEverybodyVoted(true);
                //     }
                // })
                setTimeout(function () {

                    if (!everybodyVoted) {
                        const getPlayersWhoHaventVotedURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getPlayersWhoHaventVoted/";
                        axios.get(getPlayersWhoHaventVotedURL + code + "," + roundNumber).then((res) => {
                            console.log(res);
                            if (res.data.players_count == 0) {
                                setEverybodyVoted(true);

                                if (host) {
                                    const getUpdateScoresURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/updateScores/";
                                    axios.get(getUpdateScoresURL + code + "," + roundNumber).then((res) => {
                                        console.log(res);
                                    })
                                }
                            }
                        })
                    }
                }, 1000);


            }
        }, 1000);

    });


    function changeToggle(index) {
        console.log("Called: " + index);
        for (var i = 0; i < toggleArr.length; i++) {
            toggleArr[i] = false;
        }
        toggleArr[index] = true;

        setSelectedCaption(playersArr[index].caption);

        console.log("Result: " + toggleArr);
        // setToggleState(index);
    }

    function postVote() {

        setLocalUserVoted(true);

        const postURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/voteCaption";

        const payload = {
            caption: selectedCaption,
            game_code: code.toString(),
            round_number: roundNumber.toString()
        }

        axios.post(postURL, payload).then((res) => {
            console.log(res);
        })
    }

    function renderCaptions() {

        var captions = [];
        for (var index = 0; index < playersArr.length; index++) {
            /**
             * The value of index continues to increment due to the loop,
             * so let's make a variable that does not change for the onClick function
             * @type {number}
             */
            let localIndex = index;

            captions.push(<div>
                <Button
                    isSelected={toggleArr[index]}
                    // className="selectionBtn1"
                    className={playersArr[index].round_user_id === playerUID ? "selectionBtn1"
                        : "selectionBtn2"}

                    children={playersArr[index].caption}
                    destination="/selection"
                    onClick={() => changeToggle(localIndex)}
                    conditionalLink={true}
                />
                <br></br>
            </div>);
            console.log("Endpoint result: " + playersArr[index].round_user_id);
            console.log("Application State: " + playerUID);
            console.log(playersArr[index].round_user_id === playerUID);
        }
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

            <h4 classname="row">Pick Your Favorite Caption</h4>
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
                    // destination="/scoreboard"
                    destination={roundNumber == rounds ? "/endgame" : "/scoreboard"}
                    children="Continue to Scoreboard"
                    conditionalLink={true}
                />
                : <></>}

            {localUserVoted ?
                <></>
                : <Button className="fat" destination="/selection" children="Vote" onClick={postVote}
                          conditionalLink={true}/>}

            <br></br>
        </div>
    );
};

