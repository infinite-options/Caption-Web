import React, {useEffect, useState} from "react";
import Pic from "../Assets/sd.jpg";
import {Row, Col, Card} from "reactstrap";
import "../Styles/Scoreboard.css";
import Report from "../Components/Report";
import {Button} from "../Components/Button";
import background from "../Assets/temp.png";
import axios from "axios";
import Deck from "../Components/Deck";


function Scoreboard(props) {
    // const title = props.title;
    // const bestCaption = "Two dudes watching the Sharknado trailer";


    const [toggleArr, setToggleArr] = useState([]);
    const [playersArr, setPlayersArr] = useState([]);
    const [selectedCaption, setSelectedCaption] = useState("");


    useEffect(() => {

        const getURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getAllSubmittedCaptions/39827741,1";
        axios.get(getURL).then((res) => {
            console.log(res);
            setPlayersArr(res.data.players);

            /**
             * Initialize the toggle array with the correct size and populate the array with all false values
             */
            toggleArr.length = res.data.players.length;
            for (var i = 0; i < toggleArr.length; i++) {
                toggleArr[i] = false;
            }
        })

        console.log("Toggle Arr: " + toggleArr);
    }, []);


    function changeToggle(index) {
        console.log("Called: " + index);
        for (var i = 0; i < toggleArr.length; i++) {
            toggleArr[i] = false;
        }
        toggleArr[index] = true;

        setSelectedCaption(playersArr[index].caption);

        console.log("Result: " + toggleArr);
        // setToggleState(index);
    }

    function postVote(){
        const postURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/voteCaption";

        const payload = {
            caption: selectedCaption,
            game_code: "39827741",
            round_number: "1",
        }

        axios.post(postURL,payload).then((res) => {
            console.log(res);
        })
    }

    function renderCaptions() {

        var captions = [];
        for (var index = 0; index < playersArr.length; index++) {
            /**
             * The value of index continues to increment due to the loop,
             * so let's make a variable that does not change for the onClick function
             * @type {number}
             */
            let localIndex = index;

            captions.push(<div>
                <Button
                    isSelected={toggleArr[index]}
                    className="selectionBtn1"

                    children={playersArr[index].caption}
                    destination="/selection"
                    onClick={() => changeToggle(localIndex)}
                    conditionalLink={true}
                />
                <br></br>
            </div>);
            console.log(index);
        }
        return <div>{captions}</div>;
    }


    return (
        <div
            style={{
                maxWidth: "375px",
                height: "100%",
                //As long as I import the image from my package strcuture, I can use them like so
                backgroundImage: `url(${background})`,
                // backgroundImage:
                //   "url('https://images.unsplash.com/photo-1557683325-3ba8f0df79de?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTZ8fHxlbnwwfHx8fA%3D%3D&w=1000&q=80')",
            }}
        >
            <br></br>
            <h1>Name of Deck</h1>
            <br></br>

            <h4 classname="row">Pick Your Favorite Caption</h4>
            <br></br>
            {/*<img className="img2" src={Pic} />*/}
            <img style={{
                objectFit: "cover",
                height: "325px",
                width: "325px",
                borderRadius: "50px",
            }} src={Pic}/>

            <br></br>
            <br></br>

            {renderCaptions()}

            <Button className="fat" destination="/selection" children="Vote" onClick = {postVote} conditionalLink={true}/>
            <br></br>
        </div>
    );
}

export default Scoreboard;
