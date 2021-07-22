import React, {useContext} from "react";
import axios from "axios";
import Form from "../Components/Form";
import {Button} from "../Components/Button.jsx";
import background from "../Assets/landing.png";
import "../Styles/Landing.css";
import {LandingContext} from "../App";

export default function Landing({setCode, setName, setEmail, setZipCode}) {

    const {code, name, email, zipCode} = useContext(LandingContext);

    const handleCodeChange = (codeInput) => {
        setCode(codeInput);

    };

    const handleNameChange = (nameInput) => {
        setName(nameInput);
    };

    const handleEmailChange = (emailInput) => {
        setEmail(emailInput);
    };

    const handleZipCodeChange = (zipCodeInput) => {
        setZipCode(zipCodeInput);
    };

    function createGame() {
        if (name !== "" && email !== "" && zipCode !== "") {


            const postURL =
                "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/createNewGame";
            const payload = {
                user_name: name,
                user_alias: "mickey",
                user_email: email,
                user_zip: zipCode,
            };

            axios.post(postURL, payload).then((res) => {
                console.log(res);
                setCode(res.data.game_code);

            })


            // window.location.href = "/waiting";
        } else {
            window.alert("In order to create a new game please provide your name, email, and zip code.");
        }
    }

    function joinGame() {

        if (name !== "" && email !== "" && zipCode !== "") {
            const getURL =
                "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/checkGame";

            axios.get(getURL + "/" + code).then((res) => {
                console.log(res);
            });
        } else {
            window.alert("In order to create a new game please provide your name, email, and zip code.");
        }
    }

    return (
        <div
            style={{
                maxWidth: "375px",
                height: "812px",
                backgroundImage: `url(${background})`,
            }}
        >
            <div className="spacer"/>
            <Form
                className="input1"
                field="Your Name"
                onHandleChange={handleNameChange}
            />
            <br></br>
            <Form
                className="input1"
                field="Email Address"
                onHandleChange={handleEmailChange}
            />
            <br></br>
            <Form
                className="input1"
                field="Zip Code"
                onHandleChange={handleZipCodeChange}
            />
            <br></br>
            <br></br>
            <br></br>

            <Button
                onClick={createGame}
                className="landing"
                destination="/waiting"
            >
                Create New Game
            </Button>
            <div className="middleText">OR</div>
            <Form
                className="input1"
                field="Enter Game Code"
                onHandleChange={handleCodeChange}
            />
            <br></br>
            <Button
                onClick={joinGame}
                className="landing"
                // destination="/collections"
            >
                Join Game
            </Button>

        </div>
    );
}


