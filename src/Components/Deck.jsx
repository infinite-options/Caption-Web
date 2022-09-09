import React, {useContext} from "react";
import "../Styles/Deck.css";
import {Link} from "react-router-dom";
import axios from "axios";
import {LandingContext} from "../App";



export default function DeckCard({googlePhotos, cleveland, chicago, giphy, harvard, id, title, price, src, alt}) {
    const { userData, setUserData, cookies, setCookie} = useContext(LandingContext);
    
    const selectDeckURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/selectDeck";

    // Decide next page
    let nextPage = "/waiting"
    if(title === "Google Photos")
            nextPage = "/googleAuth"


    // FUNCTION: selectThisDeck()
    // DESCRIPTION: When deck is clicked, determine if we use database or api deck, then save deck id to database
    async function selectThisDeck() {
        let apiStatus = false

        // Decide if we are using api or database deck
        if(title === "Google Photos"){
            console.log("Google Photos API selected. Switching to Google Sign-in Page.")

            setUserData({
                ...userData,
                isApi: true
            })
            setCookie("userData", {
                ...cookies.userData,
                "isApi": true
            }, { path: '/' })
            return
        }
        else if(title === "Cleveland Gallery" || title === "Chicago Gallery" || title === "Giphy Gallery" || title === "Harvard Gallery"){
            console.log("API Deck Selected: ", title) 
            apiStatus = true;
        }
        else {
            console.log("Database Deck Selected: ", title)
        }

        // POST /selectDeck selects deck for current game in database
        let payload =  {
            game_code: userData.code,
            deck_uid: id,
            round_number: userData.roundNumber.toString(),
        }
        await axios.post(selectDeckURL, payload).then(res => console.log("Select Deck", res))

        setUserData({
            ...userData,
            deckSelected: id,
            deckTitle: title,
            isApi: apiStatus
        })
        setCookie("userData", {
            ...cookies.userData,
            "deckSelected": id,
            "deckTitle": title,
            "isApi": apiStatus
        }, { path: '/' })
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
