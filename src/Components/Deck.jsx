import React, {useContext} from "react";
import "../Styles/Deck.css";
import { useHistory } from "react-router-dom";
import {Link} from "react-router-dom";

import axios from "axios";
import {LandingContext} from "../App";
import { useEffect } from "react";

export default function DeckCard(props) {
    const { userData, setUserData, cookies, setCookie} = useContext(LandingContext);

    const clevelandURL = "https://openaccess-api.clevelandart.org/api/artworks"
    const chicagoURL = "https://api.artic.edu/api/v1/artworks?fields=id,title,image_id"
    const giphyURL = "https://api.giphy.com/v1/gifs/trending?api_key=Fo9QcAQLMFI8V6pdWWHWl9qmW91ZBjoK&"
    const harvardURL= "https://api.harvardartmuseums.org/image?apikey=c10d3ea9-27b1-45b4-853a-3872440d9782";
    const selectDeckURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/selectDeck";


    const record = [];
    const image_url=[];

    let nextPage = "/waiting"

    let api_deck_uid = "500-000009"
    let payload =  {
        game_code: userData.code,
        deck_uid: api_deck_uid,
        round_number: userData.roundNumber.toString(),
    }
    const params = {
        limit : "20"
    }

    // Change next page to 
    if(props.googlePhotos === true)
        nextPage = "/googleAuth"


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


            let newUserData = {
                ...userData,
                ...cookieLoad
            }

            setUserData(newUserData)
        }


        getCookies(["host", "roundNumber", "name", "alias", "email", "zipCode", "playerUID", "rounds", "roundDuration", "code"])
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



    //Get Photos from APIs (Each API has own response format)
    async function getData(url){
        await axios.get(url,{params}).then((res)=>{
            console.log("res", res)
            //Cleveland
            if(url === clevelandURL){
                for(const image of res.data.data){
                    console.log(image)
                    if(image.images !== null && image.images.web !== null)
                        record.push(image.images.web.url);
                }
                // console.log("Cleveland Records After pushing",record)
            }
            //Chicago
            else if(url === chicagoURL){
                for(const chicagoImage of res.data.data){
                    record.push(chicagoImage.image_id)
                }
                console.log("Chicago record", record)
                for(var i=0;i<record.length;i++){
                    image_url.push(res.data.config.iiif_url + "/" + record[i] + "/full/843,/0/default.jpg")
                }
                // console.log("Chicago Image URL",image_url)
            }
            //Giphy
            else if(url === giphyURL){
                console.log("Giphy Response",res.data.data);
                for(const giphyImage of res.data.data){
                    record.push(giphyImage.images.original.url);
                }
                    // console.log("Giphy Image URL", record)
            }
            //Harvard
            else if(url === harvardURL){
                console.log("Harvard Response",res.data);
                console.log("Harvard",res.data.records)
                for(const harvardImage of res.data.records){
                    record.push(harvardImage.baseimageurl)
                }
                // console.log("Harvard Image URL", record)
            }
        })
    }
    

    async function selectThisDeck() {
        if(props.googlePhotos === true){
            console.log("Google Photos API selected. Switching to Google Sign-in Page.")

            setUserData({
                ...userData,
                deckSelected: api_deck_uid
            })

            putCookies(
                ["deckSelected"], 
                {"deckSelected": api_deck_uid}
            )
            return
        }
        else if(props.cleveland){
            console.log("Cleveland API Selected") 
            getData(clevelandURL).then(() => {
                setUserData({
                    ...userData,
                    deckSelected: api_deck_uid,
                    photosFromAPI: record
                })

                console.log('record', record)
    
                putCookies(
                    ["deckSelected", "photosFromAPI"], 
                    {"deckSelected": api_deck_uid, "photosFromAPI": record}
                )
            })
            
        }
        //Chicago
        else if(props.chicago){
            console.log("Chicago API Selected") 
            getData(chicagoURL).then(() => {
                setUserData({
                    ...userData,
                    deckSelected: api_deck_uid,
                    photosFromAPI: image_url
                })

                console.log("imageurl", image_url)
    
                putCookies(
                    ["deckSelected", "photosFromAPI"], 
                    {"deckSelected": api_deck_uid, "photosFromAPI": image_url}
                )
            })
            
        }
        //Giphy
        else if(props.giphy){
            console.log("Giphy API selected")
            getData(giphyURL).then(() => {
                setUserData({
                    ...userData,
                    deckSelected: api_deck_uid,
                    photosFromAPI: record
                })

                console.log('record', record)
    
                putCookies(
                    ["deckSelected", "photosFromAPI"], 
                    {"deckSelected": api_deck_uid, "photosFromAPI": record}
                )
            })
            
        }
        //Harvard
        else if(props.harvard){
            console.log("Harvard API selected")
            getData(harvardURL).then(() => {

                setUserData({
                    ...userData,
                    photosFromAPI: record,
                    deckSelected: api_deck_uid
                })

                putCookies(
                    ["photosFromAPI", "deckSelected"], 
                    {"photosFromAPI": record, "deckSelected": api_deck_uid}
                )
            })
            
        }
        // Decks from Database
        else {
            payload = {
                game_code: userData.code,
                deck_uid: props.id,
                round_number: userData.roundNumber.toString(),
            };

            setUserData({
                ...userData,
                deckSelected: props.id,
                deckTitle: props.title
            })

            putCookies(
                ["deckSelected"],
                {"deckSelected": props.id}
            )
        }

        await axios.post(selectDeckURL, payload).then(res => console.log(res))

        putCookies(
            ["deckTitle"],
            {"deckTitle": props.title}
        )
    }
  
    return (
        <Link to={nextPage} className="btn-mobile" onClick = {selectThisDeck}>
            
            <div className="outer">
                <div className="imageBackground">
                    <img src={props.src} alt={props.alt} className="img1"/>
                    {/*<img src="https://iocaptions.s3.us-west-1.amazonaws.com/Amrita-Marino-NewYorkTimes-Worldnet-001-t.gif" alt={props.alt} className="img1"/>*/}
                </div>

                {props.title === "" ? <></> :
                    <div>
                        <div className="deckText">
                            {props.title} ({props.price})
                        </div>
                        <Link to="/deckinfo" className="linkText">
                            Learn More
                        </Link>
                    </div>
                }
            </div>
        </Link>

    );
}
