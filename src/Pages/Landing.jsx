import React, {useContext} from "react";
import axios from "axios";
import Form from "../Components/Form";
import {Button} from "../Components/Button.jsx";
import background from "../Assets/landing.png";
import "../Styles/Landing.css";
import {LandingContext} from "../App";
import {Card} from "reactstrap";

export default function Landing({setCode, setName, setAlias, setEmail, setZipCode, setGameUID, setHost}) {

    const {code, name, alias, email, zipCode, host} = useContext(LandingContext);

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

    const handleAliasChange = (aliasInput) => {
        setAlias(aliasInput);
    };

    function validateInputToCreateGame() {
        return (name !== "" && email !== "" && zipCode !== "" && alias !== "");
    }

    function validateInputToJoinGame() {
        return (code !== "" && validateInputToCreateGame());
    }

    function createGame() {
        if (validateInputToCreateGame()) {


            const postURL =
                "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/createNewGame";
            const payload = {
                user_name: name,
                user_alias: alias,
                user_email: email,
                user_zip: zipCode,
                // user_name: "Sam",
                // user_alias: "Sampat",
                // user_email: "sam@sjsu.edu",
                // user_zip: "95121",
            };

            axios.post(postURL, payload).then((res) => {
                console.log(res);
                setCode(res.data.game_code);

            })

            setHost(true);

        } else {
            window.alert("To create a game, fill out the necessary information");
        }
    }

    function joinGame() {
        if (validateInputToJoinGame()) {
            const getURL =
                "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/checkGame";

            axios.get(getURL + "/" + code).then((res) => {
                console.log(res);

                try {
                    if (res.data.warning === "Invalid game code") {
                        console.log("Looks like an invalid game code. Time to send you to the error screen");

                        window.location.href = "/error";
                    } else {
                        console.log("Else within try clause: No error message. Game on!");
                        setGameUID(res.data.game_uid);
                    }
                } catch {
                    console.log("Catch Clause: No error message. Game on!");

                }
            })

            setHost(false);

        } else {
            window.alert("To join a game, fill out the necessary information and the correct gamecode.");
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
            <Form
                className="input1"
                field="Alias (screen name)"
                onHandleChange={handleAliasChange}
            />
            <br></br>
            <br></br>

            <Button
                isSelected={true}
                onClick={createGame}
                className="landing"
                destination="/waiting"
                children="Create New Game"
                conditionalLink={validateInputToCreateGame()}
            />
            <div className="middleText">OR</div>
            <Form
                className="input1"
                field="Enter Game Code"
                onHandleChange={handleCodeChange}
            />
            <br></br>
            <Button
                isSelected={true}
                onClick={joinGame}
                className="landing"
                destination="/waiting"
                children="Join Game"
                conditionalLink={validateInputToJoinGame()}
            />

        </div>
    );
}


