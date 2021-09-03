import React, {useEffect,} from "react";
import "../Styles/ScoreType.css";
// import {Button} from "../Components/Button";
// import Button from '@material-ui/core/Button'
import {Link} from "react-router-dom";

function ScoreType() {




    useEffect(() => {

    }, []);


    return (
        <div
            style={{
                maxWidth: "375px",
                height: "812px",
                
                //As long as I import the image from my package strcuture, I can use them like so
                // backgroundImage: `url(${background})`
                // backgroundImage:
                //   "url('https://images.unsplash.com/photo-1557683325-3ba8f0df79de?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTZ8fHxlbnwwfHx8fA%3D%3D&w=1000&q=80')",
            }}
        >
            <style>@import url('https://fonts.googleapis.com/css2?family=Josefin+Sans&display=swap');</style>
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
            <div
                style={{
                    paddingTop:"45px",
                }}
            >
                    <h5 className="fontTop">Deck Selected: <br /> Student Gallery</h5>
                    <br></br>
                    <h5 className="fontTop">Choose a scoring system:</h5>


                <button className="scoretypeBtn">Score by Votes</button>

                <p className="fontText">
                    With this scoring system, a player recieves 2 points per vote
                </p>

                <h5 className="fontOR">or</h5>


                <button className="scoretypeBtn">Score by Ranking</button>
                <p className="fontText">
                    With this scoring system, the player (or players) with the most votes get 5 points regardless of
                    the number of votes received. 
                    <br />
                    2nd place gets 3 points.
                </p>

            </div>
        </div>
    );
}

export default ScoreType;
