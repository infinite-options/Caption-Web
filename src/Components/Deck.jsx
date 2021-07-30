import React from "react";
import "../Styles/Deck.css";
import { Link } from "react-router-dom";

export default function DeckCard(props) {
  return (
    <Link to="/rounds" className="btn-mobile">
      <div className="outer">
        <div className="imageBackground">
          <img src={props.src} alt={props.alt} className="img1" />
        </div>

        {props.title === "" ? <></> :
            <div>
            <div className="deckText">
              {props.title} ({props.price})
            </div>
          <Link to="/rules" className="linkText">
          Learn More
          </Link>
            </div>
        }
      </div>
    </Link>
  );
}
