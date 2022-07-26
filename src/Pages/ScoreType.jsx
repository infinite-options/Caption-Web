import React, {useEffect, useState, useContext} from "react";
import "../Styles/ScoreType.css";
import {Button} from "../Components/Button";
import {Link} from "react-router-dom";
import {LandingContext} from "../App";
import axios from "axios";
import {useHistory} from "react-router-dom";

function ScoreType({channel}) {
    const history = useHistory();
    const[buttonType, setbuttonType] = useState("");
    const {code, rounds, roundDuration, host, imageURL, setImageURL, roundNumber, alias, photosFromAPI, setPhotosFromAPI} = useContext(LandingContext);

    const pub = (apiURL)=> {
        console.log('sending players to start game');
        console.log("Log 1.5: Finish Posting");
        if(photosFromAPI.length > 0)
            channel.publish({data: {
                gameStarted: true,
                currentImage: apiURL,
            }});
        else
        channel.publish({data: {
            gameStarted: true,
            currentImage: "",
        }});

        history.push("/page");
    };

    const getUniqueAPIimage = async () => {
        const randNum = Math.floor(Math.random() * photosFromAPI.length)
        const imageURL = photosFromAPI[randNum]
        setImageURL(imageURL)
        setPhotosFromAPI(photosFromAPI.filter((url) => {
            return url !== imageURL
        }))

        pub(imageURL)
    }

    function postRoundInfo() {
        if (buttonType === ""){
            alert("Select A Scoring System ")
            return
        }

        const postURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/changeRoundsAndDuration";
        const payload = {
            number_of_rounds: rounds.toString(),
            game_code: code,
            round_duration: roundDuration,
            scoring_scheme: buttonType=== "votes" ? "V" : "R",
        };

        async function postedPub() {
            await axios.post(postURL, payload).then((res) => {
                console.log("POST Change Rounds and Duration", res);
            })
            console.log("Log 1: Finish Posting");
            
            if(photosFromAPI.length === 0){
                const getUniqueImageInRound = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getUniqueImageInRound/";
                console.log('GetUniqueImageInRound URL end: ', getUniqueImageInRound + code + "," + roundNumber);
                await axios.get(getUniqueImageInRound + code + "," + roundNumber).then((res) => {
                    console.log('GET Get Unique Image In Round', res);
                    setImageURL(res.data.image_url);
                })

                pub();
            } else {
                 getUniqueAPIimage()
            }
            
        }


        postedPub();
    }


    useEffect(() => 
    console.log('Currently in Scoretype', "Alias:",alias, "Current Round: ", roundNumber), 
    []);


    return (
        <div style={{
                maxWidth: "375px",
                height: "812px",
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

            <div style={{
                    paddingTop:"45px",
                }}
            >
                <h5 className="fontTop">Deck Selected: <br /> Student Gallery</h5>

                <br></br>

                <h5 className="fontTop">Choose a scoring system:</h5>


                <button 
                    onClick= {() => setbuttonType("votes") } 
                    className={buttonType==="votes" ? "scoretypeBtn2" : "scoretypeBtn"} 
                >
                    Score by Votes
                </button>

                <p className="fontText">
                    With this scoring system, a player recieves 2 points per vote
                </p>

                <h5 className="fontOR">or</h5>


                <button 
                    onClick= {() => setbuttonType("rank") } 
                    className={buttonType==="rank" ? "scoretypeBtn2" : "scoretypeBtn"}
                >
                    Score by Ranking
                </button>

                <p className="fontText">
                    With this scoring system, the player (or players) with the most votes get 5 points regardless of
                    the number of votes received. 
                    <br />
                    2nd place gets 3 points.
                </p>

            </div>
            <Button className="landing" conditionalLink={true} onClick={postRoundInfo}
                    children="Continue"/>
        </div>
    );
}

export default ScoreType;
