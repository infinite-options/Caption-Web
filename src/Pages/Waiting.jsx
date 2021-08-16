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

    useEffect(() => {
        /**
         * This axios.get() is to fetch the names of the players in the waiting room
         * @type {string}
        */

        async function subscribe1() 
        {
            // if (!host)
            //     console.log('Not host and here above getPlayers with code = ', code, ' and channel = ', channel);
            await channel.subscribe(newPlayer => {
                async function getPlayers () {
                    const names_db = [];
                    const getURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getPlayers/";
                    await axios.get(getURL + code)
                    .then((res) => {
                        for (var index = 0; index < res.data.players_list.length; index++) {
                            names_db.push(res.data.players_list[index].user_alias);
                        }
                        setNames(names_db);
                    })
                    .catch(err => console.error('error = ', err));
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
        
        if (code) {
            subscribe1();
            subscribe2();
        }
        
        return function cleanup() {
            channel.unsubscribe();
            channel2.unsubscribe();
        };
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