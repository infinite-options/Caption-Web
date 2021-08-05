import React, {useContext, useEffect, useState} from "react";
import Pic from "../Assets/sd.jpg";
import Countdown from "react-countdown";
import {Row, Col, Card} from "reactstrap";
import Form from "../Components/Form";
import {Button} from "../Components/Button";
// import "../Styles/Scoreboard.css";
import "../Styles/Page.css";
import background from "../Assets/temp.png";

//Documentation for the CountdownCircleTimer component
//https://github.com/vydimitrov/react-countdown-circle-timer#props-for-both-reactreact-native
import {CountdownCircleTimer} from "react-countdown-circle-timer";
import axios from "axios";
import {LandingContext} from "../App";

export default function Page() {

    const {code} = useContext(LandingContext);

    const [caption, setCaption] = useState("");
    const [imageSrc, setImageSrc] = useState("");
    const [timeUp, setTimeUp] = useState(false);
    const [timerDuration, setTimerDuration] = useState(-1);

    const handleCaptionChange = (newCaption) => {
        setCaption(newCaption);
    };

    function countdownComplete() {
        setTimeUp(true);
    }

    function transition() {
        window.location.href = "/selection";
        //this is not good because all internal state gets wiped whenever the page reloads
    }


    useEffect(() => {
        const getTimerURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/gameTimer/59779668";
        const getImageURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getImageInRound/80281686";

        /**
         * This axios.get() will be used to determine the amount of time left on the countdown timer.
         *
         * s = the second at which the round has started
         * c = the second at which the clock is currently on
         * d = the seconds for the duration of the round
         */
        axios.get(getTimerURL).then((res) => {
            console.log(res);

            /**
             * This c variable records the value of the seconds within the 'server clock'
             * @type {number}
             */
            let serverClock = parseInt(res.data.current_time.substring(17));

            /**
             * This c variable records the value of the seconds within the 'client clock'
             * @type {number}
             */
            let clientClock = new Date().getSeconds();

            let c = serverClock;


            // console.log("Server Clock: " + serverClock);
            // console.log("Client Clock: " + serverClock);


            let s = parseInt(res.data.round_started_at.substring(17));

            let d = parseInt(res.data.round_duration.substring(17));

            // console.log("Current Second: " + c);
            // console.log("Start Second: " + s);
            // console.log("Calculated Lag: " + determineLag(c,s));
            // console.log("Round Duration: " + d);


            setTimerDuration(d - determineLag(c, s));
            // console.log("Determined duration: " + (d-1));
            // console.log("Determined duration: " + timerDuration);

            // console.log("Time before addition : " + time);

            // console.log(time.getSeconds());
            // console.log(duration.getSeconds());
            // console.log("Time after addition : "+ time);

        })


        axios.get(getImageURL).then((res) => {
            console.log(res);
            setImageSrc(res.data.image_url);
        })
    }, []);

    function determineLag(current, start) {
        if (current - start >= 0) {
            return current - start;
        } else {
            return current + (60 - start);
        }
    }


    function postSubmitCaption() {
        const postURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/submitCaption";
        const payload = {
            caption: caption,
            game_code: code,
            // game_code: "30699551",
            round_number: "1",
            user_uid: "100-000014"
        }

        console.log(code);

        axios.post(postURL, payload).then((res) => {
            console.log(res);
        })
    }

    return (
        <div
            style={{
                maxWidth: "375px",
                height: "812px",
                //As long as I import the image from my package strcuture, I can use them like so
                backgroundImage: `url(${background})`,
                // backgroundImage:
                //   "url('https://images.unsplash.com/photo-1557683325-3ba8f0df79de?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTZ8fHxlbnwwfHx8fA%3D%3D&w=1000&q=80')",
            }}
        >
            <div style={{padding: "20px"}}>
                <br></br>

                <h1
                    style={{
                        fontSize: "20px",
                    }}
                >
                    Name of Deck
                </h1>
                <br></br>

                <img className="centerPic" src={imageSrc} alt = "Loading Image...."/>

                <br></br>
                <br></br>
                {timeUp ? (
                    <div>
                        <h1>You have captioned the above image as: "{caption}"</h1>
                        <Button
                            className="landing2"
                            destination="/selection"
                            children="Continue"
                        />
                    </div>
                ) : (
                    <div>
                        <Form
                            className="input2"
                            field="Enter your caption here"
                            onHandleChange={handleCaptionChange}
                        />
                        <br></br>
                        <Row>
                            <span style={{marginLeft: "50px"}}></span>
                            <div
                                style={{
                                    background: "yellow",
                                    borderRadius: "30px",
                                    width: "60px",
                                }}
                            >
                                {timerDuration != -1 ? <CountdownCircleTimer
                                    background="red"
                                    size={60}
                                    strokeWidth={5}
                                    isPlaying
                                    duration={timerDuration}
                                    colors="#000000"
                                    // onComplete={transition}
                                >
                                    {({remainingTime}) => (
                                        <div className="countdownText">{remainingTime}</div>
                                    )}
                                </CountdownCircleTimer> : <></>}

                            </div>
                            <span style={{marginLeft: "60px"}}></span>
                            <br></br>{" "}
                            <Button
                                className="fat"
                                destination= "/page"
                                onClick={postSubmitCaption}
                                children="Submit"
                                conditionalLink={true}
                            />
                        </Row>
                    </div>
                )}
            </div>
        </div>
    );
}
