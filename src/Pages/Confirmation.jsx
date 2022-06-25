
import React, {useState, useContext} from 'react'
import ReactCodeInput from "react-code-input";
import "../Styles/Confirmation.css";
import {LandingContext} from "../App";
import {useHistory} from "react-router-dom";
import axios from "axios";
//import {setTimeout} from "timers/promises";

export default function Confirmation({setCode, setName, setAlias, setEmail, setZipCode, setGameUID, setHost, setPlayerUID, client, channel, setRoundNumber, setRounds}){
    const [temp, setTemp]=useState("");
    const {code, name, alias, email, zipCode, host, playerUID} = useContext(LandingContext);
    const [input, setInput]=useState("");
    //var correct = true;
    const [correct, setCorrect] = useState(true);
    const history = useHistory();
    //var random = true;

    

    

    async function createGame() {
            //console.log(random + "inside async create game");
            //random =false;
            //console.log(random + "inside async create game");
            const postURL =
                "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/createNewGame";
            const payload = {
                user_name: name,
                user_alias: alias,
                user_email: email,
                user_zip: zipCode,
                game_code: code,
            };

            axios.post(postURL, payload).then((res) => {
                // console.log('create-res = ', res);
                // //setCode(res.data.game_code);
                // setPlayerUID(res.data.host_id);
                
                console.log(res);
                console.log(res.data.game_code);
                console.log(res.data.game_uid);
                //setCode(res.data.game_code);
                setGameUID(res.data.game_uid);
                setPlayerUID(res.data.user_uid);


                console.log("Email validation code is ")

                pub(res.data.game_code);
            });

    }

    const pub = (game_code) => {
        console.log("Made it to Pub");
        const channel = client.channels.get(`Captions/Waiting/${game_code}`);
        channel.publish({data: {newPlayerName: alias}});
    };

    async function joinGame() {
        
            const postURL =
                "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/joinGame";

            const payload = {
                user_name: name,
                user_alias: alias,
                user_email: email,
                user_zip: zipCode,
                game_code: code,
            };

            await axios.post(postURL, payload).then((res) => {
                console.log(res);
                setGameUID(res.data.game_uid);
                setPlayerUID(res.data.user_uid);
                // pub(code);



                try {  
                    if (res.data.message === "Invalid game code") {
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

            

    }

    // useEffect(() => {
    //     const changeCorrect = async () => {
    //       setCorrect(false);
    //     };
          
    //   });

    function changeTemp(e) {
        setTemp(e);
    }
    async function afterIncorrectCode() {
        setCorrect(false);
        setTimeout(() => {  console.log(correct); }, 2000);
        //await setTimeout(500);
        console.log("else: Inside confirming call" + correct);
    }
    
    async function actualHandling() {
        console.log(input);
        setInput(temp);
        console.log(input);
        console.log(playerUID)
        const postURL =
                "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/checkEmailValidationCode";
        const payload = {
                user_uid: playerUID,
                code: temp
        };
        
        await axios.post(postURL, payload).then((res) => {
            console.log(res.data.message);
            console.log(res);
            console.log(temp + " " + email);
            if (res.data.email_validated_status==="TRUE") {
                console.log("email is verified")
                    //exists = true;
                
                console.log("Inside confirming call" + correct)
                    //correct = true
                    //console.log("Inside confirming call" + correct)
                //call api call to actually create the game based on host
                if(!host) {
                    //joinGame();
                }
                
                history.push('/waiting');
            }
            else {
                //correct = false;
                afterIncorrectCode();
                
            }
        });
    }
    

    const handleValueInput = (e) => {
       actualHandling();
      };
    // function check() {
    //     //var exists = false;
    //     const postURL =
    //             "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/checkEmailValidationCode";
    //     const payload = {
    //             email: email,
    //             code: temp
    //     };
    //     function confirming() {
    //         axios.post(postURL, payload).then((res) => {
    //             console.log(res.data.message);
    //             console.log(res);
    //             console.log(temp + " " + email);
    //             if (res.data.message==="Email has been verified") {
    //                 console.log("email is verified")
    //                 //exists = true;
    //                 setCorrect(true);
    //                 console.log("Inside confirming call" + correct)
    //                 //correct = true
    //                 //console.log("Inside confirming call" + correct)
    //             }
    //         })
    //     }
    //     confirming(); 
    //     console.log("after confirming" + correct);
    //     //return exists;
    // }

        return (
            <div class = "header">
                <h1>Confirmation Page</h1>
                <h5>Please enter the code you got in the Email</h5>
                
                {/* <h3>Var Correct: {String(correct)}</h3> */}
                <h3 class="try">{(!correct) ? "Try Again" : null}</h3>
                {/* <h3>{(random) ? "random" : null}</h3> */}
                {/* <h3>Var Correct: {String(correct)}</h3> */}
                <div>
                    <ReactCodeInput type='text' fields={3}  onChange={(e) => changeTemp(e)}/>
                </div>
                <button
                    onClick = {e=>handleValueInput(temp)}
                >
                    Submit
                </button>
               
                

            </div>
        );
}