import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useCookies } from 'react-cookie'
import { getDecks, getDatabaseImages, getApiImages }from "../util/Api.js"
import "../styles/SelectDeck.css"

export default function SelectDeck(){
    const navigate = useNavigate(), location = useLocation()
    const [userData, setUserData] = useState(location.state)
    const [decksInfo, setDecksInfo] = useState([])

    useEffect( () => {
        async function getDecksInfo(){
            const decksInfo = await getDecks(userData.playerUID)
            setDecksInfo(decksInfo)
        }
        getDecksInfo()
    }, [userData.playerUID])

    async function deckClicked(deckTitle, deckUID, userData) {
        if (deckTitle === "Google Photos") {
            // console.log("Google Photos API selected. Switching to Google Sign-in Page.")
            // setUserData({
            //     ...userData,
            //     isApi: true
            // })
            // setCookie("userData", {
            //     ...cookies.userData,
            //     "isApi": true
            // }, { path: '/' })
            // return
        } else if (deckTitle === "Cleveland Gallery" || deckTitle === "Chicago Gallery" || deckTitle === "Giphy Gallery" || deckTitle === "Harvard Gallery" || deckTitle === "CNN Gallery") {
            const apiImages = await getApiImages()
        } else {
            getDatabaseImages(deckUID, userData)
        }

        // POST /selectDeck selects deck for current game in database
        // let payload =  {
        //     game_code: userData.code,
        //     deck_uid: id,
        //     round_number: userData.roundNumber.toString(),
        // }
        // await axios.post(selectDeckURL, payload).then(res => console.log("Select Deck", res))
        //
        // setUserData({
        //     ...userData,
        //     deckSelected: id,
        //     deckTitle: title,
        //     isApi: apiStatus
        // })
        // setCookie("userData", {
        //     ...cookies.userData,
        //     "deckSelected": id,
        //     "deckTitle": title,
        //     "isApi": apiStatus
        // }, { path: '/' })
    }

    const deckElements = decksInfo.map((deck, index) => {
        return(
            <div key={index} onClick={deckClicked(deck.title, deck.deck_uid, userData)} className="deck">
                <div className="deck-background">
                    <img src={deck.deck_thumbnail_url} alt={deck.deck_title} className="deck-image"/>
                    <div className="deckText">
                        {deck.deck_title} (Free)
                    </div>
                </div>
                <br/>
            </div>
        )
    })

    return(
        <div className="selectDeck">
            <a href="#" className="gameRulesSelectDeck">
                <i className="fa fa-info-circle"></i>
                Game Rules
            </a>
            <h4 className="oneSelectDeck">Select a deck</h4>
            <br/>
            <br/>
            <ul className="deck-container">
                {deckElements}
            </ul>
        </div>
    )
}