import React, {useContext} from "react";
import "../Styles/Deck.css";
import {Link} from "react-router-dom";
import axios from "axios";
import {LandingContext} from "../App";
import cheerio from "cheerio";



export default function DeckCard({googlePhotos, cleveland, chicago, giphy, harvard, id, title, price, src, alt}) {
    const { userData, setUserData, cookies, setCookie} = useContext(LandingContext);

    const selectDeckURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/selectDeck";

    // FUNCTION: getCnnImgURLs
    // DESCRIPTION: Web scrapes the URL page source for <script> tag then adds img URLs to list
    async function getCnnImgURLs(URL){
        const htmlString = await axios.get(URL).then(response => response.data)
        const $ = cheerio.load(htmlString)
        const scriptString = $("script")
        const scriptObj = JSON.parse($(scriptString[3]).text())
        const imgItems = scriptObj.hasPart.mainEntity.itemListElement
        let imgURLs = []
        for (let i = 0; i < imgItems.length; i++){
            imgURLs.push(imgItems[i].item.url)
        }
        return imgURLs
    }

    // FUNCTION: getCurrentCnnURL
    // DESCRIPTION: Starting from today, iterates through the past 365 days for the most current valid CNN URL
    async function getCurrentCnnURL() {
        const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]
        let cnnURL = ""
        let beginDate = new Date()
        let endDate = new Date()
        beginDate.setDate(endDate.getDate() - 7)
        for (let i = 0; i <= 365; i++) {
            let beginDay = beginDate.getDate(), beginMonth = beginDate.getMonth()
            let endDay = endDate.getDate(), endMonth = endDate.getMonth(), endYear = endDate.getFullYear()
            let potentialCnnURL = `https://www.cnn.com/${endYear}/${endMonth + 1}/${endDay}/world/gallery/photos-this-week-${months[beginMonth]}-${beginDay}-${months[endMonth]}-${endDay}`
            try {
                cnnURL = await axios.get(potentialCnnURL).then(response => response.config.url)
                break
            } catch (error) {
                beginDate.setDate(beginDate.getDate() - 1)
                endDate.setDate(endDate.getDate() - 1)
            }
        }
        return getCnnImgURLs(cnnURL)
    }

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
        else if(title === "Cleveland Gallery" || title === "Chicago Gallery" || title === "Giphy Gallery" || title === "Harvard Gallery" || title === "CNN Gallery"){
            console.log("API Deck Selected: ", title) 
            apiStatus = true;
            if(title === "CNN Gallery"){
                userData.deckImgURLs = await getCurrentCnnURL()
            }
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
