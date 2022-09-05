import React, {useContext, useEffect, useState} from 'react'
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
import { CookieHelper } from "../Components/CookieHelper"


export default function Waiting({channel, channel2, channel_joining}) {
    const { userData, setUserData, cookies, setCookie } = useContext(LandingContext);
    const { getCookies } = CookieHelper()
    const history = useHistory();

    const [names, setNames] = useState([]);
    const [copied, setCopied] = useState(false);
    const [playersLoaded, setPlayersLoaded] = useState(false);

    // Determine if we should display landing page (true) or loading icon (false)
    const [displayHtml, setDisplayHtml] = useState(false)


    // Endpoints used in Waiting
    const getUniqueImageInRoundURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getUniqueImageInRound/"
    const postAssignDeckURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/assignDeck";
    const getPlayersURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getPlayers/";
    const getImageURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getImageForPlayers/"
    const getRoundImageURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getRoundImage/"
    const postRoundImageURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/postRoundImage"


    // 3rd Party API Url's
    const clevelandURL = "https://openaccess-api.clevelandart.org/api/artworks"
    const chicagoURL = "https://api.artic.edu/api/v1/artworks?fields=id,title,image_id"
    const giphyURL = "https://api.giphy.com/v1/gifs/trending?api_key=Fo9QcAQLMFI8V6pdWWHWl9qmW91ZBjoK&"
    const harvardURL= "https://api.harvardartmuseums.org/image?apikey=c10d3ea9-27b1-45b4-853a-3872440d9782"
    const searchGooglePhotosURL = 'https://photoslibrary.googleapis.com/v1/mediaItems:search'


    // HOOK: useEffect()
    // DESCRIPTION: On first render, check if hooks are updated, load data from cookies if not    
    useEffect(() => {
        // Check if userData is empty (after refresh/new user)
        if(userData.host === "" || userData.roundNumber === "" || userData.playerUID === "" || userData.code === "" || userData.deckTitle === "" || userData.deckSelected === "" || userData.isApi === "" || userData.googlePhotos === "") {
            getCookies(["host", "roundNumber", "playerUID", "code", "deckTitle", "deckSelected", "isApi", "googlePhotos", "rounds", "roundDuration"], setDisplayHtml)
        }
        else
            setDisplayHtml(true)
    }, [])



    // HOOK: useEffect()
    // DESCRIPTION: Contains three functions that are responsible for getting players on mount, getting players continually after mount, and listening for start game signal from host
    useEffect(() => {
        // FUNCTION: getPlayersInitial()
        // DESCRIPTION: Get list of players in waiting on first render, store in names
        async function getPlayersInitial() {
            const names_db = [];

            await axios.get(getPlayersURL + userData.code)
            .then((res) => {
                for (var index = 0; index < res.data.players_list.length; index++) {
                    names_db.push(res.data.players_list[index].user_alias);
                }
                
                setNames(names_db);
                setPlayersLoaded(true);
            })
            .catch(err => console.error('error = ', err));
        }


        // FUNCTION: subscribeNewPlayers()
        // DESCRIPTION: Continually get players in waiting after each player joins
        async function subscribeNewPlayers() 
        {
            // Listen on ably channel for new players
            await channel.subscribe(newPlayer => {
                async function getPlayers () {
                    const names_db = [];
                    
                    await axios.get(getPlayersURL + userData.code)
                    .then((res) => {
                        for (var index = 0; index < res.data.players_list.length; index++) {
                            names_db.push(res.data.players_list[index].user_alias);
                        }
                       
                        setNames(names_db);
                       
                        console.log('Before channeljoining')
                        channel_joining.publish({
                            data: {
                                roundNumber: userData.roundNumber, 
                                path: window.location.pathname, 
                                alias: newPlayer.data.newPlayerName
                            }
                        })
                        
                        console.log('After channeljoining')
                       
                        
                    })
                    .catch(err => console.error('error = ', err));
                }
               
                getPlayers();
            });
        }


        // FUNCTION: subscribeStartGame()
        // DESCRIPTION: Listens for start game signal from host. 
        // Upon receiving signal, loads first round's image URL and transitions to page.
        async function subscribeStartGame() {
            await channel2.subscribe(newGame => {
                console.log("In subscribe 2")
                if(newGame.data.gameStarted) {
                    console.log("newGame data", newGame.data)
                
                    // Host did not send image URL over ably => get url from database and transition to page
                    if(newGame.data.currentImage.length === 0) {
                        const getImage = async () => {

                            await axios.get(getImageURL + userData.code + "," + userData.roundNumber)
                            .then((res) => {
                                console.log("GET Get Image For Players", res)

                                setUserData({
                                    ...userData,
                                    imageURL: res.data.image_url,
                                    deckTitle: newGame.data.deckTitle
                                })
                                console.log("cookies before setCookies waiting: 139 ", cookies.userData)
                                setCookie("userData",{
                                    ...cookies.userData,
                                    "imageURL": res.data.image_url,
                                    "deckTitle": newGame.data.deckTitle
                                })
                                console.log("Set Cookies in waiting: 139", cookies.userData)

                            })

                            history.push('/page');
                        };

                        getImage();
                    } else {
                        // Host sent image URL over ably. Save it and transition to page
                        setUserData({
                            ...userData,
                            imageURL: newGame.data.currentImage,
                            deckTitle: newGame.data.deckTitle

                        })
                        console.log("cookies before setCookies waiting: 158 ", cookies.userData)
                        setCookie("userData", {
                            ...cookies.userData,
                            "imageURL": newGame.data.currentImage,
                            "deckTitle": newGame.data.deckTitle
                        })
                        console.log("Set Cookies in waiting: 158 ", cookies.userData)

                        history.push('/page')
                    }
                    
                }
            })
        }
        
        
        if (userData.code) {
            subscribeNewPlayers();
            subscribeStartGame();
            getPlayersInitial()
        }

        
        return function cleanup() {
            channel.unsubscribe();
            channel2.unsubscribe();
        };
    }, [userData.code]);



    // FUNCTION: startPlaying()
     // DESCRIPTION: Called when clicking "Start Game", splits transition to next page flow for database decks and api decks
    async function startPlaying() {     
        if(!userData.isApi)
            getDatabaseImage()
        else
            getApiImage()
    }


    // FUNCTION: getApiImage()
    // DESCRIPTION: Assign deck in database, then load next round's image url and signal to start game
    const getApiImage = async () => {
        // POST /assignDeck to assign deckUID to current game in database
        let payload = {
            deck_uid: userData.deckSelected,
            game_code: userData.code
        }
        await axios.post(postAssignDeckURL, payload).then((res) => {
            console.log(res)
        })

        // Load next round's image URL
        let uniqueImage = await apiCall()

        setUserData({
            ...userData,
            imageURL: uniqueImage,
        })
        console.log("cookies before setCookies waiting: 219 ", cookies.userData)
        setCookie("userData", {
            ...cookies.userData,
            "imageURL": uniqueImage
        })
        console.log("Set Cookies in waiting: 219", cookies.userData)


        // Publish start game signal and imageURL to ably for guest players to use
        pub(uniqueImage)
    }


    // FUNCTION: apiCall()
    // DESCRIPTION: Gets a list of previously used images, then list of images from API. Selects/returns a unique url not in previously used images.
    const apiCall = async () => {
        let usedUrlArr = []
        let uniqueUrl = ""

        // Display loading screen while api's are called
        setDisplayHtml(false)


        // GET /getRoundImage gets previously used images
        await axios.get(getRoundImageURL + userData.code + ",0").then(res => {
            const result = res.data.result
            console.log("getRoundImage Result", result)
            for(let i = 0; i < result.length; i++) {
                usedUrlArr.push(result[i].round_image_uid)
            }
            console.log("usedUrlSet", usedUrlArr)
        })

        // Get set of photos from URLs, then select a unique image that hasn't been used
        if(userData.deckSelected === "500-000005"){
            // Google Photos API Call
            const body = {
                "pageSize": "50",
                "albumId":  userData.googlePhotos.albumId
            }
            const headers = {
                Accept: 'application/json',
                Authorization: 'Bearer ' + userData.googlePhotos.accessToken ,
            }
    
            await axios.post(searchGooglePhotosURL, body, {headers: headers})
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
            // Cleveland API Call
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
            // Chicago API Call
            await axios.get(chicagoURL, {limit : "20"}).then( res => {
                console.log("Chicago Res", res)
                while(true) {
                    let randomIndex = (Math.random() * 12).toFixed(0)

                    let chicagoImage = res.data.data[randomIndex]
                    console.log("RandomIndex", randomIndex)
                    console.log("ChicagoImage", chicagoImage)

                    let currentUrl = res.data.config.iiif_url + "/" + chicagoImage.image_id + "/full/843,/0/default.jpg"
                    if(chicagoImage.image_id !== undefined && !usedUrlArr.includes(currentUrl)){
                        uniqueUrl = currentUrl
                        console.log("unique url found", uniqueUrl)
                        break
                    }
                }
            })
        } else if (userData.deckSelected === "500-000008") {
            // Giphy API Call
            await axios.get(giphyURL, {limit : "20"}).then( res => {
                while(true) {
                    let randomIndex = (Math.random() * 20).toFixed(0)

                    let giphyImage = res.data.data[randomIndex]
                    if(giphyImage.images.original.url !== undefined && !usedUrlArr.includes(giphyImage.images.original.url)){
                        uniqueUrl = giphyImage.images.original.url
                        console.log("unique url found", uniqueUrl)
                        break
                    }
                }
            })
        } else if (userData.deckSelected === "500-000009") {
            // Harvard API Call
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


        // POST /postRoundImage posts the current url to used url list in database
        let payload = {
            "game_code": userData.code,
            "round_number": userData.roundNumber.toString(),
            "image": uniqueUrl
        }
        await axios.post(postRoundImageURL, payload).then(res => {
            console.log("postRoundImage", res)
        })

        // Remove loading icon
        setDisplayHtml(true)

        return uniqueUrl
    }


    // FUNCTION: getDatabaseImage()
    // DESCRIPTION: Gets unique image url for next round from database
    const getDatabaseImage = async () => {
        // POST /assignDeck to assign deckUID to current game in database
        let payload = {
            deck_uid: userData.deckSelected,
            game_code: userData.code,
        }
        await axios.post(postAssignDeckURL, payload).then((res) => {
            console.log(res)
        })

        // GET /getUniqueImageInRound to get a unique image url for next round
        await axios.get(getUniqueImageInRoundURL + userData.code + "," + userData.roundNumber).then((res) => {
            console.log('GET Get Unique Image In Round', res);

            setUserData({
                ...userData,
                imageURL: res.data.image_url
            })
            console.log("cookies before setCookies waiting: 385 ", cookies.userData)
            setCookie("userData", {
                ...cookies.userData,
                "imageURL": res.data.image_url
            })
            console.log("Set Cookies in waiting: 385", cookies.userData)


            // Publish start game signal to ably
            pub();
        })
    }


    // FUNCTION: getDatabaseImage()
    // DESCRIPTION: Sends start game flag to ably. If using API deck, also sends next round's image to ably.
    const pub = (apiURL)=> {
        if(userData.isApi){
            channel2.publish({data: {
                gameStarted: true,
                currentImage: apiURL,
                deckTitle: userData.deckTitle
            }});
        }
        else
            channel2.publish({data: {
                gameStarted: true,
                currentImage: "",
                deckTitle: userData.deckTitle
            }});

        history.push("/page");
    };

    // HOOK: useEffect()
    // DESCRIPTION: Reset "copied" text on timer button
    useEffect(() => {
        if (copied) {
            setTimeout(() => {
                setCopied(false);
            }, 10000);
        }
    }, [copied])
    


    return (
        displayHtml ? 
            // Waiting page HTML
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
                        children=' Game Rules'
                    />
                </Link>
                <h4>Waiting for all players to join</h4>
                {/* Add spinner */}
                
                
                <ul className="flex-container">
                {playersLoaded ? (
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
                    children={"Game Code: " + userData.code}
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
                        navigator.clipboard.writeText(userData.code);
                    }}
                    destination="/waiting"
                    conditionalLink={true}
                />

                <br></br>

                
                {userData.host && userData.deckSelected === "" ? <Button
                    className="landing"
                    children="Select Deck"
                    destination="/collections"
                    conditionalLink={true}  
                />
                : <></>}

                {userData.host && userData.deckSelected !== "" ? 
                    <Button
                        className="landing"
                        children="Start Game"
                        onClick={() => startPlaying()}
                        conditionalLink={true}  
                    />
                    : <></>
                }
            </div> : 
            // Loading icon HTML
            <div>
                <h1>Loading game data...</h1>
                <ReactBootStrap.Spinner animation="border" role="status"/>
            </div>
    )
}