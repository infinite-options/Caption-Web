import React from 'react'

import "../Styles/DeckInfo.css";
import globe from '../Assets/globe.png';
import instagram from '../Assets/instagram.png';
import dribbble from '../Assets/dribbble.png';
import art from '../Assets/art.png';


function DeckInfo() {
    return (
        <div> 
            <img src={globe} alt="" class="globe"/>
            <img src={instagram} alt="" class="instagram"/>
            <img src={dribbble} alt="" class="dribbble"/>
            <img src={art} alt="" class="art"/>

            <div class="header">
                <b>
                <h4>Student Gallery</h4>
                <h4> (Free) </h4>
                </b>
            </div>
            
            <div class="square"> </div>
            
            <div class="artist">
                <p>Artist: John Doe</p>
            </div>

            <div class="blueText">
                <p> Buy deck from the artist.</p>
            </div>

            <div class="buyDeck">
                <p> Buy a digital copy of this deck and use it in whatever form you like - print, digital etc. </p>
            </div>

            <div class="description">
                <p> This is a collection by artist, John Doe, who is </p>
                <p> Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos</p>
            </div>
        </div>
    )
}

export default DeckInfo