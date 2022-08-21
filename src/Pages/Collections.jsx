import React, {useContext, useEffect, useState,} from "react";
import {Row, Col, Card} from "reactstrap";
import Deck from "../Components/Deck";
import "../Styles/Collections.css";
import background from "../Assets/landing.png";
import circle from "../Assets/circle.png";
import googlePhotos from "../Assets/googlePhotosIcon.png"
import thing from "../Assets/idk.png";
import {Button} from "../Components/Button";
import {Link} from "react-router-dom";
import axios from "axios";
import {LandingContext} from "../App";
import "bootstrap/dist/css/bootstrap.min.css";
import * as ReactBootStrap from 'react-bootstrap';



function Collections() {
    const [deckArray, setDeckArray] = useState([]);
    const {playerUID, setCode, setName, setEmail, setZipCode, setAlias, setGameUID, setRounds, setRoundDuration, setHost, setRoundNumber, setPlayerUID, setImageURL, setScoreboardInfo, setPhotosFromAPI, setDeckSelected, setDeckTitle, cookies} = useContext(LandingContext);
    const [loading, setLoading] = useState(false);

    // Load cookies
    console.log("Collections cookies", cookies)
    loadCookies()

    useEffect(() => {
        const getURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/decks";
        axios.get(getURL + "/" + playerUID + "," + "true").then((res) => {
            console.log("GET decks", res);
            setDeckArray(res.data.decks_info);
            setLoading(true)
            console.log('deckArray: ', res.data.decks_info);
        })
    }, [playerUID]);


    // Loads cookies if defined previously
    function loadCookies() {
        if(cookies.code !== undefined)
            setCode(cookies.code)
        if(cookies.name !== undefined)
            setName(cookies.name)
        if(cookies.email !== undefined)
            setEmail(cookies.email)
        if(cookies.zipCode !== undefined)
            setZipCode(cookies.zipCode)
        if(cookies.alias !== undefined)
            setAlias(cookies.alias)
        if(cookies.gameUID !== undefined)
            setGameUID(cookies.gameUID)
        if(cookies.rounds !== undefined)
            setRounds(cookies.rounds)
        if(cookies.roundDuration !== undefined)
            setRoundDuration(cookies.roundDuration)
        if(cookies.host !== undefined && typeof host !== 'boolean')
            setHost(JSON.parse(cookies.host))
        if(cookies.roundNumber !== undefined) 
            setRoundNumber(parseInt(cookies.roundNumber))
        if(cookies.playerUID !== undefined)
            setPlayerUID(cookies.playerUID)
        if(cookies.imageURL !== undefined)
            setImageURL(cookies.imageURL)
        if(cookies.scoreboardInfo !== undefined)
            setScoreboardInfo(cookies.scoreboardInfo)
        if(cookies.photosFromAPI !== undefined)
            setPhotosFromAPI(cookies.photosFromAPI)
        if(cookies.deckSelected !== undefined)
            setDeckSelected(cookies.deckSelected)
        if(cookies.deckTitle !== undefined)
            setDeckTitle(cookies.deckTitle)
    }

        
    return (
        <div
            style={{
                maxWidth: "375px",
                height: "812px",
            }}
        >
            {/* <img className="innerImage1" src={circle} /> */}

            <br></br>
            <br></br>


            <Link to="/gamerules">
                <i
                    style={{
                        position: "absolute",
                        top: "55px",
                        left: "30px",
                        color: "blue",
                    }}
                    className="fas fa-info-circle"
                />
            </Link>


            <br></br>
            <h4>Select a deck</h4>
            <br></br>
            <br></br>
            <br></br>

            {/* <ul className="flex-container">
                {deckArray.map((deck) => (
                    <li className="flex-item">
                        <Deck
                            id = {deck.deck_uid}
                            src={deck.deck_thumbnail_url}
                            // alt={deck.deck_title}
                            title={deck.deck_title}
                            price= "free"
                        />
                    </li>
                ))}
                    <Deck
                        src={googlePhotos}
                        title="Play with Google Photos"
                        price="free"
                        googlePhotos={true}
                    />
                <Deck
                        title="Cleveland Gallery"
                        price="free"
                        cleveland={true}
                />
                <Deck
                        title="Chicago Gallery"
                        price="free"
                        chicago={true}
                />
                <Deck
                        title="Giphy Gallery"
                        price="free"
                        giphy={true}
                />
                <Deck
                        title="Harvard Gallery"
                        price="free"
                        harvard={true}
                />
            </ul> */}
            {loading ? (
            <ul className="flex-container">
                
                        {deckArray.map((deck) => (
                            <li className="flex-item">
                                <Deck
                                    id = {deck.deck_uid}
                                    src={deck.deck_thumbnail_url}
                                    // alt={deck.deck_title}
                                    title={deck.deck_title}
                                    price= "free"
                                />
                            </li>
                        ))
                        }
                        <Deck
                            src={googlePhotos}
                            title="Play with Google Photos"
                            price="free"
                            googlePhotos={true}
                        />
                        <Deck
                                title="Cleveland Gallery"
                                price="free"
                                cleveland={true}
                        />
                        <Deck
                                title="Chicago Gallery"
                                price="free"
                                chicago={true}
                        />
                        <Deck
                                title="Giphy Gallery"
                                price="free"
                                giphy={true}
                        />
                        <Deck
                                title="Harvard Gallery"
                                price="free"
                                harvard={true}
                        />
                
            </ul>
            ):(<ReactBootStrap.Spinner animation="border" role="status"/>)}
            {/* <img className="innerImage2" src={thing} /> */}
        </div>
    );
}

export default Collections;
