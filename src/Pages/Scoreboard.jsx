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


    // FUNCTION: pub()
    // DESCRIPTION: 
    const pub = (apiURL) => {
        console.log("roundNumber", userData.roundNumber)
        if(userData.isApi){
            console.log("Publishing for api")
            channel.publish({data: {
                roundStarted: true,
                currentImage: apiURL,
            }});
        }
        else
            channel.publish({data: {
                roundStarted: true,
                currentImage: "",
            }});
    }


    // HOOK: useEffect()
    // DESCRIPTION: On first render, check if hooks are updated, load data from cookies if not
    useEffect(() => {
        if(userData.code !== "" &&  !userData.host) {
            setUserData({
                ...userData,
                roundNumber: userData.roundNumber + 1,
            })
            setCookie("userData", {
                ...cookies.userData,
                "roundNumber": userData.roundNumber + 1,
            })

            // FUNCTION: subscribe()
            // DESCRIPTION: 
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
                                    setCookie("userData", {
                                        ...cookies.userData,
                                        "imageURL": res.data.image_url
                                    })

                                })

                                history.push('/page');
                            };
    
                            getImage();                        
                        } else {
                            setUserData({
                                ...userData,
                                imageURL: roundStarted.data.currentImage
                            })
                            setCookie("userData", {
                                ...cookies.userData,
                                "imageURL": roundStarted.data.currentImage
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

        // FUNCTION: subscribe1()
        // DESCRIPTION: 
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


    // FUNCTION: renderReports()
    // DESCRIPTION: 
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
    // DESCRIPTION: 
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
            let nextUrl = ""
            
            if(!userData.isApi) {
                const getUniqueImageInRound = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getUniqueImageInRound/";
                
                await axios.get(getUniqueImageInRound + userData.code + "," + nextRound).then((res) => {
                    console.log('GET Get Unique Image In Round', res);
                    // setUserData({
                    //     ...userData,
                    //     imageURL: res.data.image_url
                    // })
                    // setCookie("userData", {
                    //     ...cookies.userData,
                    //     "imageURL": res.data.image_url
                    // })
                    nextUrl = res.data.image_url

                    pub();
                })
            } else {
                nextUrl = await apiCall(nextRound)
            }

            console.log("next url", nextUrl)
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

    // FUNCTION: getApiImage()
    // DESCRIPTION: 
    // const getApiImage = async (nextRound) => {
    //     let uniqueImage = await apiCall(nextRound)

        
    //     pub(uniqueImage)
    //     return uniqueImage
    // }


    // FUNCTION: apiCall()
    // DESCRIPTION: 
    const apiCall = async (nextRound) => {
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
            //"round_number": userData.roundNumber.toString(),
            "image": uniqueUrl
        }
        await axios.post("https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/postRoundImage", payload).then(res => {
            console.log("postRoundImage", res)
        })

        console.log("URL in apiCall: ", uniqueUrl)
        pub(uniqueUrl)

        return uniqueUrl
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
