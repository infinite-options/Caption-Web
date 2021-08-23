import React, {useContext} from "react";
import "../Styles/Deck.css";
import {Link} from "react-router-dom";

import axios from "axios";
import {LandingContext} from "../App";

export default function DeckCard(props) {

    const {code, roundNumber} = useContext(LandingContext);


    function selectThisDeck() {

        const payload = {
            game_code: code,
            deck_uid: props.id,
            round_number: roundNumber.toString(),
        };

        console.log('payload for deck = ', payload);
        const postURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/selectDeck";
        axios.post(postURL, payload);
    }

    return (
        <Link to="/rounds" className="btn-mobile" onClick = {selectThisDeck}>
            <div className="outer">
                <div className="imageBackground">
                    <img src={props.src} alt={props.alt} className="img1"/>
                    {/*<img src="https://iocaptions.s3.us-west-1.amazonaws.com/Amrita-Marino-NewYorkTimes-Worldnet-001-t.gif" alt={props.alt} className="img1"/>*/}
                </div>

                {props.title === "" ? <></> :
                    <div>
                        <div className="deckText">
                            {props.title} ({props.price})
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
