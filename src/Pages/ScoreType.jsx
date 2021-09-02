import React, {useEffect, useState} from "react";
import "../Styles/ScoreType.css";
import {Button} from "../Components/Button";
import {Link} from "react-router-dom";
import axios from "axios";

function ScoreType() {




    useEffect(() => {

    }, []);


    return (
        <div
            style={{
                maxWidth: "375px",
                height: "812px",
                border:"1px solid blue"
                //As long as I import the image from my package strcuture, I can use them like so
                // backgroundImage: `url(${background})`
                // backgroundImage:
                //   "url('https://images.unsplash.com/photo-1557683325-3ba8f0df79de?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTZ8fHxlbnwwfHx8fA%3D%3D&w=1000&q=80')",
            }}
        >
            {/* <img className="innerImage1" src={circle} /> */}

            <br></br>
            <br></br>
            <Link to="/gamerules">
                <i
                    style={{
                        position: "absolute",
                        top: "55px",
                        left: "30px",
                        color: "blue",
                    }}
                    className="fas fa-info-circle"
                />
            </Link>


            <br></br>
            <div className="entireText">
                <h4>Deck Selected:</h4>
                <h4>Student Gallery</h4>
                <br></br>
                <h4>Choose a scoring system:</h4>
                <br></br>
                <Button className="scoretypeBtn">Score by Votes</Button>
                <p>
                    With this scoring system, a player recieves 2 points per vote
                </p>
                <br></br>
                <h4>or</h4>
                <br />

                <Button className="scoretypeBtn">Score by Ranking</Button>
                <p>
                    With this scoring system, the player (or players) with the most votes get 5 points regardless of
                    the number of votes received.
                </p>

            </div>
            <p> 2nd place gets 3 points</p>
        </div>
    );
}

export default ScoreType;
