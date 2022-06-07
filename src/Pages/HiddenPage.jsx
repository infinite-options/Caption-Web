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
    const [images, setImages] = useState(null);
    const [imagesURL, setImagesURL] = useState(null);

    // const id = document.getElementsByClassName("myfile")[0].value;
    // console.log("D: ", id);

    {/*Need some way to check that the input is an integer*/
    }
    const handleRoundsChange = (roundsInput) => {
       setRounds(parseInt(roundsInput));
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

    const handleSubmit = (e) => {
        e.preventDefault();
        const file = images;
        console.log('file = ', file);
        const postData = (data) => {
            const url = 'https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/uploadImage';
            console.log('data = ', data);
            axios.post(url,data,  {
                headers: {
                    'accept': 'application/json',
                    'Accept-Language': 'en-US,en;q=0.8',
                    'Content-Type': `multipart/form-data; boundary = ${data._boundary}`,
                },
            }).then(res => console.log('image.response = ', res)).catch(err => console.error('image.error = ', err));
            // fetch(url, {
            //     method: 'POST',
            //     mode: 'cors',
            //     headers: {
            //         'Content-Type': 'multipart/form-data',
            //     },
            //     body: JSON.stringify(data)
            // }).then(res => console.log('images = ', res)).catch(err => console.error('image error = ', err));
        };
        console.log('testing');
        const formData = new FormData();
        formData.append('image_title', file.name);
        formData.append('image_description', 'blank');
        formData.append('image_cost', 'blank');
        formData.append('image_file', file);
        postData(formData);

        // for (let i = 0; i < imagesURL.length; i++)
        // {
        //     const [imageURL, image] = [imagesURL[i], images[i]];
        //     console.log('imageURL = ', imageURL, ', image = ', image);
        //     const formData = new FormData();
        //     formData.append('image_title', image.name);
        //     formData.append('image_description', '');
        //     formData.append('image_cost', '');
        //     formData.append('image_file', image);
        //     postData(formData);
        // }
    };

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


            <h4>Select your images</h4>

            <br></br>

            <form method="POST" encType="multipart/form-data" onSubmit = {handleSubmit}>
                <label for="myfile">Select files:</label>
                <input
                    type="file"
                    id="myfile"
                    name="myfile"
                    multiple
                    onChange={(e) => {
                        console.log('here: selecting image with files = ', e.target.files);
                        setImages(e.target.files[0]);
                        
                        const tempURLs = [];
                        for (const file of e.target.files)
                        {
                            const imageURL = URL.createObjectURL(file);
                            tempURLs.push(imageURL);
                        }
                        setImagesURL(tempURLs);
                    }}
                /><br></br>
                <input type="submit" />
            </form>

            <br></br>


            <br></br>

            <Button className="landing" conditionalLink={true} destination="/"
                    children="Continue"/>

        </div>
    )
}
