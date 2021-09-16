import React, {useContext, useEffect, useState} from 'react'
import axios from "axios";
import circle from "../Assets/circle.png";
import thing from "../Assets/idk.png";
import {Button} from '../Components/Button';
import "../Styles/Waiting.css";
import {Row, Col, Card} from "reactstrap";
import Deck from "../Components/Deck";
import {LandingContext} from "../App";
import Form from "../Components/Form";
import {useHistory} from "react-router-dom";


export default function HiddenPage({setRounds, setRoundDuration, channel }) {
    const history = useHistory();
    const {code, rounds, roundDuration, host, setImageURL, roundNumber, alias} = useContext(LandingContext);
    // const id = document.getElementsByClassName("myfile")[0].value;
    // console.log("D: ", id);

    {/*Need some way to check that the input is an integer*/
    }
    const handleRoundsChange = (roundsInput) => {
       setRounds(parseInt(roundsInput));
    };

    {/*Need some way to check that the input is an integer*/
    }
    const handleRoundsDurationChange = (durationInput) => {
       setRoundDuration(durationInput);
    
    };

    // function myFunction(e) {
    //     console.log("Made it in the function: ", e.target);
    //     const formData = new FormData(e.target);
    //     for (const [key, value] of formData)
    //     {
    //         console.log('key = ', key, ', value = ', value);
    //     }
    //     alert("The form was submitted");
    //     // https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/uploadImage
    //   }

    return (
        <div
            style={{
                maxWidth: "375px",
                height: "812px",
            }}
        >

            <img className="innerImage1" src={circle}/>
            <img className="innerImage2" src={thing}/>

            <div className="spacer"/>


            <h4> Select your images</h4>

            <br></br>

            <h5>svd
            </h5>

            <form>
                <label for="myfile">Select files:</label>
                <input
                    type="file"
                    id="myfile"
                    name="myfile"
                    multiple
                    onChange={(e) => {
                        console.log('here: selecting image with files = ', e.target.files);
                        if (e.target.files[0]) {
                          const image1 = e.target.files[0];
                          const url = URL.createObjectURL(image1);
                          console.log('image1 = ', image1, '\nurl = ', url);
                        }
                    }}
                /><br></br>
                <input type="submit" />
            </form>

            <br></br>


            <br></br>

            <Button className="landing" conditionalLink={true} destination="/scoretype"
                    children="Continue"/>

        </div>
    )
}
