import React, {useContext, useEffect, useState,} from "react";
import Deck from "../Components/Deck";
import "../Styles/Collections.css";
import {Link} from "react-router-dom";
import axios from "axios";
import {LandingContext} from "../App";
import "bootstrap/dist/css/bootstrap.min.css";
import * as ReactBootStrap from 'react-bootstrap';
import { CookieHelper } from "../Components/CookieHelper"

function Collections() {
    const { userData } = useContext(LandingContext);
    const { getCookies } = CookieHelper()
    const [loading, setLoading] = useState(false);
    const [deckArray, setDeckArray] = useState([]);

    // Determine if we should display landing page (true) or loading icon (false)
    const [displayHtml, setDisplayHtml] = useState(false)

    // Endpoints used in Collections
    const decksURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/decks";


    // HOOK: useEffect()
    // ARGUMENTS: []
    // DESCRIPTION: On first render, check if hooks are updated, load data from cookies if not
    useEffect(() => {
         // Check if userData is empty (after refresh/new user)
         if(userData.playerUID === "") {
            getCookies(["playerUID"], setDisplayHtml)
        }
        else
            setDisplayHtml(true)
    }, [])


    // HOOK: useEffect()
    // ARGUMENTS: [userData.playerUID]
    // DESCRIPTION: 
    useEffect(() => {
        axios.get(decksURL + "/" + userData.playerUID + "," + "true").then((res) => {
            console.log("GET decks", res);

            setDeckArray(res.data.decks_info);
            setLoading(true)
        })
    }, [userData.playerUID]);

        
    return (
        displayHtml ? 
            // Collections page HTML
            <div style={{
                maxWidth: "375px",
                height: "812px",
            }}>
                {/* <img className="innerImage1" src={circle} /> */}
                <br></br>
                <br></br>

                <Link to="/gamerules">
                    <i style={{
                            position: "absolute",
                            top: "55px",
                            paddingBottom:"20px",
                            left: "30px",
                            color: "blue",
                        }}
                        className="fas fa-info-circle"
                        children=' Game Rule'
                    />
                </Link>

                <br></br>
                <br></br>

                <h4>Select a deck</h4>

                <br></br>
                <br></br>
                <br></br>

                {loading ?
                    <ul className="flex-container">
                        {deckArray.map((deck) => (
                            <li className="flex-item">
                                <Deck
                                    id = {deck.deck_uid}
                                    src={deck.deck_thumbnail_url}
                                    title={deck.deck_title}
                                    price= "free"
                                />
                            </li>
                        ))}
                    </ul> :
                    <ReactBootStrap.Spinner animation="border" role="status"/>
                }
            </div> :
             // Loading icon HTML
             <div>
                <h1>Loading game data...</h1>
                <ReactBootStrap.Spinner animation="border" role="status"/>
            </div>
    );
}

export default Collections;
