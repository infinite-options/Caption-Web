
import React, {useState, useContext} from 'react'
import ReactCodeInput from "react-code-input";
import {Link} from "react-router-dom";
import "../Styles/Confirmation.css";
import {LandingContext} from "../App";
import { Button } from '../Components/Button';
import {useHistory} from "react-router-dom";
import axios from "axios";
export default function Confirmation(){
    const [temp, setTemp]=useState("");
    const {host, email} = useContext(LandingContext);
    const [input, setInput]=useState("");
    const [destination, setDestination] = useState("/waiting")
    const [correct, setCorrect] = useState(false);
    const answer = String("333")
    const history = useHistory();
    function changeTemp(e) {
        setTemp(e);
    }
    const handleValueInput = (e) => {
        setInput(temp);
        check();
        if(correct) {
            history.push('/waiting');
        }
      };
    function check() {
        var exists = false;
        const postURL =
                "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/checkEmailValidationCode";
        const payload = {
                email: email,
                code: temp
        };
        async function confirming() {
            await axios.post(postURL, payload).then((res) => {
                console.log(res.data.message);
                console.log(res);
                console.log(temp + " " + email);
                if (res.data.message==="Email has been verified") {
                    console.log("email is verified")
                    exists = true;
                    setCorrect(true);
                }
            })
        }
        confirming(); 
        console.log(correct);
        return exists;
    }

        return (
            <div class = "header">
                <h1>Confirmation Page</h1>
                <h5>{(input!==answer) ? "Please enter the code you got in the Email": null}</h5>
                
                
                <h3 class="confirmed">{(input===answer) ? "confirmed" : null}</h3>
                <h3 class="try">{(input!==answer&&input!=="") ? "Try Again" : null}</h3>
                {(input!==answer)?<div>
                    <ReactCodeInput type='text' fields={3}  onChange={(e) => changeTemp(e)}/>
                </div>:null}
                <button
                    onClick = {e=>handleValueInput(temp)}
                >
                    Submit
                </button>
               
                

            </div>
        )
}