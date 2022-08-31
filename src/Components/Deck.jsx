import React, {useContext} from "react";
import "../Styles/Deck.css";
import { useHistory } from "react-router-dom";
import {Link} from "react-router-dom";

import axios from "axios";
import {LandingContext} from "../App";
import { useEffect } from "react";

export default function DeckCard({googlePhotos, cleveland, chicago, giphy, harvard, id, title, price, src, alt}) {
    const { userData, setUserData, cookies, setCookie} = useContext(LandingContext);

    const selectDeckURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/selectDeck";


    let nextPage = "/waiting"
    if(title === "Google Photos")
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

            setUserData({
                ...userData,
                ...cookieLoad
            })
        }

        getCookies(["host", "roundNumber", "name", "alias", "email", "zipCode", "playerUID", "rounds", "roundDuration", "code"])
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

            // State has not updated, referecnce instantUpdate
            if(instantUpdate !== undefined && instantUpdate[propName] !== undefined) {
                localCookies[propName] = instantUpdate[propName]
            } 
            // State already updated, reference userData
            else {
                localCookies[propName] = userData[propName]
            }
        }

        setCookie("userData", localCookies)
    }
    

    
    async function selectThisDeck() {
        let apiStatus = false

        if(title === "Google Photos"){
            console.log("Google Photos API selected. Switching to Google Sign-in Page.")

            setUserData({
                ...userData,
                isApi: true
            })

            putCookies(
                ["isApi"], 
                {"isApi": true}
            )
            return
        }
        else if(title === "Cleveland Gallery" || title === "Chicago Gallery" || title === "Giphy Gallery" || title === "Harvard Gallery"){
            console.log(title, " API Selected") 
            apiStatus = true;
        }
        else {
            // payload = {
            //     game_code: userData.code,
            //     deck_uid: id,
            //     round_number: userData.roundNumber.toString(),
            // };
         
        }

        let payload =  {
            game_code: userData.code,
            deck_uid: id,
            round_number: userData.roundNumber.toString(),
        }

        await axios.post(selectDeckURL, payload).then(res => console.log(res))

        setUserData({
            ...userData,
            deckSelected: id,
            deckTitle: title,
            isApi: apiStatus
        })

        putCookies(
            ["deckSelected", "deckTitle", "isApi"],
            {"deckSelected": id, "deckTitle": title, "isApi": apiStatus}
        )
    }
  
    return (
        <Link to={nextPage} className="btn-mobile" onClick = {selectThisDeck}>
            
            <div className="outer">
                <div className="imageBackground">
                    <img src={src} alt={alt} className="img1"/>
                    {/*<img src="https://iocaptions.s3.us-west-1.amazonaws.com/Amrita-Marino-NewYorkTimes-Worldnet-001-t.gif" alt={props.alt} className="img1"/>*/}
                </div>

                {title === "" ? <></> :
                    <div>
                        <div className="deckText">
                            {title} ({price})
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
