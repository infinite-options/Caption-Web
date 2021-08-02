import React, {useContext} from "react";
import "../Styles/Deck.css";
import {Link} from "react-router-dom";

import axios from "axios";

export default function DeckCard(props) {


    function selectThisDeck() {

        const payload = {
            game_uid: "200-002006",
            deck_uid: props.id,
            round_number: "1",
        };

        const postURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/selectDeck";
        axios.post(postURL, payload).then((res) => {
            console.log(res);
        })
    }

    return (
        <Link to="/rounds" className="btn-mobile" onClick = {selectThisDeck}>
            <div className="outer">
                <div className="imageBackground">
                    <img src={props.src} alt={props.alt} className="img1"/>
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
