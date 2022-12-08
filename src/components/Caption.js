import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useCookies } from 'react-cookie'
import "../styles/Caption.css"

export default function Caption(){
    const navigate = useNavigate(), location = useLocation()
    const [userData, setUserData] = useState(location.state)
    const [cookies, setCookie] = useCookies(["userData"])

    console.log("Caption userData: ", userData)

    return(
        <div className="caption">
            <h1>
                {userData.deckTitle}
            </h1>
        </div>
    )
}