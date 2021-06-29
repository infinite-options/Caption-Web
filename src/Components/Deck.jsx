import React from "react";
import "./Deck.css";

function DeckCard(props) {
  return (
    <div className="outer">
      <div className="imageBackground">
        <img
          src={props.src}
          alt={props.alt}
          className="img"
          // style={{
          //   maxHeight: "150px",
          //   maxWidth: "150px",
          // }}
        />
      </div>

      <p>{props.title}</p>
      <p> Price: ${props.price}</p>
    </div>
  );
}

export default DeckCard;
