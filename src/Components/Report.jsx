import React from "react";
import { Row, Col, Card } from "reactstrap";
import "../Styles/Report.css";

export default function Report(props) {
  const alias = props.alias;
  const caption = props.caption;
  const pts = props.points;
  const totalPts = props.totalPts;
  const votes = props.votes;

  return (
    <div className="container">
      <Row
      // style={{
      //   backgroundColor: "#4D4D4D",
      // }}
      >
        <Col>
          <Row
            style={{
              display: "block",
            }}
          >
            <span className="yes">{alias}</span>
            <span className="no">{pts} pts</span>

            {/* {alias} {"  "} {pts} pts */}
          </Row>
          <br></br>
          <Row>
            <Card>{caption}</Card>
          </Row>
        </Col>
        <Col>
          <Row
            style={{
              font: "Josefin Sans",
              alignItems: "right",
              color: "white",
            }}
          >
            {votes} votes
          </Row>
          <br></br>
          <Row
            style={{ font: "Josefin Sans", fontSize: "42px", color: "white" }}
          >
            {totalPts} pts
          </Row>
        </Col>
      </Row>
    </div>
  );
}
