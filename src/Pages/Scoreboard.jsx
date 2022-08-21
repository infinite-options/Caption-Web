import React, {useEffect, useState, useContext} from "react";
import {useHistory} from 'react-router-dom';
import Pic from "../Assets/sd.jpg";
import {Row, Col, Card} from "reactstrap";
import "../Styles/Scoreboard.css";
import Report from "../Components/Report";
import {Button} from "../Components/Button";
import background from "../Assets/temp2.png";
import axios from "axios";
import Deck from "../Components/Deck";
import {LandingContext} from "../App";

function Scoreboard({ channel, channel_waiting, channel_joining}) {
    const history = useHistory();
    const {code, roundNumber, host, imageURL, alias, scoreboardInfo, setImageURL, photosFromAPI, deckTitle, setCode, setName, setEmail, setZipCode, setAlias, setRounds, setRoundDuration, setHost, setGameUID, setRoundNumber,setPlayerUID, setScoreboardInfo, setPhotosFromAPI, setDeckTitle, setDeckSelected, cookies, setCookie} = useContext(LandingContext);

    // Load Cookies
    console.log("Scoreboard Cookies", cookies)
    loadCookies()

    const pub = (apiURL) => {
        if(photosFromAPI.length > 0)
            channel.publish({data: {
                roundStarted: true,
                currentImage: apiURL,
            }});
        else
        channel.publish({data: {
            roundStarted: true,
            currentImage: "",
        }});
    }

    const getUniqueAPIimage = async () => {
        const randNum = Math.floor(Math.random() * photosFromAPI.length)
        const randURL = photosFromAPI[randNum]
        let apiPhotos = photosFromAPI.filter((url) => {
            return url !== imageURL
        })

        setImageURL(randURL)
        setPhotosFromAPI(apiPhotos)

        setCookie("imageURL", randURL)
        setCookie("photosFromAPI", apiPhotos)

        pub(randURL)
    }

    useEffect(() => {
        console.log('scoreboardInfo = ', scoreboardInfo);

        if(!host){
            setRoundNumber(roundNumber + 1);
            setCookie("roundNumber", roundNumber + 1)

            async function subscribe() 
            {
                console.log('subscribing')
                await channel.subscribe(roundStarted => {
                    if (roundStarted.data.roundStarted) {
                        console.log(roundStarted)
                        if(roundStarted.data.currentImage === "") {
                            const getImage = async () => {
                                const getImageURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getImageForPlayers/";
                                const nextRound = roundNumber + 1;
                                console.log('[code, nextRound] = ', [code, nextRound]);
                                console.log('fullURL scoreboard = ', getImageURL + code + "," + nextRound);

                                await axios.get(getImageURL + code + "," + nextRound).then((res) => {
                                    console.log("GET Get Image For Players",res);
                                    setImageURL(res.data.image_url);

                                    setCookie("imageURL", res.data.image_url)
                                })

                                history.push('/page');
                            };
    
                            getImage();                        
                        } else {
                            console.log(roundNumber)
                            setImageURL(roundStarted.data.currentImage)
                            setCookie("imageURL", roundStarted.data.currentImage)

                            history.push('page/')
                        }

                    }
                });
            }
            
            subscribe();
        
            return function cleanup() {
                channel.unsubscribe();
            };
        }


        async function subscribe1() 
        {
            await channel_waiting.subscribe(newPlayer => {
                async function getPlayers () {
                    console.log("Made it in getPlayers Func");
                    channel_joining.publish({data: {
                        roundNumber: roundNumber, 
                        path: window.location.pathname
                    }})
                }
        
                getPlayers();
            });
        }

        if (host)
            subscribe1();

        return function cleanup() {
            channel_waiting.unsubscribe();
        }
    }, [scoreboardInfo]);


    let winning_score = Number.NEGATIVE_INFINITY;
    for (const playerInfo of scoreboardInfo)
        winning_score = playerInfo.score > winning_score ? playerInfo.score :
            winning_score;


    function renderReports() {
        return (
            <div>
                {
                    scoreboardInfo.map((item, index) => (
                        <Report
                            isWinner={winning_score === item.score}
                            alias={item.user_alias}
                            caption={item.caption}
                            points={item.score}
                            totalPts={item.game_score}
                            votes={item.votes}
                        />
                    ))
                }
            </div>
        );
    }


    function startNextRound() {
        if (!host)
            return;

        console.log('starting next round');
        
        const postURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/createNextRound";
        const payload = {
            game_code: code.toString(),
            round_number: roundNumber.toString(),
        }

        async function nextPub(){
            await axios.post(postURL, payload);

            setRoundNumber(roundNumber + 1);
            setCookie("roundNumber", roundNumber + 1)

            const nextRound = roundNumber + 1;

            if(photosFromAPI.length === 0) {
                const getUniqueImageInRound = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getUniqueImageInRound/";
                
                console.log('test1: unique URL = ', getUniqueImageInRound + code + "," + nextRound);

                await axios.get(getUniqueImageInRound + code + "," + nextRound).then((res) => {
                    console.log('GET Get Unique Image In Round', res);
                    setImageURL(res.data.image_url);

                    setCookie("imageURL", res.data.image_url)

                    pub();
                })
            } else {
                getUniqueAPIimage()
            }
            

            console.log('test2: publishing');

            history.push("/page");
        }
        
        nextPub();
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



    useEffect(() => 
        console.log('Currently in Scoreboard', "Alias:",alias, "Current Round: ", roundNumber), 
        []);


    return (
        <div
            style={{
                maxWidth: "370px",
                height: "100%",
                //As long as I import the image from my package strcuture, I can use them like so
                backgroundImage: `url(${background})`,
                // backgroundImage:
                //   "url('https://images.unsplash.com/photo-1557683325-3ba8f0df79de?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTZ8fHxlbnwwfHx8fA%3D%3D&w=1000&q=80')",
            }}
        >
            <h1>{deckTitle}</h1>
            <br></br>
            <h3> Scoreboard</h3>


            <img className="centerPic" style={{
                height: "255px",
                width: "255px",
            }}
                 src={imageURL}/>
            <br/>


            {renderReports()}

            <br></br>

            { host ?
                <Button
                    className="fat"
                    // destination="/page"
                    onClick={startNextRound}
                    children="Next Round"
                    conditionalLink={true}
                /> : <></>
            }

            <br/>
        </div>
    );
}

export default Scoreboard;
