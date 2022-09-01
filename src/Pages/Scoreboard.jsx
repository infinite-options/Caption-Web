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
    const { cookies, setCookie, userData, setUserData } = useContext(LandingContext);

    
     // Load cookies into userData state on first render
    useEffect(() => {
        const getCookies = (propsToLoad) => {
            let localCookies = cookies.userData
            let cookieLoad = {}

            for(let i = 0; i < propsToLoad.length; i++) {
                let propName = propsToLoad[i]
                let propValue = localCookies[propName]

                if(cookieLoad[propName] !== propValue)
                    cookieLoad[propName] = propValue
                //cookieLoad[propName] = localCookies[propName]
                
            }

            console.log("cookieLoad", cookieLoad)

            let newUserData = {
                ...userData,
                ...cookieLoad
            }
            console.log("newUserData", newUserData)

            setUserData(newUserData)
        }

        getCookies(["host", "roundNumber", "name", "alias", "email", "zipCode", "playerUID", "rounds", "roundDuration", "code", "deckTitle", "deckSelected", "imageURL", "scoreboardInfo", "isApi", "googlePhotos"])
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
        console.log("roundNumber", userData.roundNumber)
        if(!userData.isApi)
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

    // Runs on first render or when userData.scoreboard changes
    useEffect(() => {
        // if(!userData.host) {
        if(userData.code !== "" &&  !userData.host) {
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



    function renderReports() {
        let winning_score = Number.NEGATIVE_INFINITY;
        for (const playerInfo of userData.scoreboardInfo)
            winning_score = playerInfo.score > winning_score ? playerInfo.score :
                winning_score;

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

            const nextRound = parseInt(userData.roundNumber) + 1;
            
            if(!userData.isApi) {
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
                await getApiImage(nextRound)
            }

            setUserData({
                ...userData,
                roundNumber: nextRound,
            })

            putCookies(
                ["roundNumber"],
                {"roundNumber": nextRound}
            )
            

            history.push("/page");
        }
        
        nextPub();
    }


    const getApiImage = async (nextRound) => {
        let uniqueImage = await apiCall(nextRound)

        await setUserData({
            ...userData, 
            imageURL: uniqueImage,
        })
        await putCookies(
            ["imageURL"], 
            {"imageURL": uniqueImage}
        )
        
        pub(uniqueImage)
    }


    const apiCall = async () => {
        let usedUrlArr = []

        // Get previously used images
        await axios.get("https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getRoundImage/" + userData.code + ",0").then(res => {
            const result = res.data.result
            console.log("getRoundImage Result", result)
            for(let i = 0; i < result.length; i++) {
                usedUrlArr.push(result[i].round_image_uid)
            }
            console.log("usedUrlSet", usedUrlArr)
        })

        const clevelandURL = "https://openaccess-api.clevelandart.org/api/artworks"
        const chicagoURL = "https://api.artic.edu/api/v1/artworks?fields=id,title,image_id"
        const giphyURL = "https://api.giphy.com/v1/gifs/trending?api_key=Fo9QcAQLMFI8V6pdWWHWl9qmW91ZBjoK&"
        const harvardURL= "https://api.harvardartmuseums.org/image?apikey=c10d3ea9-27b1-45b4-853a-3872440d9782"

        let uniqueUrl = ""

        if(userData.deckSelected === "500-000005"){
            // Google 
            const body = {
                "pageSize": "50",
                "albumId":  userData.googlePhotos.albumId
            }
            const headers = {
                Accept: 'application/json',
                Authorization: 'Bearer ' + userData.googlePhotos.accessToken ,
            }
    
            await axios.post('https://photoslibrary.googleapis.com/v1/mediaItems:search', body, {headers: headers})
            .then(res => {
                // Collect image urls in array
                let imageUrls = res.data.mediaItems.map(picture => {
                    return picture.baseUrl
                })

                while(true) {
                    // Generate random index number
                    let randomIndex = (Math.random() * imageUrls.length).toFixed(0)

                    let image = imageUrls[randomIndex]
                    console.log("used list contains image: ", usedUrlArr.includes(image))
                    if(!usedUrlArr.includes(image)){
                        uniqueUrl = image
                        console.log("unique url found", uniqueUrl)
                        break
                    }
                }
            })

        } else if (userData.deckSelected === "500-000006") {
            // Cleveland
            await axios.get(clevelandURL, {limit : "20"}).then( res => {
                console.log("Cleveland res", res)

                while(true) {
                    let randomIndex = (Math.random() * 20).toFixed(0)

                    let image = res.data.data[randomIndex]
                    if(image.images !== null && image.images.web !== null && !usedUrlArr.includes(image.images.web.url)){
                        uniqueUrl = image.images.web.url
                        console.log("unique url found", uniqueUrl)
                        break
                    }
                }
            })
        } else if (userData.deckSelected === "500-000007") {
            // Chicago
            await axios.get(chicagoURL, {limit : "20"}).then( res => {
                console.log("Chicago Res", res)
                while(true) {
                    let randomIndex = (Math.random() * 12).toFixed(0)

                    let chicagoImage = res.data.data[randomIndex]
                    console.log("RandomIndex", randomIndex)
                    console.log("ChicagoImage", chicagoImage)

                    let currentUrl = res.data.config.iiif_url + "/" + chicagoImage.image_id + "/full/843,/0/default.jpg"
                    if(chicagoImage !== undefined && chicagoImage.image_id !== undefined && !usedUrlArr.includes(currentUrl)){
                        uniqueUrl = currentUrl
                        console.log("unique url found", uniqueUrl)
                        break
                    }
                }
            })
        } else if (userData.deckSelected === "500-000008") {
            // Giphy
            await axios.get(giphyURL, {limit : "20"}).then( res => {
                while(true) {
                    let randomIndex = (Math.random() * 20).toFixed(0)

                    let giphyImage = res.data.data[randomIndex]
                    //let shortUrl = giphyImage.images.original.url.substring(0, 44)
                    //if(giphyImage.images.original.url !== undefined && !usedUrlArr.includes(shortUrl)){

                    if(giphyImage.images.original.url !== undefined && !usedUrlArr.includes(giphyImage.images.original.url)){
                        uniqueUrl = giphyImage.images.original.url
                        console.log("unique url found", uniqueUrl)
                        break
                    }
                }
            })
        } else if (userData.deckSelected === "500-000009") {
            // Harvard
            await axios.get(harvardURL, {limit : "20"}).then( res => {
                while(true) {
                    let randomIndex = (Math.random() * 10).toFixed(0)

                    let harvardImage = res.data.records[randomIndex]
                    if(harvardImage.baseimageurl !== undefined && !usedUrlArr.includes(harvardImage.baseimageurl)){
                        uniqueUrl = harvardImage.baseimageurl
                        console.log("unique url found", uniqueUrl)
                        break
                    }
                }
            })
        }

        let payload = {
            "game_code": userData.code,
            "round_number": userData.roundNumber.toString(),
            "image": uniqueUrl
        }
        await axios.post("https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/postRoundImage", payload).then(res => {
            console.log("postRoundImage", res)
        })

        return uniqueUrl
    }



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
            <br></br>
            <h1>{userData.deckTitle}</h1>
            <br></br>
            <h3> Scoreboard</h3>


            <img className="centerPic" style={{
                height: "255px",
                width: "255px",
            }}
                 src={userData.imageURL}/>
            <br/>


            {userData.scoreboardInfo !== undefined ? 
                renderReports() :
                ""
            }

            <br></br>

            { userData.host !== undefined ?
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
