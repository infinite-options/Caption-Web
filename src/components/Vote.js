import React from "react"
import { useState, useEffect ,useRef} from "react"
import { useNavigate, useLocation , Link } from "react-router-dom"
import { useCookies } from 'react-cookie'
import { ably, getSubmittedCaptions, postVote, sendError ,getScoreBoard } from "../util/Api"
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
    const [votedCaption, setvotedCaption] = useState(-1)
    const backgroundColors = { default: "white", selected: "#f9dd25", myCaption: "gray" }
    const isGameEnded = useRef(false)
    const isCaptionSubmitted = useRef(false)
    const [loadingImg, setloadingImg] = useState(true)

    if(cookies.userData != undefined && cookies.userData.imageURL !== userData.imageURL){
        async function sendingError(){
            let code1 = "Vote Page"
            let code2 = "userData.imageURL does not match cookies.userData.imageURL"
            console.log("vote:err")
            await sendError(code1, code2)
        }
        sendingError()
    }
    async function scoreBoard(){
        const scoreboard = await getScoreBoard(userData)
        scoreboard.sort((a, b) => b.game_score - a.game_score)
        return scoreboard
    }
    async function setSubmittedCaptions(submittedCaptions){
        // setisCaptionSubmitted(true)
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
        // console.log("tempCaptions")
        // console.log(tempCaptions)
        setIsMyCaption(myCaption)
        const updatedUserData = {
            ...userData,
            captions: submittedCaptions
        }
        setCookie("userData", updatedUserData, {path: '/'})
        if(tempCaptions.length <= 1){
            await skipVote(tempCaptions, onlyCaptionSubmitted, myCaption)
            // console.log("skipVote")
            // console.log(tempCaptions)
        }
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

    useEffect(() => {
        console.log("Start")
        console.log(captions)
        console.log(cookies.userData)
        if (captions.length === 0 && cookies.userData.captions != undefined) {
            setloadingImg(false)
            setSubmittedCaptions(cookies.userData.captions)
            isCaptionSubmitted.current = true
            console.log("get from cookie")
            console.log(cookies.userData.captions)
            
        }

        if(userData.host && cookies.userData.captions === undefined){
            async function getCaptions(){
                const submittedCaptions = await getSubmittedCaptions(userData)
                console.log("get from service")
                console.log(submittedCaptions)
                channel.publish({data: {
                    message: "Set Vote",
                    submittedCaptions: submittedCaptions
                }})
            }
            getCaptions()
        }

        

        channel.subscribe( event => {
            if (event.data.message === "Set Vote") {
                console.log("get from ably")
                console.log(event.data.submittedCaptions)
                isCaptionSubmitted.current = true
                setloadingImg(false)
                setSubmittedCaptions(event.data.submittedCaptions)
                
            }
            else if(event.data.message === "Start ScoreBoard"){
                setCookie("userData", userData, {path: '/'})
                navigate("/ScoreBoard", { state: userData })
            }
        })
    }, [userData])

    useEffect( () => {      
        channel.subscribe( event => {
            if (event.data.message === "EndGame vote") {
                if (!userData.host && !isGameEnded.current) {
                    isGameEnded.current = true
                    alert("Host has Ended the game")
                }
                const updatedUserData = {
                    ...userData,
                    scoreBoard: event.data.scoreBoard
                }
                setUserData(updatedUserData)
                setCookie("userData", updatedUserData, { path: '/' })
                navigate("/EndGame", { state: updatedUserData })
            }
        })
    }, [])
    async function getCaptionsForUser() {
        const submittedCaptions = await getSubmittedCaptions(userData)
        console.log("get from service:user")
        console.log(submittedCaptions)
        setloadingImg(false)
        setSubmittedCaptions(submittedCaptions)        
    }
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isCaptionSubmitted.current) {
                getCaptionsForUser()
                console.log(isCaptionSubmitted)
                isCaptionSubmitted.current = true
            }
        }, 5000);
      
        return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    }, [])
    async function closeButton() {
        let scoreboard = userData.scoreBoardEnd
        if (scoreboard === undefined) {
            scoreboard = await scoreBoard()
            for(let i = 0; i < scoreboard.length; i++){
                scoreboard[i].game_score = 0
            }
        }
        channel.publish({
            data: {
                message: "EndGame vote",
                scoreBoard : scoreboard
            }
        })
    }
    function updateToggles(index){
        if(captions[index] === isMyCaption)
            return
        let tempToggles = []
        for(let i = 0; i < toggles.length; i++){
            if (index === i) {
                tempToggles.push(true)
                setvotedCaption(i)
            } else
                tempToggles.push(false)
        }
        setToggles(tempToggles)
    }

    async function voteButton(timerComplete) {
        
        let numOfPlayersVoting = -1
        // for(let i = 0; i < toggles.length; i++){
        //     if(toggles[i] === true){
        //         votedCaption = captions[i]
        //     }
        // }
        if(votedCaption === -1 && !timerComplete){
            alert("Please vote for a caption.")
            return
        }
        setVoteSubmitted(true)
        if(votedCaption === -1 && timerComplete){
            numOfPlayersVoting = await postVote(null, userData)
        }
        else if(votedCaption !== -1){
            numOfPlayersVoting = await postVote(captions[votedCaption], userData)
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
            {userData.host &&
                < Link onClick={() => { window.confirm( 'Are you sure you want to end this game?', ) && closeButton() }} className ="closeBtn">
                    <i className="fa" >&#xf00d;</i>
                </Link>
            }
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
            <br />
            {loadingImg &&
                 <div>
                 <img src="/Loading_icon.gif" alt="loading CNN images"  width="250"  className="loadingimg"/>
                 {/* <br/> <h6> CNN Deck may take more time for loading </h6> */}
                 </div>
                // <img  href="" />

            }
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