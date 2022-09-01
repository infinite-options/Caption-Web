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

    const { userData, setUserData, cookies, setCookie } = useContext(LandingContext);
    const [names, setNames] = useState([]);
    const [copied, setCopied] = useState(false);
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    let gameCodeText = "Game Code: " + userData.code;


    const getUniqueImageInRound = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getUniqueImageInRound/"
    const postAssignDeckURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/assignDeck";



    // Load cookies into userData state on first render
    useEffect(() => {
        const getCookies = (propsToLoad) => {
            let localCookies = cookies.userData
            let cookieLoad = {}

            for(let i = 0; i < propsToLoad.length; i++) {
                let propName = propsToLoad[i]

                if(cookieLoad[propName] !== userData[propName])
                    cookieLoad[propName] = localCookies[propName]
            }


            let newUserData = {
                ...userData,
                ...cookieLoad
            }

            setUserData(newUserData)
        }


        getCookies(["host", "roundNumber", "name", "alias", "email", "zipCode", "playerUID", "rounds", "roundDuration", "code", "deckTitle", "deckSelected", "isApi", "googlePhotos"])
    }, [])


    // Sets cookies for state variables in propsToPut array.
    // If updating state right before calling putCookies(), call putCookies(["stateName"], {"stateName": "stateValue"}) with a literal
    // state value to update cookie correctly.
    const putCookies = (propsToPut, instantUpdate) => {
        let localCookies = {}
        
        if(cookies.userData === undefined) {
            setCookie("userData", {})
        } else {
            localCookies = cookies.userData
        }

        for(let i = 0; i < propsToPut.length; i++) {
            const propName = propsToPut[i]

            // State variable not updated, reference instantUpdate
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


    useEffect(() => {
        // Get players list on first render
        async function getPlayers1() {
            const names_db = [];

            const getURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getPlayers/";
            await axios.get(getURL + userData.code)
            .then((res) => {
                for (var index = 0; index < res.data.players_list.length; index++) {
                    names_db.push(res.data.players_list[index].user_alias);
                }
                
                setNames(names_db);
                // console.log("before loading")
                setLoading(true);
                // console.log("After loading")
            })
            .catch(err => console.error('error = ', err));
        }


        // Continually get players list after each player joins
        async function subscribe1() 
        {
            
            await channel.subscribe(newPlayer => {
               
                async function getPlayers () {
                    
                    const names_db = [];
                    
                    const getURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getPlayers/";
                    await axios.get(getURL + userData.code)
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


        // Guest start game flow upon receiving start game flag in ably
        async function subscribe2() 
        {
            await channel2.subscribe(newGame => {
                console.log("In subscribe 2")
                if(newGame.data.gameStarted) {
                    console.log("newGame data", newGame.data)

                    setUserData({
                        ...userData,
                        deckTitle: newGame.data.deckTitle
                    })
                    putCookies(["deckTitle"], {"deckTitle": newGame.data.deckTitle})
            

                    if(newGame.data.currentImage.length === 0) {
                        const getImage = async () => {
                            const getImageURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getImageForPlayers/";
                            await axios.get(getImageURL + userData.code + "," + userData.roundNumber)
                            .then((res) => {
                                console.log("GET Get Image For Players", res);
                                setUserData({
                                    ...userData,
                                    imageURL: res.data.image_url
                                })
                                putCookies(["imageURL"], {"imageURL": res.data.image_url})
                            })

                            history.push('/page');
                        };

                        getImage();
                    } else {
                        setUserData({
                            ...userData,
                            imageURL: newGame.data.currentImage
                        })
                        putCookies(["imageURL"], {"imageURL": newGame.data.currentImage})
                        history.push('/page')
                    }
                    
                }
            })
        }
        

        if (userData.code) {
            subscribe1();
            subscribe2();
            getPlayers1()
        }

        
        return function cleanup() {
            channel.unsubscribe();
            channel2.unsubscribe();
        };
    }, [userData.code]);



    
    async function startPlaying() {     
        if(!userData.isApi)
            getDatabaseImage()
        else
            getApiImage()
    }


    const getApiImage = async () => {
        let payload = {
            deck_uid: userData.deckSelected,
            game_code: userData.code
        }
        await axios.post(postAssignDeckURL, payload).then((res) => {
            console.log(res)
        })


        let uniqueImage = await apiCall()

        setUserData({
            imageURL: uniqueImage,
        })
        putCookies(
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
                    if(chicagoImage.image_id !== undefined && !usedUrlArr.includes(currentUrl)){
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


    const getDatabaseImage = async () => {
        let payload = {
            deck_uid: userData.deckSelected,
            game_code: userData.code,
        }
        await axios.post(postAssignDeckURL, payload).then((res) => {
            console.log(res)
        })

        await axios.get(getUniqueImageInRound + userData.code + "," + userData.roundNumber).then((res) => {
            console.log('GET Get Unique Image In Round', res);

            setUserData({
                ...userData,
                imageURL: res.data.image_url
            })
            putCookies(
                ["imageURL"], 
                {"imageURL": res.data.image_url}
            )

            setLoading(true)
            pub();
        })
    }


    // Sends start game flag to ably
    // If using API deck, sends next round's image to ably
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


    // Reset "copied" text on timer button
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

            {}
            

        </div>
    )
}