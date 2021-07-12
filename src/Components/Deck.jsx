import React from "react";
import "../Styles/Deck.css";
import { Link } from "react-router-dom";

export default function DeckCard(props) {
  return (
    <Link to="/page" className="btn-mobile">
      <div className="outer">
        <div className="imageBackground">
          <img src={props.src} alt={props.alt} className="img" />
        </div>
        <div className="deckText">
          {props.title} ({props.price})
        </div>
        <Link className="linkText">Learn More</Link>
      </div>
    </Link>
  );
}
