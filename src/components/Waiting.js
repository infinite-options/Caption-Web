import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useCookies } from 'react-cookie'
import "../styles/Waiting.css"

export default function Waiting(){
    const navigate = useNavigate(), location = useLocation()
    const [userData, setUserData] = useState(location.state)

    console.log("Waiting userData: " + JSON.stringify(userData))

    return(
        <div className="waiting">
            <a href="#" className="gameRulesWaiting">
                <i className="fa fa-info-circle"></i>
                Game Rules
            </a>
            <h4 className="oneWaiting">
                Waiting for all players to join
            </h4>
        </div>
    )
}