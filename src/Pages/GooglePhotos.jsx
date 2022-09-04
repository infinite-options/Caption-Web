import { useContext, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import * as ReactBootStrap from 'react-bootstrap';
import { useEffect } from "react";
import "../Styles/GooglePhotos.css"
import { useHistory } from 'react-router-dom';
import { LandingContext } from "../App";
import { CookieHelper } from "../Components/CookieHelper"


const GooglePhotos = () => {
    const history = useHistory();
    const { userData, setUserData, cookies, setCookie } = useContext(LandingContext)
    const { getCookies } = CookieHelper()

    const [tokens, setTokens] = useState({})
    const [albums, setAlbums] = useState([])
    const [signedIn, setSignedIn] = useState(false)
    const [selectedAlbum, setSelectedAlbum] = useState("")
    const [albumImages, setAlbumImages] = useState([])

    // Determine if we should display landing page (true) or loading icon (false)
    const [displayHtml, setDisplayHtml] = useState(false)

    // Endpoints used in GooglePhotos
    const selectDeckURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/selectDeck";
    const searchGooglePhotosURL = "https://photoslibrary.googleapis.com/v1/mediaItems:search"


    const clientID = "336598290180-69pe1qeuqku450vnoi8v1ehhi19jhpmt.apps.googleusercontent.com"
    const clientSecret = "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"


    // HOOK: useEffect()
    // ARGUMENTS: []
    // DESCRIPTION: On first render, check if hooks are updated, load data from cookies if not    
    useEffect(() => {
        // Check if userData is empty (after refresh/new user)
        if(userData.name === "" || userData.email === "" || userData.zipCode === "" || userData.alias === "") {
            getCookies(["roundNumber", "rounds", "roundDuration", "code", "deckSelected", "isApi"], setDisplayHtml)
        }
        else
            setDisplayHtml(true)
    }, [])
    

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
                redirect_uri: window.location.origin,
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


    // Get photos for "entry" album, called when clicking on an album
    function getPhotos(entry) {
        setUserData({
            ...userData,
            googlePhotos: {
                albumId: entry.id,
                accessToken: tokens.access_token
            }
        })

        const body = {
            "pageSize": "50",
            "albumId": entry.id
        }

        const headers = {
            Accept: 'application/json',
            Authorization: 'Bearer ' + tokens.access_token ,
        }

        axios.post(searchGooglePhotosURL, body, {headers: headers})
        .then(res => {
            //console.log("res.data.mediaItems", res.data.mediaItems)
            let imageUrls = res.data.mediaItems.map(picture => {
                return picture.baseUrl
            })
            setAlbumImages(imageUrls)

        })
    }
    
    
    // TO DO: alert user if max images less than round number
    // Select dummy deck in DB and transition to waiting room
    const submitAlbum = async () => {
        console.log("Transition back to waiting room")

        let maxImagesForAlbum = albumImages.length
        if(maxImagesForAlbum < userData.rounds) {
            setUserData({
                ...userData,
                rounds: maxImagesForAlbum,
                deckSelected: "500-000005",
                deckTitle: "Google Photos: " + selectedAlbum,
            })
            setCookie("userData", {
                ...cookies.userData,
                "rounds": maxImagesForAlbum,
                "deckSelected": "500-000005",
                "deckTitle": "Google Photos: " + selectedAlbum,
                "googlePhotos": userData.googlePhotos
            })

            // alert user max images less than original rounds
        } else {
            setUserData({
                ...userData,
                deckSelected: "500-000005",
                deckTitle: "Google Photos: " + selectedAlbum,
            })
            setCookie("userData", {
                ...cookies.userData,
                "deckSelected": "500-000005",
                "deckTitle": "Google Photos: " + selectedAlbum,
                "googlePhotos": userData.googlePhotos
            })
        }

        const payload = {
            game_code: userData.code,
            deck_uid: "500-000009",
            round_number: userData.roundNumber.toString(),
        };
        await axios.post(selectDeckURL, payload).then( res => {
            console.log("POST /SelectDeck", res)
        });

        history.push('/waiting')
    }


    return (
        displayHtml ? 
            // Landing page HTML
            <div id="page-sizing">
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
                    {albumImages.map(url => {
                        return <img id="google-image" src={url}></img>
                    })}
                </div>
                
                <br></br>
                { selectedAlbum === ""
                    ? ""
                    : <button id="buttons" onClick={submitAlbum}>Play with {selectedAlbum}</button>
                }
            </div> :
            // Loading icon HTML
            <div>
                <h1>Loading game data...</h1>
                <ReactBootStrap.Spinner animation="border" role="status"/>
            </div>
    )
}

export default GooglePhotos