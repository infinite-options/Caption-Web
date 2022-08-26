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
    const { userData, setUserData, cookies, setCookie } = useContext(LandingContext)

    const [tokens, setTokens] = useState({})
    const [albums, setAlbums] = useState([])
    const [signedIn, setSignedIn] = useState(false)
    const [selectedAlbum, setSelectedAlbum] = useState("")

    const clientID = "336598290180-69pe1qeuqku450vnoi8v1ehhi19jhpmt.apps.googleusercontent.com"
    const clientSecret = "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"
    const currentHost = window.location.origin

    console.log("Google Cookies", cookies)


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


        getCookies(["host", "roundNumber", "name", "alias", "email", "zipCode", "playerUID", "rounds", "roundDuration", "code", "deckTitle", "deckSelected", "photosFromAPI"])
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
                console.log("propName: ", propName)
                console.log("localCookies: ", localCookies[propName])
                console.log("instantUpdate: ", instantUpdate[propName])
                localCookies[propName] = instantUpdate[propName]
            } 
            // State already updated, reference userData
            else {
                localCookies[propName] = userData[propName]
            }
        }

    
        console.log("local cookies end", localCookies)
        setCookie("userData", localCookies)
    }

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


            setUserData({
                ...userData,
                photosFromAPI: imageUrls
            })

            putCookies(
                ["photosFromAPI"],
                {"photosFromAPI": imageUrls}
            )
        })
    }
    
    
    // Select dummy deck in DB and transition to waiting room
    const submitAlbum = () => {
        console.log("move back to waiting room")

        const payload = {
            game_code: userData.code,
            deck_uid: "500-000009",
            round_number: userData.roundNumber.toString(),
        };

        console.log('payload for deck = ', payload);
        const postURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/selectDeck";
        axios.post(postURL, payload);


        setUserData({
            ...userData,
            deckSelected: "500-000009"
        })

        putCookies(
            ["deckSelected"],
            {"deckSelected": "500-000009"}
        )
        history.push('/waiting')
    }


    useEffect(() => {
        console.log('Tokens', tokens)
        console.log('Albums', albums)
        console.log('Photos Set', userData.photosFromAPI)
    })


    



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
                    {userData.photosFromAPI.map(url => {
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