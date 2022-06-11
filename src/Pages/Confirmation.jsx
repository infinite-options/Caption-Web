
import React, {useState, useContext} from 'react'
import ReactCodeInput from "react-code-input";
import {Link} from "react-router-dom";
import "../Styles/Confirmation.css";
import {LandingContext} from "../App";
import { Button } from '../Components/Button';
import axios from "axios";
export default function Confirmation(){
    const [temp, setTemp]=useState("");
    const [isConfirmed, setIsConfirmed] = useState(false);
    const answer = String(333)
    const {host, email} = useContext(LandingContext);
    const [input, setInput]=useState("");
    const [destination, setDestination] = useState("/waiting")

    function changeTemp(e) {
        setTemp(e);
    }
    const handleValueInput = (e) => {
        setInput(temp);
        if (input===answer) {
            setIsConfirmed(true)
        }
      };
    function check() {
        // const postURL =
        //         "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/createNewGame";
        //     const payload = {
        //         user_code: temp,
        //         user_email: email,
        //     };

        //     axios.post(postURL, payload).then((res) => {
        //         console.log('create-res = ', res);
        //     });
          return temp===answer
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
                <Link to={check() ? destination : "/confirmation"}>
                    <button
                        onClick = {e=>handleValueInput(temp)}
                    >
                        Submit
                    </button>
                </Link>
               
                

            </div>
        )
}