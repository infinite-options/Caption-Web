import React from "react";
import {Row, Col, Card} from "reactstrap";
import "../Styles/Report.css";

export default function Report(props) {
    const alias = props.alias;
    const caption = props.caption;
    const pts = props.points;
    const totalPts = props.totalPts;
    const votes = props.votes;
    const isWinner = props.isWinner;

    return (
        <div className="container">
            <Row>
                <Col>
                    <Row
                        style={{
                            display: "block",
                        }}
                    >
                        <span className="nameTag">{alias}</span>
                        <span className="pointTag">total: {totalPts} pts</span>
                    </Row>
                    <br></br>
                    <Row>
                        {isWinner ? (
                            <Card className="card1" style={{backgroundColor: "yellow"}}>
                                {caption}
                            </Card>
                        ) : (
                            <Card className="card1" style={{backgroundColor: "white"}}>{caption}</Card>
                        )}
                    </Row>
                </Col>
                <Col>
                    <Row
                        style={{
                            font: "Josefin Sans",
                            alignItems: "right",
                            color: "white",
                            float: "right"
                        }}
                    >
                        {/*<i class="fa fa-thumbs-up fa-2x"></i>*/}
                        <span style={{marginLeft: "40px"}}/>
                        {votes} votes
                    </Row>

                    <Row
                        style={{
                            alignText: "center",
                            font: "Josefin Sans",
                            fontSize: "32px",
                            color: "white",
                            float: "right"
                        }}
                    >
                        {pts} pts
                    </Row>
                </Col>
            </Row>
        </div>
    );
}
