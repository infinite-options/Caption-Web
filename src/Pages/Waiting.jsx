import React, {useContext, useEffect, useState} from 'react'
import axios from "axios";
import circle from "../Assets/circle.png";
import thing from "../Assets/idk.png";
import {Button} from '../Components/Button';
import "../Styles/Waiting.css";
import {Row, Col, Card} from "reactstrap";
import Deck from "../Components/Deck";
import {LandingContext} from "../App";
import Bubbles from "../Components/Bubbles";


export default function Waiting({channel}) {

    const {code, gameUID, host, roundNumber} = useContext(LandingContext);
    const [names, setNames] = useState([]);

    /**
     * Setup grandfather clock for the Waiting Page
     */
    const [grandfatherClock, setGrandfatherClock] = useState("tick");

    let gameCodeText = "Game Code: " + code;

    // function renderBubbles() {
    //     return (<ul className="flex-container">
    //         {names.map((value) => (
    //             <li className="flex-item">
    //                 {value !== "" ? <i className="fas fa-circle fa-3x" style={{
    //                     height: "200px",
    //                     color: "purple"
    //                 }}/> : ""}
    //                 {value}
    //             </li>
    //         ))}
    //     </ul>);
    // }

    useEffect(() => {
        /**
         * This axios.get() is to fetch the names of the players in the waiting room
         * @type {string}
         */
        const getURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getPlayers/";
        axios.get(getURL + code).then((res) => {
            console.log(res);

            const init_names = [];

            for (var index = 0; index < res.data.players_list.length; index++) {
                /**
                 * The value of index continues to increment due to the loop,
                 * so let's make a variable that does not change for the onClick function
                 * @type {number}
                 */

                init_names.push(res.data.players_list[index].user_alias);

            }
            setNames(init_names);
        });

        setTimeout(function () {

            if (grandfatherClock != "gameHasBegun") {
                if (grandfatherClock == "tick") {
                    setGrandfatherClock("tock");
                } else {
                    setGrandfatherClock("tick");
                }

                console.log(grandfatherClock);

                if (grandfatherClock != "gameHasBegun") {
                    const getTimerURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/gameTimer/";

                    axios.get(getTimerURL + code + "," + roundNumber).then((res) => {
                        try {
                            var s = parseInt(res.data.round_started_at.substring(res.data.round_started_at.length - 2));
                            setGrandfatherClock("gameHasBegun");
                        } catch (err) {
                            console.log("game has not started yet");
                        }
                    })
                }

            }
        }, 2000);


        async function subscribe() 
        {
            await channel.subscribe(newPlayer => {
                const newNames = [...names];
                newNames.push(newPlayer.data.newPlayerName);
                setNames(newNames);
            });
        }
        
        subscribe();
    
        return function cleanup() {
            channel.unsubscribe();
        };
    });

    return (
        <div
            style={{
                maxWidth: "375px",
                height: "812px",
            }}
        >

            <img className="innerImage1" src={circle}/>
            <img className="innerImage2" src={thing}/>

            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>

            {/* <div className = "spacer"/> */}

            <h4>Waiting for all players to join</h4>

            <ul className="flex-container">
                {names.map((value) => (
                    <li className="flex-item">
                        {value !== "" ? <i className="fas fa-circle fa-3x" style={{
                            height: "200px",
                            color: "purple"
                        }}/> : ""}
                        {value}
                    </li>
                ))}
            </ul>

            <Button
                className="cardStyle"
                children={gameCodeText}
                destination="/waiting"
                conditionalLink={true}
            />
            <br></br>

            <Button
                className="landing"
                children="Share with other players"
                // onClick={printNames}
                destination="/waiting"
                conditionalLink={true}
            />

            <br></br>

            {host ? <Button
                className="landing"
                children="Start Game"
                destination="/collections"
                conditionalLink={true}
            /> : <></>}

            {grandfatherClock === "gameHasBegun" ?
                <Button
                    className="landing"
                    children="Start Game"
                    destination="/page"
                    conditionalLink={true}
                />
                : <></>}

            {/*<Button*/}
            {/*    className="landing"*/}
            {/*    children="Start Game"*/}
            {/*    destination="/collections"*/}
            {/*    conditionalLink={true}*/}
            {/*/>*/}


        </div>
    )
}