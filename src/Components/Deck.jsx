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
        <p>{props.title}</p>
        <p> Price: ${props.price}</p>
      </div>
    </Link>
  );
}
