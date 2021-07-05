import React from "react";
import { Row, Col, Card } from "reactstrap";
import Deck from "../Components/Deck";
import "../Styles/Collections.css";
import background from "../Assets/landing.png";

function Collections() {
  const deckArray = [
    {
      src: "https://images.unsplash.com/photo-1617503752587-97d2103a96ea?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1619&q=80",
      alt: "student",
      title: "Student Gallery",
      price: "free",
    },
    {
      src: "https://images.unsplash.com/photo-1617503752587-97d2103a96ea?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1619&q=80",
      alt: "student",
      title: "Student Gallery",
      price: "free",
    },
    {
      src: "https://images.unsplash.com/photo-1617503752587-97d2103a96ea?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1619&q=80",
      alt: "student",
      title: "Student Gallery",
      price: "free",
    },
    {
      src: "https://images.unsplash.com/photo-1617503752587-97d2103a96ea?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1619&q=80",
      alt: "student",
      title: "Student Gallery",
      price: "free",
    },
  ];

  return (
    <div
    style={{
      maxWidth: "375px",
      height: "812px",
      //As long as I import the image from my package strcuture, I can use them like so
      backgroundImage: `url(${background})` 
      // backgroundImage:
      //   "url('https://images.unsplash.com/photo-1557683325-3ba8f0df79de?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTZ8fHxlbnwwfHx8fA%3D%3D&w=1000&q=80')",
    }}
  >
      <h1>Select a deck</h1>
      <ul 
      class="flex-container">
      {deckArray.map((deck) => (
        <li class="flex-item"><Deck
          src={deck.src}
          alt={deck.alt}
          title={deck.title}
          price={deck.price}
        />
        </li>
      ))}
      </ul>
    </div>
  );
}

export default Collections;
