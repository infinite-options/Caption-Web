import React from 'react'

import "../Styles/DeckInfo.css";
import Deck from "../Components/Deck";
import {Col, Row} from "reactstrap";

function DeckInfo() {
    return (
        <div>
            <div class="header">
                <b>
                    <h4>Student Gallery</h4>
                    <h4> (Free) </h4>
                </b>
            </div>
            <Row>
                <Col>
                    <div className="square">
                        <Deck
                            src="https://images.unsplash.com/photo-1617503752587-97d2103a96ea?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1619&q=80"
                            alt="student"
                            title=""
                        />
                    </div>
                </Col>
                <Col>
                    Artist: John Doe

                    <i className="fab fa-instagram"></i>
                    <i className="fas fa-globe"></i>
                    <i className="fab fa-dribbble"></i>

                    <br></br>

                    Buy a digital copy of this deck and use it in whatever form you like - print, digital, etc.

                </Col>

                This is a collection by artist, John Doe, who is ....

                <br></br>

                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos
            </Row>
        </div>
    )
}

export default DeckInfo