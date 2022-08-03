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


function Collections() {
    const [deckArray, setDeckArray] = useState([]);
    const {playerUID} = useContext(LandingContext);


    useEffect(() => {
        const getURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/decks";
        axios.get(getURL + "/" + playerUID + "," + "true").then((res) => {
            console.log("GET decks", res);
            setDeckArray(res.data.decks_info);
            console.log('deckArray: ', res.data.decks_info);
        })
    }, []);


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
            </ul>
            {/* <img className="innerImage2" src={thing} /> */}
        </div>
    );
}

export default Collections;
