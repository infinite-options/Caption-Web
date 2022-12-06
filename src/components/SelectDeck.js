import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useCookies } from 'react-cookie'
import {getDecks, postDatabaseImages, postApiImages, ably} from "../util/Api.js"
import "../styles/SelectDeck.css"

export default function SelectDeck(){
    const navigate = useNavigate(), location = useLocation()
    const [userData, setUserData] = useState(location.state)
    const [cookies, setCookie] = useCookies(["userData"])
    const [decksInfo, setDecksInfo] = useState([])

    useEffect( () => {
        async function getDecksInfo(){
            const decksInfo = await getDecks(userData.playerUID)
            setDecksInfo(decksInfo)
        }
        getDecksInfo()
    }, [userData.playerUID])

    async function deckSelected(deckTitle, deckUID) {
        let updatedUserData = {}
        if (deckTitle === "Google Photos") {

        }
        else if (deckTitle === "Cleveland Gallery" || deckTitle === "Chicago Gallery" || deckTitle === "Giphy Gallery" || deckTitle === "Harvard Gallery" || deckTitle === "CNN Gallery") {
            updatedUserData = {
                ...userData,
                isApi: true,
                deckUID: deckUID
            }
            await postApiImages(updatedUserData)
        }
        else {
            updatedUserData = {
                ...userData,
                isApi: false,
                deckUID: deckUID
            }
            await postDatabaseImages(updatedUserData)
        }
        setUserData(updatedUserData)
        setCookie("userData", updatedUserData, {path: '/'})
        navigate("/Waiting", {state: updatedUserData})
    }

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
                {decksInfo.map((deck, index) => {
                    return(
                        <div key={index} onClick={event => deckSelected(deck.deck_title, deck.deck_uid)} className="deck">
                            <div className="deck-background">
                                <img src={deck.deck_thumbnail_url} alt={deck.deck_title} className="deck-image"/>
                                <div className="deckText">
                                    {deck.deck_title} (Free)
                                </div>
                            </div>
                            <br/>
                        </div>
                    )
                })}
            </ul>
        </div>
    )
}