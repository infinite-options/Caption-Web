import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useCookies } from 'react-cookie'
import { ably, submitCaption, sendError } from "../util/Api"
import { CountdownCircleTimer } from "react-countdown-circle-timer"
import "../styles/Caption.css"

export default function Caption(){
    const navigate = useNavigate(), location = useLocation()
    const [userData, setUserData] = useState(location.state)
    const [cookies, setCookie] = useCookies(["userData"])
    const channel = ably.channels.get(`BizBuz/${userData.gameCode}`)
    const [caption, setCaption] = useState("")
    const [captionSubmitted, setCaptionSubmitted] = useState(false)

    if(cookies.userData != undefined && cookies.userData.imageURL !== userData.imageURL){
        async function sendingError(){
            let code1 = "Caption Page"
            let code2 = "userData.imageURL does not match cookies.userData.imageURL"
            await sendError(code1, code2)
        }
        sendingError()
    }

    function handleChange(event){
        setCaption(event.target.value)
    }

    async function submitButton(timerComplete) {
        let numOfPlayersSubmitting = -1
        if (caption === "" && !timerComplete) {
            alert("Please enter a valid caption.")
            return
        }
        else if(caption !== "" && !timerComplete){
            setCaptionSubmitted(true)
            numOfPlayersSubmitting = await submitCaption(caption, userData)
        }
        else if (timerComplete) {
            numOfPlayersSubmitting = await submitCaption(caption, userData)
        }
        if(numOfPlayersSubmitting === 0){
            channel.publish({data: {message: "Start Vote"}})
        }
    }

    channel.subscribe( event => {
        if(event.data.message === "Start Vote"){
            navigate("/Vote", { state: userData })
        }
    })

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
            {!captionSubmitted &&
                <input className="inputCaption" onChange={handleChange} type="text" placeholder="Enter your caption here"/>
            }
            <div className="containerCaption">
                <CountdownCircleTimer
                    size={60}
                    strokeWidth={5}
                    isPlaying
                    duration={userData.roundTime}
                    colors="#000000"
                    onComplete={() => {
                        if(!captionSubmitted){
                            submitButton(true)
                        }
                    }}
                >
                    {({remainingTime}) => {
                        return (<div className="countdownCaption">{remainingTime}</div>);
                    }}
                </CountdownCircleTimer>
            </div>
            {!captionSubmitted &&
                <button className="submitCaption" onClick={event => submitButton(false)}>
                    Submit
                </button>
            }
            {captionSubmitted &&
                <div className="submittedCaption">
                    <button className="submitCaption">
                        Submitted
                    </button>
                    <br/>
                    Waiting for other players to submit captions...
                </div>
            }
            <br/>
            <br/>
        </div>
    )
}