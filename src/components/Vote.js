import React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useCookies } from 'react-cookie'
import { ably, getSubmittedCaptions, postVote, sendError } from "../util/Api"
import { CountdownCircleTimer } from "react-countdown-circle-timer"
import "../styles/Vote.css"
import * as ReactBootStrap from "react-bootstrap";

export default function Vote(){
    const navigate = useNavigate(), location = useLocation()
    const [userData, setUserData] = useState(location.state)
    const [cookies, setCookie] = useCookies(["userData"])
    const channel = ably.channels.get(`BizBuz/${userData.gameCode}/${userData.roundNumber}`)
    const [captions, setCaptions] = useState([])
    const [toggles, setToggles] = useState([])
    const [isMyCaption, setIsMyCaption] = useState("")
    const [voteSubmitted, setVoteSubmitted] = useState(false)
    const backgroundColors = { default: "white", selected: "#f9dd25", myCaption: "gray" }

    if(cookies.userData != undefined && cookies.userData.imageURL !== userData.imageURL){
        async function sendingError(){
            let code1 = "Vote Page"
            let code2 = "userData.imageURL does not match cookies.userData.imageURL"
            await sendError(code1, code2)
        }
        sendingError()
    }

    useEffect( () => {
        if(captions.length === 0 && cookies.userData.captions != undefined){
            setSubmittedCaptions(cookies.userData.captions)
        }

        if(userData.host && cookies.userData.captions === undefined){
            async function getCaptions(){
                const submittedCaptions = await getSubmittedCaptions(userData)
                channel.publish({data: {
                    message: "Set Vote",
                    submittedCaptions: submittedCaptions
                }})
            }
            getCaptions()
        }

        async function skipVote(tempCaptions, onlyCaptionSubmitted, myCaption){
            if(tempCaptions.length === 1 && onlyCaptionSubmitted === myCaption){
                await postVote(null, userData)
            }
            else if(tempCaptions.length === 1 && onlyCaptionSubmitted !== myCaption){
                await postVote(onlyCaptionSubmitted, userData)
            }
            else if(tempCaptions.length === 0){
                await postVote(null, userData)
            }
            setCookie("userData", userData, {path: '/'})
            navigate("/ScoreBoard", { state: userData })
        }

        async function setSubmittedCaptions(submittedCaptions){
            let tempCaptions = []
            let tempToggles = []
            let myCaption = ""
            let onlyCaptionSubmitted = ""
            for(let i = 0; i < submittedCaptions.length; i++){
                if(submittedCaptions[i].caption === "")
                    continue
                if(submittedCaptions[i].round_user_uid === userData.playerUID)
                    myCaption = submittedCaptions[i].caption
                if(submittedCaptions[i].caption !== "")
                    onlyCaptionSubmitted = submittedCaptions[i].caption
                tempCaptions.push(submittedCaptions[i].caption)
            }
            for(let i = 0; i < tempCaptions.length; i++){
                tempToggles.push(false)
            }
            setCaptions(tempCaptions)
            setToggles(tempToggles)
            setIsMyCaption(myCaption)
            const updatedUserData = {
                ...userData,
                captions: submittedCaptions
            }
            setCookie("userData", updatedUserData, {path: '/'})
            if(tempCaptions.length <= 1){
                await skipVote(tempCaptions, onlyCaptionSubmitted, myCaption)
            }
        }

        channel.subscribe( event => {
            if(event.data.message === "Set Vote"){
                setSubmittedCaptions(event.data.submittedCaptions)
            }
            else if(event.data.message === "Start ScoreBoard"){
                setCookie("userData", userData, {path: '/'})
                navigate("/ScoreBoard", { state: userData })
            }
        })
    }, [userData])

    function updateToggles(index){
        if(captions[index] === isMyCaption)
            return
        let tempToggles = []
        for(let i = 0; i < toggles.length; i++){
            if(index === i)
                tempToggles.push(true)
            else
                tempToggles.push(false)
        }
        setToggles(tempToggles)
    }

    async function voteButton(timerComplete){
        let votedCaption = ""
        let numOfPlayersVoting = -1
        for(let i = 0; i < toggles.length; i++){
            if(toggles[i] === true){
                setVoteSubmitted(true)
                votedCaption = captions[i]
            }
        }
        if(votedCaption === "" && !timerComplete){
            alert("Please vote for a caption.")
            return
        }
        else if(votedCaption === "" && timerComplete){
            numOfPlayersVoting = await postVote(null, userData)
        }
        else if(votedCaption !== ""){
            numOfPlayersVoting = await postVote(votedCaption, userData)
        }
        if(numOfPlayersVoting === 0){
            channel.publish({data: {message: "Start ScoreBoard"}})
        }
    }

    function getBackgroundColor(status){
        return backgroundColors[status]
    }

    return(
        <div className="vote">
            <h1 className="titleCaption">
                {userData.deckTitle}
            </h1>
            <h3 className="roundCaption">
                Round: {userData.roundNumber}/{userData.numOfRounds}
            </h3>
            <br/>
            <h4 className="favoriteVote">Vote your favorite caption</h4>
            <br/>
            <img className="imgVote" src={userData.imageURL}/>
            <br/>
            <div className="captionsContainerVote">
                {captions.map((caption, index) => {
                    let status = ""
                    if(caption === isMyCaption)
                        status = "myCaption"
                    else if(toggles[index] === true)
                        status = "selected"
                    else
                        status = "default"
                    return(
                        <React.Fragment key={index}>
                            <button
                                style={{backgroundColor: getBackgroundColor(status)}}
                                className="buttonVote"
                                onClick={event => updateToggles(index)}
                            >
                                {caption}
                            </button>
                            <br/>
                        </React.Fragment>
                    )
                })}
            </div>
            <div className="timerContainerVote">
                <CountdownCircleTimer
                    size={60}
                    strokeWidth={5}
                    isPlaying
                    duration={userData.roundTime}
                    colors="#000000"
                    onComplete={() => {
                        if(!voteSubmitted){
                            voteButton(true)
                        }
                    }}
                >
                    {({remainingTime}) => {
                        return (<div className="countdownVote">{remainingTime}</div>);
                    }}
                </CountdownCircleTimer>
            </div>
            {!voteSubmitted &&
                <button className="submitVote" onClick={event => voteButton(false)}>
                    Vote
                </button>
            }
            {voteSubmitted &&
                <div className="submittedVote">
                    <br/>
                    <b>Vote submitted.</b>
                    <br/>
                    Waiting for other players to submit votes...
                    <br/>
                    <ReactBootStrap.Spinner animation="border" role="status"/>
                </div>
            }
            <br/>
        </div>
    )
}