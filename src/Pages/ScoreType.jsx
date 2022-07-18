import React, {useEffect, useState, useContext} from "react";
import "../Styles/ScoreType.css";
import {Button} from "../Components/Button";
// import Button from '@material-ui/core/Button'
import {Link} from "react-router-dom";
import {LandingContext} from "../App";
import axios from "axios";
import {useHistory} from "react-router-dom";

function ScoreType({channel}) {
    const history = useHistory();
    const[buttonType, setbuttonType] = useState("");//useState to add action on button
    const {code, rounds, roundDuration, host, setImageURL, roundNumber, alias, setRecords} = useContext(LandingContext);//set duration
    const [records, setRecord] = useState([]);
    //const getUniqueImageInRound = "https://api.harvardartmuseums.org/image?apikey=c10d3ea9-27b1-45b4-853a-3872440d9782"                                                                                                        //setImageURL: to get data from image API
   
    const pub = ()=> {
        console.log('sending players to start game');
        console.log("Log 1.5: Finish Posting");
        channel.publish({data: {gameStarted: true}}); //send data from channel sync to subcriber when game Started
        history.push("/page"); //access to page history
    };

    function postRoundInfo() {
        if (buttonType === ""){ //if no button was seleected -> send alert  
            alert("Select A Scoring System ")
            return              
        }
        const payload = {  //payload -> get enter from user the number of rounf, duration, and scoring type
            number_of_rounds: rounds.toString(),
            game_code: code,
            round_duration: roundDuration,
            scoring_scheme: buttonType=== "votes" ? "V" : "R",  //choosing b/t vote or ranking
        };
        console.log("payload: ", payload);

        const postURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/changeRoundsAndDuration";
        async function postedPub() {
            await axios.post(postURL, payload).then((res) => {  //async: request URL + get data from payload -> 
                                                                //await until the URL was posted then response and start the game at the same time
                console.log(res);
            })
            console.log("Log 1: Finish Posting");
            const getUniqueImageInRound = "https://api.harvardartmuseums.org/image?apikey=c10d3ea9-27b1-45b4-853a-3872440d9782";
            console.log('URL end: ', getUniqueImageInRound);
            await axios.get(getUniqueImageInRound).then((res) => {   //send request to get msg, image_url, image_uid        
                console.log('getUnique res: ', res);   //log data include meg,url, uid                                         
                const record = [];
                   
                        for(var i = 0; i < res.data.records.length; i++){
                            record.push(res.data.records[i].baseimageurl)
                        }
                const image = record[Math.floor(Math.random()*record.length)]       
                setImageURL(image);
                console.log('recorddddd',image)
            })
            
            pub();
        }
        
        postedPub();
  
    }
  
    useEffect(() => {
    console.log('Currently in Scoretype', "Alias:",alias, "Current Round: ", roundNumber)
    },[]);
    
   

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


                <button onClick= {() => setbuttonType("votes") } className={buttonType==="votes" ? "scoretypeBtn2" : "scoretypeBtn"} >Score by Votes</button>

                <p className="fontText">
                    With this scoring system, a player recieves 2 points per vote
                </p>

                <h5 className="fontOR">or</h5>


                <button onClick= {() => setbuttonType("rank") } className={buttonType==="rank" ? "scoretypeBtn2" : "scoretypeBtn"}>Score by Ranking</button>
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
