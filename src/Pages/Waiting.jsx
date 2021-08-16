import React, {useContext, useEffect, useState} from 'react'
import { useHistory } from "react-router-dom";
import axios from "axios";
import circle from "../Assets/circle.png";
import thing from "../Assets/idk.png";
import {Button} from '../Components/Button';
import "../Styles/Waiting.css";
import {Row, Col, Card} from "reactstrap";
import Deck from "../Components/Deck";
import {LandingContext} from "../App";
import Bubbles from "../Components/Bubbles";


export default function Waiting({channel, channel2}) {

    const {code, gameUID, host, roundNumber} = useContext(LandingContext);
    const [names, setNames] = useState([]);
    const history = useHistory();
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
        // /**
        //  * This axios.get() is to fetch the names of the players in the waiting room
        //  * @type {string}
        //  */
        // const getURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getPlayers/";
        // axios.get(getURL + code).then((res) => {
        //     console.log(res);

        //     const init_names = [];

        //     for (var index = 0; index < res.data.players_list.length; index++) {
        //         /**
        //          * The value of index continues to increment due to the loop,
        //          * so let's make a variable that does not change for the onClick function
        //          * @type {number}
        //          */

        //         init_names.push(res.data.players_list[index].user_alias);
        //     }
        //     setNames(init_names);
        // });

        // setTimeout(function () {

        //     if (grandfatherClock != "gameHasBegun") {
        //         if (grandfatherClock == "tick") {
        //             setGrandfatherClock("tock");
        //         } else {
        //             setGrandfatherClock("tick");
        //         }

                
        //         console.log(grandfatherClock);

        //         if (grandfatherClock != "gameHasBegun") {
        //             const getTimerURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/gameTimer/";
        //             console.log('In Waiting.jsx: code = ', code);

        //             axios.get(getTimerURL + code + "," + roundNumber).then((res) => {
        //                 try {
        //                     var s = parseInt(res.data.round_started_at.substring(res.data.round_started_at.length - 2));
        //                     setGrandfatherClock("gameHasBegun");
        //                 } catch (err) {
        //                     console.log("game has not started yet");
        //                 }
        //             })
        //         }

        //     }
        // }, 2000);
    });

    useEffect(() => {
        // console.log('Init useEffect in waiting.jsx. Code = ', code, ', listening on channel: ', channel.name);
        // /**
        //  * This axios.get() is to fetch the names of the players in the waiting room
        //  * @type {string}
        // */
        // async function getPlayers () {
        //     const getURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getPlayers/";
        //     await axios.get(getURL + code).then((res) => {    
        //         const init_names = [];
    
        //         for (var index = 0; index < res.data.players_list.length; index++) {  
        //             init_names.push(res.data.players_list[index].user_alias);
        //         }
        //         setNames(init_names);
        //     });
        // }

        // getPlayers();

        // async function subscribe() 
        // {
        //     await channel2.subscribe(newGame => {
        //         if(newGame.data.gameStarted) {
        //             history.push('/page');
        //         }
        //     })
        // }
        
        // subscribe();
    
        // return function cleanup() {
        //     channel2.unsubscribe();
        // };
    }, []);

    useEffect(() => {
        /**
         * This axios.get() is to fetch the names of the players in the waiting room
         * @type {string}
        */

        async function subscribe1() 
        {
            await channel.subscribe(newPlayer => {
                async function getPlayers () {
                    const names_db = [];
                    console.log('in getPlayers');
                    const getURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getPlayers/";
                    await axios.get(getURL + code)
                    .then((res) => {
                        for (var index = 0; index < res.data.players_list.length; index++) {
                            names_db.push(res.data.players_list[index].user_alias);
                        }
                        console.log('names_db = ', names_db);
                        // names_db.push(newPlayer.data.newPlayerName);
                        console.log('setting names with newNames = ', names_db);
                        setNames(names_db);
                    })
                    .catch(err => console.error('error = ', err));

                    return names_db;
                }
        
                getPlayers();
            });
        }
        async function subscribe2() 
        {
            await channel2.subscribe(newGame => {
                if(newGame.data.gameStarted) {
                    history.push('/page');
                }
            })
        }
        
        subscribe1();
        subscribe2();
        
        return function cleanup() {
            channel.unsubscribe();
            channel2.unsubscribe();
        };
        
        // if (code)
        //     subscribe();
    
        // return function cleanup() {
        //     channel.unsubscribe();
        // };
    }, [code]);

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