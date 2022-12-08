import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useCookies } from 'react-cookie'
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import "../styles/Caption.css"

export default function Caption(){
    const navigate = useNavigate(), location = useLocation()
    const [userData, setUserData] = useState(location.state)
    const [cookies, setCookie] = useCookies(["userData"])
    const [caption, setCaption] = useState("")

    function handleChange(event){
        setCaption(event.target.value)
    }

    function submitButton(){
        //navigate("/Vote", { state: userData })
    }

    return(
        <div className="caption">
            <h1 className="titleCaption">
                {userData.deckTitle}
            </h1>
            <h3 className="roundCaption">
                Round: {userData.roundNumber}/{userData.numOfRounds}
            </h3>
            <br/>
            <img className="imgCaption" src={userData.imageURL} alt="Loading Image...."/>
            <br/>
            <input className="inputCaption" onChange={handleChange} type="text" placeholder="Enter your caption here"/>
            <div className="containerCaption">
                <CountdownCircleTimer
                    size={60}
                    strokeWidth={5}
                    isPlaying
                    duration={userData.roundTime}
                    colors="#000000"
                    onComplete={() => {

                    }}
                >
                    {({remainingTime}) => {
                        return (<div className="countdownCaption">{remainingTime}</div>);
                    }}
                </CountdownCircleTimer>
            </div>
            <button className="submitCaption" onClick={submitButton}>
                Submit
            </button>
            <br/>
            <br/>
        </div>
    )
}