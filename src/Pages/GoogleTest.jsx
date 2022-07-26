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

    const {code, roundNumber, photosFromAPI, setPhotosFromAPI, setDeckSelected} = useContext(LandingContext)

    const [tokens, setTokens] = useState({})
    const [albums, setAlbums] = useState([])
    const [signedIn, setSignedIn] = useState(false)
    const [selectedAlbum, setSelectedAlbum] = useState("")

    const clientID = "336598290180-69pe1qeuqku450vnoi8v1ehhi19jhpmt.apps.googleusercontent.com"
    const clientSecret = "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"

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
                redirect_uri: "http://localhost:3000",
                grant_type: "authorization_code"
                
            })
            .then(res => {                
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
        .then( res => {
            const imageUrls = res.data.mediaItems.map(picture => {
                return picture.baseUrl
            })

            console.log('Image URLS', imageUrls)
            setPhotosFromAPI(imageUrls)
        })
    }
    
    useEffect(() => {
        console.log('Tokens', tokens)
        console.log('Albums', albums)
        console.log('Photos Set', photosFromAPI)
    })


    const submitAlbum = () => {
        console.log("move to next page")

        const payload = {
            game_code: code,
            deck_uid: "500-000009",
            round_number: roundNumber.toString(),
        };

        console.log('payload for deck = ', payload);
        const postURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/selectDeck";
        axios.post(postURL, payload);

        setDeckSelected(true)
        history.push('/waiting')
    }

    return (
        <div>
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