import React, {useContext, useEffect, useState} from 'react'
import { useHistory } from "react-router-dom";
import axios from "axios";
import circle from "../Assets/circle.png";
import thing from "../Assets/idk.png";
import {Button} from '../Components/Button';
import "../Styles/Waiting.css";
import {LandingContext} from "../App";

export default function Waiting({channel, channel2, channel_joining}) {

    const {code, host, rounds, roundNumber, setImageURL} = useContext(LandingContext);
    const [names, setNames] = useState([]);
    const history = useHistory();
    /**
     * Setup grandfather clock for the Waiting Page
     */
    const [grandfatherClock, setGrandfatherClock] = useState("tick");

    let gameCodeText = "Game Code: " + code;
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        console.log('roundNumber = ', roundNumber);
        async function getPlayers1() {
            console.log("Made it in getPlayers Func");
            const names_db = [];
            const getURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getPlayers/";
            console.log("Code: ", code)
            await axios.get(getURL + code)
            .then((res) => {
                for (var index = 0; index < res.data.players_list.length; index++) {
                    names_db.push(res.data.players_list[index].user_alias);
                }
                setNames(names_db);

            })
            .catch(err => console.error('error = ', err));
        }

        // getPlayers1();

        async function subscribe1() 
        {
            await channel.subscribe(newPlayer => {
                async function getPlayers () {
                    console.log("Made it in getPlayers Func");
                    const names_db = [];
                    const getURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getPlayers/";
                    await axios.get(getURL + code)
                    .then((res) => {
                        for (var index = 0; index < res.data.players_list.length; index++) {
                            names_db.push(res.data.players_list[index].user_alias);
                        }
                        setNames(names_db);
                        console.log("made it 2");
                        channel_joining.publish({data: {roundNumber: roundNumber, path: window.location.pathname}})

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
                    const getImage = async () => {
                        const getImageURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getImageForPlayers/";
                        console.log('[code, roundNumber] = ', [code, roundNumber]);
                        await axios.get(getImageURL + code + "," + roundNumber).then((res) => {
                            console.log(res);
                            // setImageSrc(res.data.image_url);
                            setImageURL(res.data.image_url);
                        })
                        history.push('/page');
                    };

                    getImage();
                }
            })
        }
        
        if (code) {
            subscribe1();
            subscribe2();
            getPlayers1()
        }
        
        
        return function cleanup() {
            channel.unsubscribe();
            channel2.unsubscribe();
        };
    }, [code]);

    useEffect(() => {
        if (copied) {
            setTimeout(() => {
                setCopied(false);
            }, 10000);
        }
    }, [copied])

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
                copied={copied}
                onClick = {() => {
                    setCopied(true);
                    navigator.clipboard.writeText(code);
                }}
                destination="/waiting"
                conditionalLink={true}
            />

        

            <br></br>

            {host ? <Button
                className="landing"
                children="Start Game"
                destination="/collections"
                conditionalLink={true}  
            />
             : <></>}

            {grandfatherClock === "gameHasBegun" ?
                <Button
                    className="landing"
                    children="Start Game"
                    destination="/page"
                    conditionalLink={true}
                />
                : <></>}
        </div>
    )
}