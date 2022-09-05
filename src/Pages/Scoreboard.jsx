import React, {useEffect, useState, useContext} from "react";
import {useHistory} from 'react-router-dom';
import "../Styles/Scoreboard.css";
import Report from "../Components/Report";
import {Button} from "../Components/Button";
import background from "../Assets/temp2.png";
import axios from "axios";
import * as ReactBootStrap from 'react-bootstrap';
import {LandingContext} from "../App";
import {CookieHelper} from "../Components/CookieHelper"


function Scoreboard({ channel, channel_waiting, channel_joining}) {
    const history = useHistory();
    const { cookies, setCookie, userData, setUserData } = useContext(LandingContext);
    const {getCookies} = CookieHelper()

    // Determine if we should display Scoreboard page or loading icon
    // True = display html, False = display loading screen
    const [displayHtml, setDisplayHtml] = useState(false)


    // Endpoints used in Scoreboard
    const postRoundImageURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/postRoundImage"
    const getRoundImageURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getRoundImage/" 
    const createNextRoundURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/createNextRound";
    const getUniqueImageInRoundURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getUniqueImageInRound/";
    const getImageURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getImageForPlayers/";



    // HOOK: useEffect()
    // DESCRIPTION: On first render, check if hooks are updated, load data from cookies if not
    useEffect(() => {
        // Check if userData is empty (on refresh/new user)
            if(userData.code === "" || userData.roundNumber === "" || userData.imageUrl === "" || userData.scoreboardInfo === [] || userData.playerUID === "") {
                getCookies(["host", "roundNumber", "playerUID", "rounds", "code", "deckTitle", "deckSelected", "imageURL", "scoreboardInfo", "isApi", "googlePhotos"], setDisplayHtml)
            }
            else
                setDisplayHtml(true)
    }, [])


    

    // HOOK: useEffect()
    // DESCRIPTION: If not host, listen on ably for round started signal. Get next round image on receiving signal.
    useEffect(() => {
        if(userData.code !== "" &&  !userData.host) {
            // DONT INCREMENT EVERY TIME
            // setUserData({
            //     ...userData,
            //     roundNumber: userData.roundNumber + 1,
            // })
            // setCookie("userData", {
            //     ...cookies.userData,
            //     "roundNumber": userData.roundNumber + 1,
            // })

            // FUNCTION: subscribe()
            // DESCRIPTION: Listen for roundStarted signal on ably. When round has started, load next round's image url and transition to next page.
            async function subscribe() 
            {
                await channel.subscribe(roundStarted => {

                    if (roundStarted.data.roundStarted) {
                        // Database Deck
                        if(roundStarted.data.currentImage === "") {
                            const getImage = async () => {
                                const nextRound = userData.roundNumber + 1;

                                // Get next round's image from database
                                await axios.get(getImageURL + userData.code + "," + nextRound).then((res) => {
                                    console.log("GET Get Image For Players",res);

                                    // Save data to hooks and cookies
                                    setUserData({
                                        ...userData,
                                        imageURL: res.data.image_url,
                                        roundNumber: nextRound
                                    })
                                    setCookie("userData", {
                                        ...cookies.userData,
                                        "imageURL": res.data.image_url,
                                        "roundNumber": nextRound
                                    })

                                })

                                history.push('/page');
                            };
    
                            getImage();                        
                        } else {
                            // API deck: get next round's image from ably and save to hooks/cookies
                            setUserData({
                                ...userData,
                                imageURL: roundStarted.data.currentImage,
                                roundNumber: userData.roundNumber + 1
                            })
                            setCookie("userData", {
                                ...cookies.userData,
                                "imageURL": roundStarted.data.currentImage,
                                "roundNumber": userData.roundNumber + 1
                            })

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


        // FUNCTION: subscribeWaiting()
        // DESCRIPTION: Host listens on channel_waiting. If new player joins, host publishes round info to channel_joining to give new player correct info
        async function subscribeWaiting() 
        {
            await channel_waiting.subscribe(newPlayer => {
                async function getPlayers () {
                    channel_joining.publish({data: {
                        roundNumber: userData.roundNumber, 
                        path: window.location.pathname
                    }})
                }
        
                getPlayers();
            });
        }

        if (userData.host)
            subscribeWaiting();

        return function cleanup() {
            channel_waiting.unsubscribe();
        }
    }, [userData.scoreboardInfo]);


    // FUNCTION: renderReports()
    // DESCRIPTION: Renders scoreboard
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

    // FUNCTION: startNextRound()
    // DESCRIPTION: Runs on clicking "next round"
    function startNextRound() {
        if (!userData.host)
            return;

        console.log('In startNextRound()');
        
        
        // FUNCTION: nextpub()
        // DESCRIPTION: Creates next round, then gets url for next round
        async function nextPub(){
            // Create next round in backend
            const payload = {
                game_code: userData.code.toString(),
                round_number: userData.roundNumber.toString(),
            }
            await axios.post(createNextRoundURL, payload).then(res => {
                console.log("POST createNextRound", res)
            });
            
            const nextRound = parseInt(userData.roundNumber) + 1;
            let nextUrl = ""
            

            // Database Deck: set next round's image url to nextUrl
            if(!userData.isApi) {                
                await axios.get(getUniqueImageInRoundURL + userData.code + "," + nextRound).then((res) => {
                    console.log('GET Get Unique Image In Round', res);

                    nextUrl = res.data.image_url

                    pub();
                })
            } 
            // API deck: call apiCall() to set next round's image url to nextUrl
            else {
                nextUrl = await apiCall(nextRound)
            }

            console.log("nextPub(): next url", nextUrl)

            // Save to hooks/cookies
            await setUserData({
                ...userData,
                imageURL: nextUrl,
                roundNumber: nextRound,
            })
            await setCookie("userData", {
                ...cookies.userData,
                "imageURL": nextUrl,
                "roundNumber": nextRound,
            })

            history.push("/page");
        }
        
        nextPub();
    }


    // FUNCTION: apiCall()
    // DESCRIPTION: Gets a list of previously used images, then list of images from API. Selects/returns a unique url not in previously used images.
    const apiCall = async (nextRound) => {
        let usedUrlArr = []

        // Get previously used images
        await axios.get(getRoundImageURL + userData.code + ",0").then(res => {
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
        setDisplayHtml(false)

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

                    console.log("ChicagoImage", chicagoImage)

                    let currentUrl = ""
                    if(chicagoImage !== undefined && chicagoImage.image_id !== undefined && chicagoImage !== null && chicagoImage.image_id !== null )
                        currentUrl = res.data.config.iiif_url + "/" + chicagoImage.image_id + "/full/843,/0/default.jpg"
                    if(currentUrl !== "" && !usedUrlArr.includes(currentUrl)){
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

        console.log("Next Round, before postRoundImage: ", nextRound)
        let payload = {
            "game_code": userData.code,
            "round_number": nextRound.toString(),
            "image": uniqueUrl
        }
        await axios.post(postRoundImageURL, payload).then(res => {
            console.log("postRoundImage", res)
        })

        console.log("apiCall URL before exiting: ", uniqueUrl)
        pub(uniqueUrl)

        return uniqueUrl
    }


    // FUNCTION: pub()
    // DESCRIPTION: Publishes signal to start next round. If using api deck, publishes image URL for next round.
    const pub = (apiURL) => {
        if(userData.isApi){
            console.log("pub() using api deck: ", apiURL)
            channel.publish({data: {
                roundStarted: true,
                currentImage: apiURL,
            }});
        }
        else{
            console.log("pub() using database deck")
             channel.publish({data: {
                roundStarted: true,
                currentImage: "",
            }});
        }
    }


    return (
        displayHtml ?
            // Scoreboard page HTML
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

                { userData.host !== undefined && userData.host ?
                    <Button
                        className="fat"
                        // destination="/page"
                        onClick={startNextRound}
                        children="Next Round"
                        conditionalLink={true}
                    /> : <></>
                }

                <br/>
            </div> :
            // Loading Icon HTML Code
            <div>
                <h1>Loading game data...</h1>
                <ReactBootStrap.Spinner animation="border" role="status"/>
            </div>
    );
}

export default Scoreboard;
