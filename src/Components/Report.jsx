import { throwStatement } from "@babel/types";
import React from "react";
import { Row, Col, Card } from "reactstrap";
import "../Styles/Report.css";
import { Typography } from "@material-ui/core";

export default function Report(props) {
  const alias = props.alias;
  const caption = props.caption;
  const pts = props.points;
  const totalPts = props.totalPts;
  const votes = props.votes;
  const isWinner = props.isWinner;

  return (
    <div className="container">
      <div style={{ display: "block"}}>
        <div className="nameTag" style={{float:"left"}}>{alias}</div>
        <div
          style={{
            marginRight: "0px",
            font: "Josefin Sans",
            alignItems: "right",
            color: "white",
            float: "right",
          }}
        >
          {votes} votes
        </div>
        <div className="pointTag" style={{ marginRight: "70px" }}>
          total: {totalPts} pts
        </div>
      </div>

      <div style={{ display: "flex" }}>
        <div style={{ width: "226px" }}>
          {isWinner ? (
            <Card
              className="card1"
              style={{ backgroundColor: "yellow", display: "flex" }}
            >
              <Typography>{caption}</Typography>
            </Card>
          ) : (
            <Card className="card1" style={{ backgroundColor: "white" }}>
              <Typography>{caption}</Typography>
            </Card>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexGrow: "1",
          }}
        >
          <Typography
            style={{
              flexGrow: "1",
              textAlign: "right",
              font: "Josefin Sans",
              fontSize: "32px",
              color: "white",
            }}
          >
            {pts} pts
          </Typography>
        </div>
      </div>

      {/* <Row>
                <Col>
                    <Row
                        style={{
                            display: "block",
                            marginLeft: '10px',
                        }}
                    >
                        <span className="nameTag">{alias}</span>
                        <span className="pointTag" style = {{marginRight: '5px'}}>total: {totalPts} pts</span>
                    </Row>
                    <br></br>
                    <Row style = {{display: 'flex', border: '2px solid red'}}>
                        {isWinner ? (
                            <Card className="card1" style={{backgroundColor: "yellow", width: '800px', border: '10px solid green'}}>
                                <Typography style = {{border: '2px solid red'}}>
                                    {caption}
                                </Typography>
                            </Card>
                        ) : (
                            <Card className="card1" style={{backgroundColor: "white"}}>
                                <Typography noWrap>
                                    {caption}
                                </Typography>
                            </Card>
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
            </Row> */}
    </div>
  );
}
