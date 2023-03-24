import { useState, useEffect } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { useCookies } from 'react-cookie'
import { ably, getDecks, getCnnImageURLS } from "../util/Api.js"
import "../styles/CnnDeck.css"

export default function CnnDeck(){
    const navigate = useNavigate(), location = useLocation()
    const [userData, setUserData] = useState(location.state)
    const [cookies, setCookie] = useCookies(["userData"])
    const [CNNImageURL, setCNNImageURL] = useState([])
    const [loadingImg, setloadingImg] = useState(true)
    const channel = ably.channels.get(`BizBuz/${userData.gameCode}`)

    useEffect( () => {
        async function getCnnURLS(){
            const CNNImageURL = await getCnnImageURLS()
            setloadingImg(false)
            setCNNImageURL(CNNImageURL)
        }
        getCnnURLS()
    }, [])

    async function handleClick(Link_Url) {
        const updatedUserData = {
            ...userData,
            CNN_URL: Link_Url,
        }
        setUserData(updatedUserData)
        setCookie("userData", updatedUserData, {path: '/'})
        navigate("/Waiting", {state: updatedUserData})
    }

    return(
        <div className="CNNDeck">
            <img src={userData.deckThumbnail_url} alt={userData.deckTitle} className="CNNdeck-image" />
            <h4 className="oneSelectDeck">Select a CNN Image URL</h4>
            <br/>
            <br />
            {loadingImg &&
                <img src="/Loading_icon.gif" alt="loading CNN images"  width="250" />
                // <img  href="" />

            }
            <ul className="CNNdeck-container">
                {CNNImageURL.map((CNNImages, index) => {
                    if(CNNImages.article_link !== "PRIVATE"){
                        return(
                            <div key={index} onClick={event => handleClick(CNNImages.article_link)} className="CNNWeekdeck">
                                    <div className="CNNdeck-background">
                                    <img src={CNNImages.thumbnail_link} alt={CNNImages.date} className="deck-image"/>
                                <div className="CNNdeckText">
                                        {CNNImages.date} 
                                    </div>
                                </div>
                                <br/>
                            </div>
                        )
                    }
                })}
            </ul>
        </div>
    )
}