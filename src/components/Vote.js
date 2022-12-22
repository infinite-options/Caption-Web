import React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useCookies } from 'react-cookie'
import { ably, getSubmittedCaptions, postVote, updateScores, leftOverVotingPlayers } from "../util/Api"
import { CountdownCircleTimer } from "react-countdown-circle-timer"
import "../styles/Vote.css"

export default function Vote(){
    const navigate = useNavigate(), location = useLocation()
    const [userData, setUserData] = useState(location.state)
    const [cookies, setCookie] = useCookies(["userData"])
    const channel = ably.channels.get(`BizBuz/${userData.gameCode}`)
    const [captions, setCaptions] = useState([])
    const [toggles, setToggles] = useState([])
    const [isMyCaption, setIsMyCaption] = useState("")
    const [voteSubmitted, setVoteSubmitted] = useState(false)
    const backgroundColors = { default: "white", selected: "#f9dd25", myCaption: "gray" }

    useEffect( () => {
        async function getCaptions(){
            const submittedCaptions = await getSubmittedCaptions(userData)
            let tempCaptions = []
            let tempToggles = []
            let isMyCaption = ""
            let onlyCaptionSubmitted = ""
            for(let i = 0; i < submittedCaptions.length; i++){
                if(submittedCaptions[i].caption === "")
                    continue
                if(submittedCaptions[i].round_user_uid === userData.playerUID)
                    isMyCaption = submittedCaptions[i].caption
                if(submittedCaptions[i].caption !== "")
                    onlyCaptionSubmitted = submittedCaptions[i].caption
                tempCaptions.push(submittedCaptions[i].caption)
            }
            for(let i = 0; i < tempCaptions.length; i++){
                tempToggles.push(false)
            }
            setCaptions(tempCaptions)
            setToggles(tempToggles)
            setIsMyCaption(isMyCaption)
            if(tempCaptions.length <= 1){
                if(tempCaptions.length === 1 && onlyCaptionSubmitted === isMyCaption){
                    await postVote(null, userData)
                }
                else if(tempCaptions.length === 1 && onlyCaptionSubmitted !== isMyCaption){
                    await postVote(onlyCaptionSubmitted, userData)
                }
                else if(tempCaptions.length === 0){
                    await postVote(null, userData)
                }
                await updateScores(userData)
                channel.publish({data: {message: "Start ScoreBoard"}})
            }
        }
        getCaptions()
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
        await updateScores(userData)
        //const numOfPlayersVoting = await leftOverVotingPlayers(userData)
        if(numOfPlayersVoting === 0){
            channel.publish({data: {message: "Start ScoreBoard"}})
        }
    }

    channel.subscribe( event => {
        if(event.data.message === "Start ScoreBoard"){
            navigate("/ScoreBoard", { state: userData })
        }
    })

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
                </div>
            }
            <br/>
        </div>
    )
}