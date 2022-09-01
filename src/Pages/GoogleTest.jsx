import { useContext, useState } from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
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
    const [albumImages, setAlbumImages] = useState([])


    const clientID = "336598290180-69pe1qeuqku450vnoi8v1ehhi19jhpmt.apps.googleusercontent.com"
    const clientSecret = "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"
    const currentHost = window.location.origin
    let imageUrls = []    


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


        getCookies(["host", "roundNumber", "name", "alias", "email", "zipCode", "playerUID", "rounds", "roundDuration", "code", "deckSelected", "isApi"])
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

        
        console.log("local cookies end", localCookies)

        //hardcode
        // setCookie("userData", {
        //     ...localCookies,
        //     //photosFromAPI: ["1", "2", "3"]
        //     photosFromAPI: ['https://lh3.googleusercontent.com/lr/AFz2ejRAKojRd…j29wuf4sK7i9_Gn8-HeIlpw82oQ_bhp6CnLCJky-RxdjQxjiY', 'https://lh3.googleusercontent.com/lr/AFz2ejSNZUUan…Qapb4GptGjsViFI5tjYIV66yZjOZZ5ZsS-mUiCMYGwHUWv-mA', 'https://lh3.googleusercontent.com/lr/AFz2ejSBUlRL3…0FZPrOVj2wJATo5_cboiX2mOZNaZblX7tVCpa9m18Aiz75sgI', 'https://lh3.googleusercontent.com/lr/AFz2ejR2U1p7v…i4TBE58I6EZ3wUunxFvVbC9QO3SvuxwCThP3r8On1Vbyv6duA', 'https://lh3.googleusercontent.com/lr/AFz2ejT4eTnvU…7qaQcGy9tc_vTfb3cUitJhWQoCjEW55ZoDOc2gr3KM9-Pt3Nc', 'https://lh3.googleusercontent.com/lr/AFz2ejRWKqEXP…Pedk1GPufg7bj5iHdSfnV3MV42ZW2G8Xwa87YZJ13wg9L1Hvk', 'https://lh3.googleusercontent.com/lr/AFz2ejTDKoteW…KDgWs5-8-RevMS2xGR8C_o8T8rpP0WRcDxbbdYkr9PxZbW2TA', 'https://lh3.googleusercontent.com/lr/AFz2ejRAu9eMo…81dp7VZVZZFzzrfNhrgoVqN54iqvTg5iwlaxPFif8UHam8U0g']
        //     //photosFromAPI: userData.photosFromAPI
        // })
        // setCookie("userData", localCookies)
        //console.log("local cookies end", localCookies)
        //  setCookie("userData", {
        //     ...localCookies
        // })

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

        axios.post('https://photoslibrary.googleapis.com/v1/mediaItems:search', body, {headers: headers})
        .then(res => {
            //console.log("res.data.mediaItems", res.data.mediaItems)
            imageUrls = res.data.mediaItems.map(picture => {
                return picture.baseUrl
            })
            setAlbumImages(imageUrls)

        })
    }
    
    
    // TO DO: alert user if max images less than round number
    // Select dummy deck in DB and transition to waiting room
    const submitAlbum = () => {
        console.log("move back to waiting room")

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
            

        // putCookies(
        //     ["deckSelected", "deckTitle"],
        //     {"deckSelected": "500-000009", "deckTitle": "Google Photos"}
        // )

        const payload = {
            game_code: userData.code,
            deck_uid: "500-000009",
            round_number: userData.roundNumber.toString(),
        };

        console.log('payload for deck = ', payload);
        const postURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/selectDeck";
        axios.post(postURL, payload);

        

        console.log("Cookies before waiting", cookies.userData)

        history.push('/waiting')
    }

    return (
        <div id="page-sizing">
            {/* <GoogleOAuthProvider clientId={clientID}> */}
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

            {/* </GoogleOAuthProvider> */}
        </div>
    )
}

export default GoogleTest