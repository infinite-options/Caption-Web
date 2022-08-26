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
    const { userData, setUserData, cookies, setCookie} = useContext(LandingContext);
    const [loading, setLoading] = useState(false);

    // Load cookies
    console.log("Collections cookies", cookies)
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


    useEffect(() => {
        const getURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/decks";
        axios.get(getURL + "/" + userData.playerUID + "," + "true").then((res) => {
            console.log("GET decks", res);
            setDeckArray(res.data.decks_info);
            setLoading(true)
            console.log('deckArray: ', res.data.decks_info);
        })
    }, [userData.playerUID]);



        
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
