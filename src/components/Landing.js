import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useCookies } from 'react-cookie'
import { ably, addUser, checkGameCode, joinGame } from "../util/Api"
import "../styles/Landing.css"

export default function Landing(){
    const navigate = useNavigate()
    const [userData, setUserData] = useState({name: "", email: "", zipCode: "", alias: ""})
    const [cookies, setCookie] = useCookies(["userData"])
    const [cookiesUsed, setCookiesUsed] = useState(false)

    if(!cookiesUsed && cookies.userData != undefined) {
        userData.name = cookies.userData.name
        userData.email = cookies.userData.email
        userData.zipCode = cookies.userData.zipCode
        userData.alias = cookies.userData.alias
        setCookiesUsed(true)
    }

    function handleChange(event){
        if(event.target.name === "name"){
            setUserData({
                ...userData,
                name: event.target.value
            })
        }
        else if(event.target.name === "email"){
            setUserData({
                ...userData,
                email: event.target.value
            })
        }
        else if(event.target.name === "zipCode"){
            setUserData({
                ...userData,
                zipCode: event.target.value
            })
        }
        else if(event.target.name === "alias"){
            setUserData({
                ...userData,
                alias: event.target.value
            })
        }
        else if(event.target.name === "gameCode"){
            setUserData({
                ...userData,
                gameCode: event.target.value
            })
        }
    }

    function validateUserData(){
        const testEmail = /[\w\d]{1,}@[\w\d]{1,}.[\w\d]{1,}/
        const testZipCode = /^\d{5}$/
        if(userData.name === ""){
            alert("Please enter a valid name.")
            return false
        }
        else if(!testEmail.test(userData.email.toLowerCase())){
            alert("Please enter a valid email address.")
            return false
        }
        else if(!testZipCode.test(userData.zipCode)){
            alert("Please enter a valid zip code.")
            return false
        }
        else if(userData.alias === ""){
            alert("Please enter a valid alias.")
            return false
        }
        return true
    }

    async function createNewGameButton() {
        if (!validateUserData())
            return
        const playerInfo = await addUser(userData)
        const updatedUserData = {
            ...userData,
            roundNumber: 1,
            host: true,
            playerUID: playerInfo.user_uid
        }
        setUserData(updatedUserData)
        setCookie("userData", updatedUserData, {path: '/'})
        if(playerInfo.user_code === "TRUE")
            navigate("/ScoreType", {state: updatedUserData})
        else
            navigate("/Confirmation", {state: updatedUserData})
    }

    async function joinGameButton() {
        if (!validateUserData())
            return
        if(!await checkGameCode(userData.gameCode))
            return
        const playerInfo = await addUser(userData)
        const updatedUserData = {
            ...userData,
            roundNumber: 1,
            host: false,
            playerUID: playerInfo.user_uid
        }
        setUserData(updatedUserData)
        setCookie("userData", updatedUserData, {path: '/'})
        if(playerInfo.user_code === "TRUE"){
            await joinGame(updatedUserData)
            const channel = ably.channels.get(`BizBuz/${updatedUserData.gameCode}`)
            channel.publish({data: {message: "New Player Joined Lobby"}})
            navigate("/Waiting", {state: updatedUserData})
        }
        else
            navigate("/Confirmation", {state: updatedUserData})
    }

    return(
        <div className="landing">
            <Link to="/GameRules" className="gameRulesLanding">
                <i className="fa fa-info-circle"></i>
                Game Rules
            </Link>
            {cookies.userData != undefined ?
                <form className="userDataFormLanding" onChange={handleChange}>
                    <input className="inputLanding" type="text" name="name" defaultValue={cookies.userData.name}/>
                    <br/>
                    <br/>
                    <input className="inputLanding" type="text" name="email" defaultValue={cookies.userData.email}/>
                    <br/>
                    <br/>
                    <input className="inputLanding" type="text" name="zipCode" defaultValue={cookies.userData.zipCode}/>
                    <br/>
                    <br/>
                    <input className="inputLanding" type="text" name="alias" defaultValue={cookies.userData.alias}/>
                </form> :
                <form className="userDataFormLanding" onChange={handleChange}>
                    <input className="inputLanding" type="text" name="name" placeholder="Your Name"/>
                    <br/>
                    <br/>
                    <input className="inputLanding" type="text" name="email" placeholder="Email Address"/>
                    <br/>
                    <br/>
                    <input className="inputLanding" type="text" name="zipCode" placeholder="Zip Code"/>
                    <br/>
                    <br/>
                    <input className="inputLanding" type="text" name="alias" placeholder="Alias (screen name)"/>
                </form>
            }
            <button className="buttonLanding" onClick={createNewGameButton}>
                Create New Game
            </button>
            <div className="textLanding">
                OR
            </div>
            <input className="inputGameCode" onChange={handleChange} type="text" name="gameCode" placeholder="Enter Game Code"/>
            <button className="buttonLanding" onClick={joinGameButton}>
                Join Game
            </button>
        </div>
    )
}