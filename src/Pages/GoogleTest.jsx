import { useContext, useState } from "react";
import { GoogleOAuthProvider, useGoogleLogin, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import TestButton from "../Components/TestButton";
import { useEffect } from "react";
import "../Styles/GooglePhotos.css"
import { useHistory } from 'react-router-dom';
import { LandingContext } from "../App";

const GoogleTest = () => {
    const history = useHistory();
    const {code, roundNumber, photosFromAPI, setCode, setName, setEmail, setZipCode, setAlias, setGameUID, setRounds, setRoundDuration, setHost, setRoundNumber, setPlayerUID, setImageURL, setScoreboardInfo, setPhotosFromAPI, setDeckSelected, setDeckTitle, cookies, setCookie} = useContext(LandingContext)

    const [tokens, setTokens] = useState({})
    const [albums, setAlbums] = useState([])
    const [signedIn, setSignedIn] = useState(false)
    const [selectedAlbum, setSelectedAlbum] = useState("")

    const clientID = "336598290180-69pe1qeuqku450vnoi8v1ehhi19jhpmt.apps.googleusercontent.com"
    const clientSecret = "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"
    const currentHost = window.location.origin

    console.log("Google Cookies", cookies)
    loadCookies()

    // OAuth Flow
    // https://developers.google.com/identity/oauth2/web/guides/how-user-authz-works

    const login = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: async response => {
            // Exchange auth code for access/refresh tokens
            axios.post('https://oauth2.googleapis.com/token', { 
                code: response.code,
                client_id: clientID,
                client_secret: clientSecret,
                redirect_uri: currentHost,
                grant_type: "authorization_code"
                
            })
            .then(res => {      
                console.log("Access + Refresh Tokens", res)          
                setSignedIn(true)
                setTokens(res.data)

                const headers = {
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + res.data.access_token ,
                }
                
                axios.get('https://photoslibrary.googleapis.com/v1/sharedAlbums', { headers: headers })
                .then(res => {
                    setAlbums(res.data.sharedAlbums)
                })
            })
        },
        onFailure: response => console.log(response),
        scope: "https://www.googleapis.com/auth/photoslibrary.readonly"
    })


    // Display album choice buttons if signed in
    const chooseAlbums = () => {
        if(albums !== null) {
            return albums.map(entry => {
                return (
                    <div>
                        <button id="buttons" onClick={() => {
                            setSelectedAlbum(entry.title)
                            getPhotos(entry)
                        }}>
                            {entry.title}
                        </button>         
                    </div>
                        
                )
            })
        }
    }

    // Get photos for "entry" album
    function getPhotos(entry) {
        const body = {
            "pageSize": "100",
            "albumId": entry.id
        }

        const headers = {
            Accept: 'application/json',
            Authorization: 'Bearer ' + tokens.access_token ,
        }

        axios.post('https://photoslibrary.googleapis.com/v1/mediaItems:search', body, {headers: headers})
        .then(res => {
            const imageUrls = res.data.mediaItems.map(picture => {
                return picture.baseUrl
            })

            console.log('Image URLS', imageUrls)
            setPhotosFromAPI(imageUrls)
            setCookie("photosFromAPI", imageUrls)
        })
    }
    
    
    // Select dummy deck in DB and transition to waiting room
    const submitAlbum = () => {
        console.log("move back to waiting room")

        const payload = {
            game_code: code,
            deck_uid: "500-000009",
            round_number: roundNumber.toString(),
        };

        console.log('payload for deck = ', payload);
        const postURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/selectDeck";
        axios.post(postURL, payload);

        setDeckSelected("500-000009")
        setCookie("deckSelected", "500-000009")

        history.push('/waiting')
    }


    useEffect(() => {
        console.log('Tokens', tokens)
        console.log('Albums', albums)
        console.log('Photos Set', photosFromAPI)
    })


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



    return (
        <div id="page-sizing">
            <GoogleOAuthProvider clientId={clientID}>
                <br></br>
                <div>
                    { signedIn 
                        ? <h4>{"Select an album to create a deck"}</h4>
                        : <div>
                            <h4>Sign in to play with an album</h4>
                            <button id="buttons" onClick={() => login()}>Log In to Google Photos</button>
                          </div>
                    }
                </div>
                
                <div>
                    {chooseAlbums()}
                </div>
                
                <br></br>
                <div id="google-image-wrapper">
                    {photosFromAPI.map(url => {
                        return <img id="google-image" src={url}></img>
                    })}
                </div>
                
                <br></br>
                { selectedAlbum === ""
                    ? ""
                    : <button id="buttons" onClick={() => submitAlbum()}>Play with {selectedAlbum}</button>
                }

            </GoogleOAuthProvider>
        </div>
    )
}

export default GoogleTest