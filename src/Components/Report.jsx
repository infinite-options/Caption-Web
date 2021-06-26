import React from "react";
import { Row, Col, Card } from "reactstrap";
import "./Report.css";

export default function Report(props) {
  const alias = props.alias;
  const caption = props.caption;
  const pts = props.points;
  const totalPts = props.totalPts;
  const votes = props.votes;

  return (
    <div className="container">
      <Row
        style={{
          backgroundColor: "grey",
        }}
      >
        <Col>
          <Row>
            {alias} {"  "} {pts} pts
          </Row>
          <Card
            style={{
              textAlign: "center",
            }}
          >
            {caption}
          </Card>
        </Col>
        <Col>
          <Row>{votes} votes</Row>
          <Row>{totalPts} total points</Row>
        </Col>
      </Row>
    </div>
  );
}
