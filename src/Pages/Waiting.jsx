import React, {useContext, useEffect, useState} from 'react'
import axios from "axios";
import circle from "../Assets/circle.png";
import thing from "../Assets/idk.png";
import {Button} from '../Components/Button';
import "../Styles/Waiting.css";
import {Row, Col, Card} from "reactstrap";
import Deck from "../Components/Deck";
import {LandingContext} from "../App";


export default function Waiting() {

    const {code, gameUID, host} = useContext(LandingContext);
    // const [names, setNames] = useEffect([]);

    let gameCodeText = "Game Code: " + code;
    const [names, setNames] = useState({});

    // const names = [
    //     "Mike",
    //     "Ron",
    //     "Emma",
    //     "Flo",
    //     "Lola",
    //
    // ];

    // const [names, setNames] = useEffect([]);
    const [namesLoaded, setNamesLoaded] = useState(false);


    useEffect(() => {
        const getURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getPlayers/200-002006";
        axios.get(getURL).then((res) => {
            console.log(res);
            setNames(res.data.players_list);
            var map4 = new Map([[["first name", "last name"],
                ["sumit", "ghosh"]],
                [["friend 1", "friend 2"],
                    ["sourav","gourav"]]]);

            // setNames(map4);
            console.log(names);

            console.log("Map4");
            console.log(map4);
            //
            // let iterator1 = res.data.players_list.entries();


            // console.log(keys);

        })
    }, []);

    function printNames(){
        console.log(names);
    }

    return (
        <div
            style={{
                maxWidth: "375px",
                height: "812px",
            }}
        >

            <img className="innerImage1" src={circle}/>
            <img className="innerImage2" src={thing}/>

            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>

            {/* <div className = "spacer"/> */}

            <h4>Waiting for all players to join</h4>

            <ul className="flex-container">
                {/*{names.map((value) => (*/}

                {/*    <li className="flex-item">*/}
                {/*        {value !== "" ? <i className="fas fa-circle fa-3x" style = {{*/}
                {/*            height: "200px",*/}
                {/*            color: "purple"*/}
                {/*        }}/> : ""}*/}

                {/*        {value}*/}
                {/*    </li>*/}
                {/*))}*/}


            </ul>


            <Button
                className="cardStyle"
                children={gameCodeText}
            />
            <br></br>

            <Button
                className="landing"
                children="Share with other players"
                onClick={printNames}
                destination="/waiting"
                conditionalLink={true}
            />

            <br></br>

            {/*{host ? <Button*/}
            {/*    className="landing"*/}
            {/*    children="Start Game"*/}
            {/*    destination="/collections"*/}
            {/*    conditionalLink={true}*/}
            {/*/> : <></>}*/}

            <Button
                className="landing"
                children="Start Game"
                destination="/collections"
                conditionalLink={true}
            />


        </div>
    )
}

// export function joinGame() {
//
//     const {code, name, alias, email, zipCode} = useContext(LandingContext);
//
//
//     if (name !== "" && email !== "" && zipCode !== "") {
//         const getURL =
//             "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/checkGame";
//
//         axios.get(getURL + "/" + code).then((res) => {
//             console.log(res);
//         })
//
//     } else {
//         window.alert("To join a game, fill out the necessary information and the correct gamecode.");
//     }
// }