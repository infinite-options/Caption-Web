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
    const { userData, setUserData, cookies, setCookie } = useContext(LandingContext);

    // Load Cookies
    console.log("Scoreboard Cookies", cookies)
    
     // Load cookies into userData state on first render
     useEffect(() => {
        const getCookies = (propsToLoad) => {
            let localCookies = cookies.userData
            let cookieLoad = {}

            for(let i = 0; i < propsToLoad.length; i++) {
                let propName = propsToLoad[i]
                let propValue = localCookies[propName]
                cookieLoad[propName] = propValue
            }

            console.log("cookieLoad", cookieLoad)

            let newUserData = {
                ...userData,
                ...cookieLoad
            }
            console.log("newUserData", newUserData)

            setUserData(newUserData)
        }


        getCookies(["host", "roundNumber", "name", "alias", "email", "zipCode", "playerUID", "rounds", "roundDuration", "code", "deckTitle", "deckSelected", "imageURL", "photosFromAPI", "scoreboardInfo"])
    }, [])


    // Sets cookies for state variables in propsToPut array.
    // If updating state right before calling putCookies(), call putCookies(["stateName"], {"stateName": "stateValue"}) with a literal
    // state value to update cookie correctly.
    const putCookies = (propsToPut, instantUpdate) => {
        console.log("In put Cookies", propsToPut)
        let localCookies = {}
        
        if(cookies.userData === undefined) {
            setCookie("userData", {})
        } else {
            localCookies = cookies.userData
        }

        for(let i = 0; i < propsToPut.length; i++) {
            const propName = propsToPut[i]

            // State has not updated, referecnce instantUpdate
            if(instantUpdate !== undefined && instantUpdate[propName] !== undefined) {
                localCookies[propName] = instantUpdate[propName]
            } 
            // State already updated, reference userData
            else {
                localCookies[propName] = userData[propName]
            }
        }

        //console.log("local cookies end", localCookies)
        setCookie("userData", localCookies)
    }


    const pub = (apiURL) => {
        if(userData.photosFromAPI.length > 0)
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
        const randNum = Math.floor(Math.random() * userData.photosFromAPI.length)
        const randURL = userData.photosFromAPI[randNum]
        let apiPhotos = userData.photosFromAPI.filter((url) => {
            return url !== userData.imageURL
        })


        setUserData({
            ...userData,
            imageURL: randURL,
            photosFromAPI: apiPhotos
        })

        putCookies(
            ["imageURL", "photosFromAPI"],
            {"imageURL": randURL, "photosFromAPI": apiPhotos}
        )

        pub(randURL)
    }

    useEffect(() => {
        console.log('scoreboardInfo = ', userData.scoreboardInfo);

        if(!userData.host){
            setUserData({
                ...userData,
                roundNumber: userData.roundNumber + 1,
            })

            putCookies(
                ["roundNumber"],
                {"roundNumber": userData.roundNumber + 1}
            )

            async function subscribe() 
            {
                console.log('subscribing')
                await channel.subscribe(roundStarted => {
                    if (roundStarted.data.roundStarted) {
                        console.log(roundStarted)
                        if(roundStarted.data.currentImage === "") {
                            const getImage = async () => {
                                const getImageURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getImageForPlayers/";
                                const nextRound = userData.roundNumber + 1;
                                console.log('[code, nextRound] = ', [userData.code, nextRound]);
                                console.log('fullURL scoreboard = ', getImageURL + userData.code + "," + nextRound);

                                await axios.get(getImageURL + userData.code + "," + nextRound).then((res) => {
                                    console.log("GET Get Image For Players",res);

                                    setUserData({
                                        ...userData,
                                        imageURL: res.data.image_url
                                    })

                                    putCookies(
                                        ["imageURL"],
                                        {"imageURL": res.data.image_url}
                                    )
                                })

                                history.push('/page');
                            };
    
                            getImage();                        
                        } else {
                            console.log(userData.roundNumber)

                            setUserData({
                                ...userData,
                                imageURL: roundStarted.data.currentImage
                            })

                            putCookies(
                                ["imageURL"],
                                {"imageURL": roundStarted.data.currentImage}
                            )

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
                        roundNumber: userData.roundNumber, 
                        path: window.location.pathname
                    }})
                }
        
                getPlayers();
            });
        }

        if (userData.host)
            subscribe1();

        return function cleanup() {
            channel_waiting.unsubscribe();
        }
    }, [userData.scoreboardInfo]);


    let winning_score = Number.NEGATIVE_INFINITY;
    for (const playerInfo of userData.scoreboardInfo)
        winning_score = playerInfo.score > winning_score ? playerInfo.score :
            winning_score;


    function renderReports() {
        return (
            <div>
                {
                    userData.scoreboardInfo.map((item, index) => (
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
        if (!userData.host)
            return;

        console.log('starting next round');
        
        const postURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/createNextRound";
        const payload = {
            game_code: userData.code.toString(),
            round_number: userData.roundNumber.toString(),
        }

        async function nextPub(){
            await axios.post(postURL, payload);

            setUserData({
                ...userData,
                roundNumber: userData.roundNumber + 1,
            })

            putCookies(
                ["roundNumber"],
                {"roundNumber": userData.roundNumber + 1}
            )


            const nextRound = userData.roundNumber + 1;

            if(userData.photosFromAPI.length === 0) {
                const getUniqueImageInRound = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getUniqueImageInRound/";
                
                console.log('test1: unique URL = ', getUniqueImageInRound + userData.code + "," + nextRound);

                await axios.get(getUniqueImageInRound + userData.code + "," + nextRound).then((res) => {
                    console.log('GET Get Unique Image In Round', res);
                    setUserData({
                        ...userData,
                        imageURL: res.data.image_url
                    })

                    putCookies(
                        ["imageURL"],
                        {"imageURL": res.data.image_url}
                    )

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



    useEffect(() => 
        console.log('Currently in Scoreboard', "Alias:", userData.alias, "Current Round: ", userData.roundNumber), 
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
            <h1>{userData.deckTitle}</h1>
            <br></br>
            <h3> Scoreboard</h3>


            <img className="centerPic" style={{
                height: "255px",
                width: "255px",
            }}
                 src={userData.imageURL}/>
            <br/>


            {renderReports()}

            <br></br>

            { userData.host ?
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
