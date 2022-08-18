import React, {useContext, useEffect, useState, Component} from 'react'
import { useHistory } from "react-router-dom";
import axios from "axios";
import circle from "../Assets/circle.png";
import thing from "../Assets/idk.png";
import {Button} from '../Components/Button';
import "../Styles/Waiting.css";
import {LandingContext} from "../App";
import "bootstrap/dist/css/bootstrap.min.css";
import * as ReactBootStrap from 'react-bootstrap';
import {Link} from "react-router-dom";


export default function Waiting({channel, channel2, channel_joining}) {

    const {code, host, rounds, setRounds, roundNumber, setImageURL, alias, photosFromAPI, setPhotosFromAPI, deckSelected, deckTitle, setDeckTitle} = useContext(LandingContext);
    const [names, setNames] = useState([]);
    const [copied, setCopied] = useState(false);
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    let gameCodeText = "Game Code: " + code;


    const getUniqueImageInRound = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getUniqueImageInRound/"
    const postAssignDeckURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/assignDeck";


    useEffect(() => {
        console.log('roundNumber = ', roundNumber);
        
        async function getPlayers1() {
            const names_db = [];

            const getURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getPlayers/";
            await axios.get(getURL + code)
            .then((res) => {
                for (var index = 0; index < res.data.players_list.length; index++) {
                    names_db.push(res.data.players_list[index].user_alias);
                }
                
                setNames(names_db);
                console.log("before loading")
                setLoading(true);
                console.log("After loading")
            })
            .catch(err => console.error('error = ', err));
        }


        async function subscribe1() 
        {
            
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
                       
                        console.log('Before channeljoining')
                        channel_joining.publish({data: {roundNumber: roundNumber, path: window.location.pathname, alias: newPlayer.data.newPlayerName}})
                        
                        console.log('After channeljoining')
                       
                        
                    })
                    .catch(err => console.error('error = ', err));
                }
               
                getPlayers();
            });
        }


        async function subscribe2() 
        {
            await channel2.subscribe(newGame => {
                console.log("In subscribe 2")
                if(newGame.data.gameStarted) {
                    console.log("newGame data", newGame.data)
                    setDeckTitle(newGame.data.deckTitle)

                    if(newGame.data.currentImage.length === 0) {
                        const getImage = async () => {
                            const getImageURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getImageForPlayers/";
                            await axios.get(getImageURL + code + "," + roundNumber)
                            .then((res) => {
                                console.log("GET Get Image For Players", res);
                                setImageURL(res.data.image_url);
                            })

                            history.push('/page');
                        };

                        getImage();
                    } else {
                        setImageURL(newGame.data.currentImage)
                        history.push('/page')
                    }
                    
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


        
        useEffect(() => 
        console.log('Currently in Waiting', "Alias:",alias, "Current Round: ", roundNumber), 
        []);


    const pub = (apiURL)=> {
        console.log('sending players to start game');
        console.log("Log 1.5: Finish Posting");
        if(photosFromAPI.length > 0){
            console.log('API pub block')
            channel2.publish({data: {
                gameStarted: true,
                currentImage: apiURL,
                deckTitle: deckTitle
            }});
        }
            
        else
            channel2.publish({data: {
                gameStarted: true,
                currentImage: "",
                deckTitle: deckTitle
            }});

        history.push("/page");
    };


    const getUniqueAPIimage = async () => {
        // Assign Dummy Deck
        let payload = {
            deck_uid: "500-000009",
            game_code: code
        }

        await axios.post(postAssignDeckURL, payload).then((res) => {
            console.log(res)
        })

        const randNum = Math.floor(Math.random() * photosFromAPI.length)
        const imageURL = photosFromAPI[randNum]
        setImageURL(imageURL)
        setPhotosFromAPI(photosFromAPI.filter((url) => {
            return url !== imageURL
        }))

        pub(imageURL)
    }


    async function startPlaying() {     
        // Default decks   
        if(photosFromAPI.length === 0){
            console.log('getUniqueImage')

            // Assign Deck
            let payload = {
                deck_uid: deckSelected,
                game_code: code,
                // 
            }

            await axios.post(postAssignDeckURL, payload).then((res) => {
                console.log(res)
            })

            await axios.get(getUniqueImageInRound + code + "," + roundNumber).then((res) => {
                console.log('GET Get Unique Image In Round', res);
                setImageURL(res.data.image_url);
                setLoading(true)
            })

            pub();
        } 
        // API decks
        else {
             getUniqueAPIimage()
        }
        
    }

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
            <Link to="/gamerules">
                <i
                    style={{
                        position: "absolute",
                        top: "100px",
                        paddingBottom:"20px",
                        left: "30px",
                        color: "blue",
                    }}
                    className="fas fa-info-circle"
                    children=' Game Rule'
                />
            </Link>
            <h4>Waiting for all players to join</h4>
            {/* Add spinner */}
            
            
            <ul className="flex-container">
            {loading ? (
                names.map((value) => (
                    <li className="flex-item">
                        {value !== "" ? <i className="fas fa-circle fa-3x" style={{
                            height: "200px",
                            color: "purple"
                        }}/> : ""}
                        {value}
                    </li>
                ))
            
            ): (<ReactBootStrap.Spinner animation="border" role="status"/>)}
            </ul>

            {/* Game Code */}
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

            
            {host && deckSelected === "" ? <Button
                className="landing"
                children="Select Deck"
                destination="/collections"
                conditionalLink={true}  
            />
             : <></>}
              {host && deckSelected !== "" ? <Button
                className="landing"
                children="Start Game"
                onClick={() => startPlaying()}
                conditionalLink={true}  
            />
             : <></>}
            

        </div>
    )
}