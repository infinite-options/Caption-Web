import React from "react";
import { Row, Col, Card } from "reactstrap";
import Deck from "../Components/Deck";
import "./Collections.css";

function Collections() {
  return (
    <div
    // style={
    //   {
    //     // backgroundImage: URL(
    //     //   "https://images.unsplash.com/photo-1557683304-673a23048d34?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
    //     // ),
    //   }
    // }
    >
      <h1>Select a Deck</h1>
      <Row>
        <Col>
          <Deck
            src="https://images.unsplash.com/photo-1617503752587-97d2103a96ea?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1619&q=80"
            alt="student"
            title="Student Gallery"
            price="free"
          />
        </Col>
        <Col>
          {" "}
          <Deck
            src="https://images.unsplash.com/photo-1617503752587-97d2103a96ea?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1619&q=80"
            alt="student"
            title="Student Gallery"
            price="free"
          />
        </Col>
      </Row>
      <Row>
        <Col>
          {" "}
          <Deck
            src="https://images.unsplash.com/photo-1617503752587-97d2103a96ea?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1619&q=80"
            alt="student"
            title="Student Gallery"
            price="free"
          />
        </Col>
        <Col>
          {" "}
          <Deck
            src="https://images.unsplash.com/photo-1617503752587-97d2103a96ea?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1619&q=80"
            alt="student"
            title="Student Gallery"
            price="free"
          />
        </Col>
      </Row>
    </div>
  );
}

export default Collections;
