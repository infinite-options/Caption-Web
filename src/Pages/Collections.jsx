import React, {useEffect, useState} from "react";
import {Row, Col, Card} from "reactstrap";
import Deck from "../Components/Deck";
import "../Styles/Collections.css";
import background from "../Assets/landing.png";
import circle from "../Assets/circle.png";
import thing from "../Assets/idk.png";
import {Button} from "../Components/Button";
import {Link} from "react-router-dom";
import axios from "axios";

function Collections() {
    // const deckArray = [
    //     {
    //         src: "https://images.unsplash.com/photo-1617503752587-97d2103a96ea?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1619&q=80",
    //         alt: "student",
    //         title: "",
    //         // title: "Student Gallery",
    //         // price: "free",
    //     },
    //     {
    //         src: "https://images.unsplash.com/photo-1617503752587-97d2103a96ea?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1619&q=80",
    //         alt: "student",
    //         title: "",
    //         // title: "Student Gallery",
    //         // price: "free",
    //     },
    //     {
    //         src: "https://images.unsplash.com/photo-1617503752587-97d2103a96ea?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1619&q=80",
    //         alt: "student",
    //         title: "Student Gallery",
    //         price: "free",
    //     },
    //     {
    //         src: "https://images.unsplash.com/photo-1617503752587-97d2103a96ea?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1619&q=80",
    //         alt: "student",
    //         title: "Student Gallery",
    //         price: "free",
    //     },
    // ];

    const [deckArray, setDeckArray] = useState([]);



    useEffect(() => {
        const getURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/decks";
        axios.get(getURL).then((res) => {
            console.log(res);
            setDeckArray(res.data.decks_info);
        })
    }, []);

    return (
        <div
            style={{
                maxWidth: "375px",
                height: "812px",
                //As long as I import the image from my package strcuture, I can use them like so
                // backgroundImage: `url(${background})`
                // backgroundImage:
                //   "url('https://images.unsplash.com/photo-1557683325-3ba8f0df79de?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTZ8fHxlbnwwfHx8fA%3D%3D&w=1000&q=80')",
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
            </ul>
            {/* <img className="innerImage2" src={thing} /> */}
        </div>
    );
}

export default Collections;
